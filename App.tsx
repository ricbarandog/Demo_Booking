
import React, { useState, useCallback, useMemo } from 'react';
import { 
  User, 
  LayoutGrid, 
  Clock, 
  Mail, 
  MessageCircle, 
  MapPin, 
  ShieldCheck, 
  ChevronRight, 
  CreditCard,
  Trophy,
  Menu,
  Calendar,
  Sparkles
} from 'lucide-react';
import BookingCalendar from './components/BookingCalendar.tsx';
import SuccessModal from './components/SuccessModal.tsx';
import NewsCard from './components/NewsCard.tsx';
import ChatBot from './components/ChatBot.tsx';
import AdminDashboard from './components/AdminDashboard.tsx';
import AdminLogin from './components/AdminLogin.tsx';
import WaitlistModal from './components/WaitlistModal.tsx';
import MemberSignUpModal from './components/MemberSignUpModal.tsx';
import { INITIAL_MOCK_SLOTS, INITIAL_MOCK_NEWS, CLUB_RATES } from './constants.ts';
import { BookingDetails, TimeSlot, NewsItem, WaitlistEntry, Member } from './types.ts';
import { supabase } from './supabase.ts';

const App: React.FC = () => {
  const [slots, setSlots] = useState<TimeSlot[]>(INITIAL_MOCK_SLOTS);
  const [news, setNews] = useState<NewsItem[]>(INITIAL_MOCK_NEWS);
  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [showWaitlistModal, setShowWaitlistModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [reservations, setReservations] = useState<BookingDetails[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  // Fetch data from Supabase on mount
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Reservations
        const { data: resData, error: resError } = await supabase
          .from('reservations')
          .select('*')
          .order('date', { ascending: true });
        
        if (!resError && resData) {
          setReservations(resData.map(r => ({
            ...r,
            date: new Date(r.date),
            playerType: r.player_type,
            totalPaid: r.total_paid
          })));
          
          // Update slots availability based on today's reservations
          const today = new Date().toISOString().split('T')[0];
          const todayRes = resData.filter(r => r.date === today);
          setSlots(prev => prev.map(s => ({
            ...s,
            isAvailable: !todayRes.some(r => r.time === s.time)
          })));
        }

        // Fetch Waitlist
        const { data: wlData, error: wlError } = await supabase
          .from('waitlist')
          .select('*')
          .order('timestamp', { ascending: true });
        
        if (!wlError && wlData) {
          setWaitlist(wlData.map(w => ({
            ...w,
            timestamp: new Date(w.timestamp)
          })));
        }

        // Fetch Members
        const { data: memData, error: memError } = await supabase
          .from('members')
          .select('*')
          .order('joined_at', { ascending: true });
        
        if (!memError && memData) {
          setMembers(memData.map(m => ({
            ...m,
            joinedAt: new Date(m.joined_at)
          })));
        }
      } catch (err) {
        console.error('Error fetching from Supabase:', err);
      }
    };

    fetchData();
  }, []);

  // Booking State
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [duration, setDuration] = useState<60 | 90>(60);
  const [playerType, setPlayerType] = useState<'Member' | 'Guest'>('Guest');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [notification, setNotification] = useState<'SMS' | 'WhatsApp'>('WhatsApp');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [lastBooking, setLastBooking] = useState<BookingDetails | null>(null);

  const calculatedPrice = useMemo(() => {
    const hourlyRate = playerType === 'Member' ? CLUB_RATES.member : CLUB_RATES.nonMember;
    const durationMultiplier = duration / 60;
    const guestFee = playerType === 'Guest' ? CLUB_RATES.guestFee : 0;
    return (hourlyRate * durationMultiplier) + guestFee;
  }, [playerType, duration]);

  const handleBooking = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTime || !name || !phone) return;

    // Double Booking Check
    const isAlreadyBooked = reservations.some(res => 
      res.date.toDateString() === selectedDate.toDateString() && 
      res.time === selectedTime
    );

    if (isAlreadyBooked) {
      alert('This slot has just been reserved by another player. Please select a different time.');
      return;
    }

    setIsSubmitting(true);
    
    const booking: BookingDetails = {
      id: `res-${Date.now()}`,
      date: selectedDate,
      time: selectedTime,
      duration,
      name,
      phone,
      notification,
      playerType,
      totalPaid: calculatedPrice
    };
    
    // Save to Supabase
    try {
      const { error } = await supabase.from('reservations').insert([{
        id: booking.id,
        date: booking.date.toISOString().split('T')[0],
        time: booking.time,
        duration: booking.duration,
        name: booking.name,
        phone: booking.phone,
        notification: booking.notification,
        player_type: booking.playerType,
        total_paid: booking.totalPaid
      }]);
      
      if (error) throw error;

      setReservations(prev => [...prev, booking]);
      setSlots(prev => prev.map(s => s.time === selectedTime ? { ...s, isAvailable: false } : s));
      
      setLastBooking(booking);
      setIsSubmitting(false);
      setShowSuccess(true);
      
      setSelectedTime('');
      setName('');
      setPhone('');
    } catch (err: any) {
      console.error('Supabase booking error:', err);
      alert(`Failed to save reservation: ${err.message || 'Unknown error'}. Ensure the "reservations" table exists in Supabase.`);
      setIsSubmitting(false);
    }
  }, [selectedDate, selectedTime, duration, name, phone, notification, playerType, calculatedPrice, reservations]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFCFB] text-[#1A1A1A]">
      <AdminLogin 
        isOpen={showLogin} 
        onClose={() => setShowLogin(false)} 
        onLogin={() => {
          setIsAdmin(true);
          setShowLogin(false);
        }} 
      />

      {isAdmin && (
        <AdminDashboard 
          slots={slots} 
          setSlots={setSlots} 
          news={news} 
          setNews={setNews}
          reservations={reservations}
          setReservations={setReservations}
          waitlist={waitlist}
          setWaitlist={setWaitlist}
          members={members}
          setMembers={setMembers}
          onClose={() => setIsAdmin(false)} 
        />
      )}

      {/* Modern Slim Header */}
      <header className="sticky top-0 z-40 bg-white/70 backdrop-blur-xl border-b border-[#F0EEEA] px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-4 group cursor-pointer">
          <div className="w-10 h-10 bg-[#1B4332] rounded-full flex items-center justify-center transition-transform group-hover:rotate-12">
            <Trophy className="text-[#C5A059]" size={20} />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg tracking-tight leading-none text-[#1B4332]">YHALASON</span>
            <span className="text-[9px] uppercase tracking-[0.4em] font-semibold text-[#C5A059] mt-1">Court Club</span>
          </div>
        </div>
        
        <nav className="hidden lg:flex gap-12 text-[10px] font-bold uppercase tracking-[0.2em] text-[#8C8B88]">
          <a href="#book" className="hover:text-[#1B4332] transition-all">Reservations</a>
          <a href="#rates" className="hover:text-[#1B4332] transition-all">The Club</a>
          <a href="#news" className="hover:text-[#1B4332] transition-all">The Journal</a>
        </nav>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowSignUpModal(true)}
            className="hidden sm:flex px-4 py-2 bg-[#1B4332] text-white rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-[#2D5A46] transition-all"
          >
            Become a Member
          </button>
          <button 
            onClick={() => setShowWaitlistModal(true)}
            className="hidden sm:flex px-4 py-2 border border-[#F0EEEA] rounded-full text-[10px] font-bold uppercase tracking-widest text-[#1B4332] hover:bg-slate-50 transition-all"
          >
            Join Waitlist
          </button>
          <button className="p-2.5 text-[#1B4332] hover:bg-slate-100 rounded-full transition-all">
            <User size={20} />
          </button>
        </div>
      </header>

      <main className="flex-grow">
        {/* Cinematic Hero */}
        <section className="pt-24 pb-32 px-6 text-center bg-gradient-to-b from-white to-[#FDFCFB]">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-3 px-5 py-2 bg-white border border-[#F0EEEA] rounded-full text-[#C5A059] text-[9px] font-bold uppercase tracking-[0.3em] mb-10 shadow-sm animate-fade-in">
              <Sparkles size={12} className="animate-pulse" />
              Barangay Yhalason Elite Grounds
            </div>
            <h1 className="text-6xl md:text-8xl mb-8 text-[#1B4332] leading-[0.95] font-serif tracking-tight">
              Sophistication <br/><span className="italic text-[#C5A059]">Refined.</span>
            </h1>
            <p className="text-[#7D7C7A] font-light text-xl max-w-2xl mx-auto leading-relaxed opacity-80">
              The premier destination for the contemporary athlete. Bespoke court management at the heart of Barangay Yhalason.
            </p>
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-12 gap-16 pb-40">
          {/* Reservation Panel */}
          <div className="lg:col-span-7 space-y-16">
            <div id="book" className="scroll-mt-32">
              <div className="flex items-center gap-4 mb-12">
                <span className="text-[#C5A059] font-serif italic text-4xl">01.</span>
                <h2 className="text-3xl font-bold text-[#1B4332] tracking-tight">Select Your Session</h2>
              </div>

              <form onSubmit={handleBooking} className="space-y-12">
                <div className="space-y-6">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#A8A7A5] flex items-center gap-2">
                    <Calendar size={14} className="text-[#C5A059]" /> Preferred Date
                  </label>
                  <BookingCalendar selectedDate={selectedDate} onDateChange={setSelectedDate} />
                </div>

                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#A8A7A5] flex items-center gap-2">
                      <Clock size={14} className="text-[#C5A059]" /> Available Slots
                    </label>
                    <div className="flex bg-[#F5F4F0] p-1.5 rounded-2xl border border-[#F0EEEA]">
                      {[60, 90].map((d) => (
                        <button 
                          key={d}
                          type="button"
                          onClick={() => setDuration(d as 60 | 90)}
                          className={`px-6 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${duration === d ? 'bg-[#1B4332] text-white shadow-lg' : 'text-[#7D7C7A] hover:text-[#1B4332]'}`}
                        >
                          {d} Min
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {slots.map((slot) => (
                      <button
                        key={slot.id}
                        type="button"
                        disabled={!slot.isAvailable}
                        onClick={() => setSelectedTime(slot.time)}
                        className={`
                          py-6 rounded-3xl border text-xs font-bold transition-all flex flex-col items-center gap-2 group
                          ${!slot.isAvailable ? 'bg-slate-50 text-slate-300 border-slate-100' : 
                            selectedTime === slot.time ? 'bg-[#1B4332] text-white border-[#1B4332] shadow-2xl ring-4 ring-[#1B4332]/5' : 
                            'bg-white text-[#1B4332] border-[#F0EEEA] hover:border-[#C5A059] hover:bg-slate-50'}
                        `}
                      >
                        {slot.time}
                        {!slot.isAvailable && <span className="text-[8px] opacity-40 uppercase tracking-widest">Reserved</span>}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#A8A7A5]">02. Personal Verification</label>
                  <div className="flex gap-4 p-1.5 bg-[#F5F4F0] rounded-[2rem] border border-[#F0EEEA]">
                     {['Member', 'Guest'].map((t) => (
                        <button 
                          key={t}
                          type="button"
                          onClick={() => setPlayerType(t as any)}
                          className={`flex-1 py-4 rounded-[1.5rem] text-[10px] font-bold uppercase tracking-widest transition-all ${playerType === t ? 'bg-white shadow-md text-[#1B4332]' : 'text-[#7D7C7A]'}`}
                        >
                          {t}
                        </button>
                      ))}
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <input
                      required
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Full Name"
                      className="px-8 py-5 rounded-3xl border border-[#F0EEEA] bg-white focus:ring-2 focus:ring-[#1B4332]/5 outline-none transition-all text-sm font-medium"
                    />
                    <input
                      required
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Phone Number (09XX...)"
                      className="px-8 py-5 rounded-3xl border border-[#F0EEEA] bg-white focus:ring-2 focus:ring-[#1B4332]/5 outline-none transition-all text-sm font-medium"
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Premium Sticky Sidebar */}
          <div className="lg:col-span-5">
            <div className="sticky top-32">
              <div className="bg-[#1B4332] text-white rounded-[3rem] p-12 shadow-[0_50px_100px_-20px_rgba(27,67,50,0.3)] relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#C5A059]/10 rounded-full -mr-32 -mt-32 blur-[100px] group-hover:bg-[#C5A059]/20 transition-all duration-1000"></div>
                
                <h3 className="text-2xl font-bold mb-10 flex items-center gap-4 font-serif">
                   Court Statement
                </h3>

                <div className="space-y-8 mb-12">
                  <div className="flex justify-between items-end border-b border-white/10 pb-6">
                    <div>
                      <p className="text-white/40 text-[9px] uppercase tracking-widest font-bold mb-1">Standard Rate</p>
                      <p className="text-sm font-bold">{playerType === 'Member' ? 'Elite Member' : 'Guest Pass'}</p>
                    </div>
                    <p className="text-xl font-serif">₱{playerType === 'Member' ? CLUB_RATES.member : CLUB_RATES.nonMember}</p>
                  </div>
                  
                  <div className="flex justify-between items-end border-b border-white/10 pb-6">
                    <div>
                      <p className="text-white/40 text-[9px] uppercase tracking-widest font-bold mb-1">Session Duration</p>
                      <p className="text-sm font-bold">{duration} Minutes</p>
                    </div>
                    <p className="text-lg font-serif">x{duration/60}</p>
                  </div>

                  {playerType === 'Guest' && (
                    <div className="flex justify-between items-end border-b border-white/10 pb-6">
                      <div>
                        <p className="text-[#C5A059] text-[9px] uppercase tracking-widest font-bold mb-1">Facility Access Fee</p>
                        <p className="text-sm font-bold italic">Standard Non-Member</p>
                      </div>
                      <p className="text-lg font-serif text-[#C5A059]">+₱{CLUB_RATES.guestFee}</p>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-baseline mb-12">
                  <span className="text-white/60 text-xs font-medium uppercase tracking-[0.2em]">Investment</span>
                  <span className="text-5xl font-serif text-[#C5A059]">₱{calculatedPrice.toLocaleString()}</span>
                </div>

                <button
                  onClick={handleBooking}
                  disabled={isSubmitting || !selectedTime || !name || !phone}
                  className="w-full py-6 bg-[#C5A059] text-white font-bold rounded-[1.5rem] hover:bg-[#D4B36F] hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-[#C5A059]/20 disabled:opacity-30 flex items-center justify-center gap-3 uppercase text-[10px] tracking-[0.3em]"
                >
                  {isSubmitting ? 'Authenticating...' : 'Complete Reservation'}
                  {!isSubmitting && <ChevronRight size={16} />}
                </button>
              </div>

              <div className="mt-8 px-6 flex items-center gap-4 text-[#A8A7A5]">
                <ShieldCheck size={24} className="text-[#C5A059]" />
                <p className="text-[10px] font-medium leading-relaxed uppercase tracking-widest">
                  Reservations are final. Professional attire required on all Yhalason surfaces.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Minimal News Journal */}
        <section id="news" className="bg-[#1B4332] py-40">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-[#C5A059] font-serif italic text-4xl">02.</span>
                  <h2 className="text-4xl font-bold text-white tracking-tight">The Yhalason Journal</h2>
                </div>
                <p className="text-white/40 max-w-md text-sm leading-relaxed">
                  Inside stories from our elite coaching staff and exclusive updates on club facility enhancements.
                </p>
              </div>
              <button className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#C5A059] hover:text-white transition-colors border-b border-[#C5A059] pb-2">
                Browse Archive
              </button>
            </div>
            
            <div className="flex overflow-x-auto gap-8 pb-10 snap-x no-scrollbar">
              {news.map((item) => (
                <NewsCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-[#FDFCFB] pt-32 pb-20 px-6 border-t border-[#F0EEEA]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start gap-20">
          <div className="max-w-xs space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#1B4332] rounded-lg flex items-center justify-center">
                <Trophy className="text-[#C5A059]" size={16} />
              </div>
              <span className="font-bold text-lg tracking-tight text-[#1B4332]">YHALASON</span>
            </div>
            <p className="text-[#7D7C7A] text-sm leading-relaxed font-light">
              Redefining the standard of private court access in Barangay Yhalason. Experience the legacy of excellence.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-20">
            <div className="space-y-6">
              <h5 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#1B4332]">Engagement</h5>
              <ul className="space-y-4 text-sm text-[#7D7C7A]">
                <li><a href="#" className="hover:text-[#1B4332] transition-colors">Waitlist Inquiry</a></li>
                <li><a href="#" className="hover:text-[#1B4332] transition-colors">Member Benefits</a></li>
                <li><a href="#" className="hover:text-[#1B4332] transition-colors">Corporate Hosting</a></li>
              </ul>
            </div>
            <div className="space-y-6">
              <h5 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#1B4332]">Legal</h5>
              <ul className="space-y-4 text-sm text-[#7D7C7A]">
                <li><a href="#" className="hover:text-[#1B4332] transition-colors">House Rules</a></li>
                <li><a href="#" className="hover:text-[#1B4332] transition-colors">Privacy Charter</a></li>
                <li><button onClick={() => setShowLogin(true)} className="text-[#C5A059] hover:underline uppercase text-[10px] font-bold tracking-widest">Steward Login</button></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="max-w-6xl mx-auto mt-32 pt-12 border-t border-[#F0EEEA] flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[9px] uppercase tracking-[0.4em] text-[#A8A7A5]">
            &copy; 2024 Yhalason Private Holdings. All Sessions Recorded.
          </p>
          <div className="flex gap-8">
             <a href="#" className="text-[#A8A7A5] hover:text-[#1B4332] transition-colors"><MessageCircle size={18}/></a>
             <a href="#" className="text-[#A8A7A5] hover:text-[#1B4332] transition-colors"><Mail size={18}/></a>
          </div>
        </div>
      </footer>

      <ChatBot slots={slots} news={news} />
      <WaitlistModal 
        isOpen={showWaitlistModal} 
        onClose={() => setShowWaitlistModal(false)} 
        onJoin={async (entry) => {
          // Double Sign Up Check
          const alreadyOnWaitlist = waitlist.some(w => w.phone === entry.phone);
          if (alreadyOnWaitlist) {
            alert('This phone number is already on our waitlist. We will notify you soon!');
            throw new Error('Duplicate waitlist entry');
          }

          try {
            const { error } = await supabase.from('waitlist').insert([{
              id: entry.id,
              name: entry.name,
              phone: entry.phone,
              timestamp: entry.timestamp.toISOString()
            }]);
            if (error) throw error;
            setWaitlist(prev => [...prev, entry]);
          } catch (err) {
            console.error('Supabase waitlist error:', err);
            alert('Failed to join waitlist. Please check if the database table exists.');
          }
        }}
        waitlistCount={waitlist.length}
      />
      <MemberSignUpModal 
        isOpen={showSignUpModal}
        onClose={() => setShowSignUpModal(false)}
        onSignUp={async (member) => {
          // Double Sign Up Check
          const alreadyMember = members.some(m => m.phone === member.phone);
          if (alreadyMember) {
            alert('This phone number is already registered as an Elite Member.');
            throw new Error('Duplicate member');
          }

          try {
            const { error } = await supabase.from('members').insert([{
              id: member.id,
              name: member.name,
              phone: member.phone,
              joined_at: member.joinedAt.toISOString()
            }]);
            if (error) throw error;
            setMembers(prev => [...prev, member]);
          } catch (err: any) {
            console.error('Supabase member sign up error:', err);
            alert(`Failed to register membership: ${err.message || 'Unknown error'}. Ensure the "members" table exists in Supabase.`);
            throw err;
          }
        }}
      />
      <SuccessModal 
        isOpen={showSuccess} 
        onClose={() => setShowSuccess(false)} 
        booking={lastBooking} 
      />
    </div>
  );
};

export default App;
