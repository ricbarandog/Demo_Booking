
import React, { useState, useCallback } from 'react';
import { 
  Calendar, 
  User, 
  Bell, 
  LayoutGrid, 
  Clock, 
  Mail, 
  MessageCircle, 
  MapPin, 
  ShieldCheck, 
  ChevronRight, 
  CreditCard,
  Trophy
} from 'lucide-react';
import BookingCalendar from './components/BookingCalendar';
import SuccessModal from './components/SuccessModal';
import NewsCard from './components/NewsCard';
import ChatBot from './components/ChatBot';
import AdminDashboard from './components/AdminDashboard';
import AdminLogin from './components/AdminLogin';
import { INITIAL_MOCK_SLOTS, INITIAL_MOCK_NEWS, CLUB_RATES } from './constants';
import { BookingDetails, TimeSlot, NewsItem } from './types';

const App: React.FC = () => {
  // Master State
  const [slots, setSlots] = useState<TimeSlot[]>(INITIAL_MOCK_SLOTS);
  const [news, setNews] = useState<NewsItem[]>(INITIAL_MOCK_NEWS);
  const [reservations, setReservations] = useState<BookingDetails[]>([
    {
      id: 'res-1',
      date: new Date(),
      time: '08:30 AM',
      duration: 90,
      name: 'Julianne Moore',
      email: 'j.moore@example.com',
      notification: 'Email'
    },
    {
      id: 'res-2',
      date: new Date(),
      time: '02:30 PM',
      duration: 60,
      name: 'Robert De Niro',
      email: 'bob@hollywood.com',
      notification: 'WhatsApp'
    }
  ]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  // Booking State
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [duration, setDuration] = useState<60 | 90>(60);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [notification, setNotification] = useState<'Email' | 'WhatsApp'>('Email');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [lastBooking, setLastBooking] = useState<BookingDetails | null>(null);

  const handleBooking = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTime || !name || !email) return;

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const booking: BookingDetails = {
      id: `res-${Date.now()}`,
      date: selectedDate,
      time: selectedTime,
      duration,
      name,
      email,
      notification
    };
    
    setReservations(prev => [...prev, booking]);
    // Mark slot as unavailable in mock data
    setSlots(prev => prev.map(s => s.time === selectedTime ? { ...s, isAvailable: false } : s));
    
    setLastBooking(booking);
    setIsSubmitting(false);
    setShowSuccess(true);
    
    // Reset form
    setSelectedTime('');
    setName('');
    setEmail('');
  }, [selectedDate, selectedTime, duration, name, email, notification]);

  return (
    <div className="min-h-screen flex flex-col bg-[#fcfdfc] scroll-smooth">
      {/* Hidden Admin Login Modal */}
      <AdminLogin 
        isOpen={showLogin} 
        onClose={() => setShowLogin(false)} 
        onLogin={() => {
          setIsAdmin(true);
          setShowLogin(false);
        }} 
      />

      {/* Admin Dashboard Overlay */}
      {isAdmin && (
        <AdminDashboard 
          slots={slots} 
          setSlots={setSlots} 
          news={news} 
          setNews={setNews}
          reservations={reservations}
          setReservations={setReservations}
          onClose={() => setIsAdmin(false)} 
        />
      )}

      {/* Navigation Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#1b4332] rounded-lg flex items-center justify-center">
            <LayoutGrid className="text-white" size={18} />
          </div>
          <span className="font-bold text-xl tracking-tight text-[#1b4332]">Yhalason <span className="font-light">Club</span></span>
        </div>
        <nav className="hidden md:flex gap-8 text-sm font-medium text-slate-600">
          <a href="#book" className="hover:text-[#1b4332] transition-colors">Reserve</a>
          <a href="#rates" className="hover:text-[#1b4332] transition-colors">Rates</a>
          <a href="#news" className="hover:text-[#1b4332] transition-colors">The Journal</a>
        </nav>
        <div className="flex items-center gap-3">
          <button className="hidden sm:flex p-2 bg-slate-50 rounded-full hover:bg-slate-100 transition-colors">
            <Bell size={18} className="text-[#1b4332]" />
          </button>
          <button className="p-2 bg-slate-50 rounded-full hover:bg-slate-100 transition-colors">
            <User size={20} className="text-[#1b4332]" />
          </button>
        </div>
      </header>

      <main className="flex-grow max-w-2xl mx-auto w-full px-6 py-8">
        {/* Hero Section */}
        <section className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#e0f2fe] rounded-full text-[#0369a1] text-[10px] font-bold uppercase tracking-widest mb-4">
            <MapPin size={12} />
            Private Westchester Estate
          </div>
          <h1 className="text-5xl mb-4 text-[#1b4332]">Elegance In Every Swing.</h1>
          <p className="text-slate-500 font-light text-lg">
            Experience the pinnacle of court play at Yhalason. Pro-grade surfaces, elite amenities, and a community dedicated to excellence.
          </p>
        </section>

        {/* Booking Form Section */}
        <section id="book" className="space-y-8 mb-20">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1.5 h-6 bg-[#1b4332] rounded-full"></div>
            <h2 className="text-2xl font-bold text-[#1b4332]">Reservation Desk</h2>
          </div>

          <form onSubmit={handleBooking} className="space-y-8">
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-400 block ml-1">1. Choose Your Date</label>
              <BookingCalendar selectedDate={selectedDate} onDateChange={setSelectedDate} />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">2. Select Session & Duration</label>
                <div className="flex bg-slate-100 p-1 rounded-xl">
                  {[60, 90].map((d) => (
                    <button 
                      key={d}
                      type="button"
                      onClick={() => setDuration(d as 60 | 90)}
                      className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${duration === d ? 'bg-white shadow-sm text-[#1b4332]' : 'text-slate-400'}`}
                    >
                      {d}m
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {slots.map((slot) => (
                  <button
                    key={slot.id}
                    type="button"
                    disabled={!slot.isAvailable}
                    onClick={() => setSelectedTime(slot.time)}
                    className={`
                      relative py-4 px-2 rounded-2xl border text-sm font-semibold flex flex-col items-center justify-center transition-all
                      ${!slot.isAvailable ? 'bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed' : 
                        selectedTime === slot.time ? 'bg-[#1b4332] text-white border-[#1b4332] shadow-lg shadow-[#1b4332]/20' : 
                        'bg-white text-slate-700 border-slate-100 hover:border-[#1b4332]'}
                    `}
                  >
                    <Clock size={16} className={`mb-1 ${selectedTime === slot.time ? 'text-white' : 'text-[#1b4332]'}`} />
                    {slot.time}
                    {!slot.isAvailable && <span className="text-[9px] uppercase mt-1 opacity-60">Reserved</span>}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">3. Player Verification</label>
              <div className="space-y-3">
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    required
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full Name"
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-100 bg-white focus:outline-none focus:ring-2 focus:ring-[#1b4332] focus:border-transparent transition-all"
                  />
                </div>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email Address"
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-100 bg-white focus:outline-none focus:ring-2 focus:ring-[#1b4332] focus:border-transparent transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">4. Notification Preference</label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setNotification('Email')}
                  className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl border transition-all ${notification === 'Email' ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'bg-white border-slate-100 text-slate-500'}`}
                >
                  <Mail size={18} />
                  Email
                </button>
                <button
                  type="button"
                  onClick={() => setNotification('WhatsApp')}
                  className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl border transition-all ${notification === 'WhatsApp' ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'bg-white border-slate-100 text-slate-500'}`}
                >
                  <MessageCircle size={18} />
                  WhatsApp
                </button>
              </div>
            </div>

            <button
              disabled={isSubmitting || !selectedTime || !name || !email}
              className={`
                w-full py-5 rounded-[2rem] font-bold text-lg shadow-xl transition-all active:scale-95
                ${isSubmitting ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-[#1b4332] text-white hover:scale-[1.01] shadow-[#1b4332]/20'}
              `}
            >
              {isSubmitting ? 'Finalizing...' : 'Request Booking'}
            </button>
          </form>
        </section>

        {/* Club Rates Section */}
        <section id="rates" className="mb-20">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1.5 h-6 bg-[#1b4332] rounded-full"></div>
            <h2 className="text-2xl font-bold text-[#1b4332]">Club Rates</h2>
          </div>
          <div className="bg-emerald-50/50 rounded-[2.5rem] p-8 border border-emerald-100/50">
            <div className="grid md:grid-cols-2 gap-10">
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 text-[#1b4332] font-bold text-sm mb-4">
                    <CreditCard size={18} />
                    Hourly Play
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-emerald-100/30">
                      <span className="text-slate-500 font-medium">Club Member</span>
                      <span className="text-[#1b4332] font-bold">${CLUB_RATES.member}/hr</span>
                    </div>
                    <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-emerald-100/30">
                      <span className="text-slate-500 font-medium">Non-Member</span>
                      <span className="text-[#1b4332] font-bold">${CLUB_RATES.nonMember}/hr</span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center px-4 text-sm">
                  <span className="text-slate-400">Guest Pass Fee</span>
                  <span className="text-slate-500 font-bold">${CLUB_RATES.guestFee}/visit</span>
                </div>
              </div>
              <div className="bg-[#1b4332] rounded-[2rem] p-8 text-white flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-emerald-300 font-bold text-[10px] uppercase tracking-widest mb-4">
                    <Trophy size={16} />
                    Exclusive Benefits
                  </div>
                  <h3 className="text-xl font-bold mb-4">Become a Member</h3>
                  <p className="text-emerald-100/70 text-sm font-light leading-relaxed">
                    Enjoy priority 14-day advance booking, inclusive guest passes monthly, and access to our sunset court tournaments.
                  </p>
                </div>
                <button className="mt-8 group flex items-center gap-2 text-sm font-bold text-white hover:text-emerald-300 transition-colors">
                  Inquire about membership
                  <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Club News Section */}
        <section id="news" className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-6 bg-[#1b4332] rounded-full"></div>
              <h2 className="text-2xl font-bold text-[#1b4332]">The Journal</h2>
            </div>
            <button className="text-sm font-bold text-[#1b4332] hover:underline transition-all">Archive</button>
          </div>
          
          <div className="flex overflow-x-auto gap-5 pb-6 snap-x no-scrollbar">
            {news.map((item) => (
              <NewsCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-50 border-t border-slate-100 px-6 py-16 text-center">
        <div className="mb-8">
          <span className="font-bold text-xl tracking-tight text-[#1b4332]">Yhalason <span className="font-light">Court Club</span></span>
          <p className="text-slate-400 text-sm mt-2 max-w-xs mx-auto font-light">
            Providing Westchester with premium court experiences since 1994.
          </p>
        </div>
        <div className="flex justify-center gap-6 mb-10 text-slate-300">
          <a href="#" className="p-3 bg-white rounded-full shadow-sm hover:text-[#1b4332] transition-colors"><Mail size={20} /></a>
          <a href="#" className="p-3 bg-white rounded-full shadow-sm hover:text-[#1b4332] transition-colors"><User size={20} /></a>
          <button 
            onClick={() => setShowLogin(true)} 
            className="p-3 bg-white rounded-full shadow-sm text-slate-100 hover:text-slate-200 transition-colors opacity-20 hover:opacity-100"
            title="Secure Access"
          >
            <ShieldCheck size={20} />
          </button>
        </div>
        <div className="space-y-1">
          <p className="text-slate-400 text-[10px] uppercase tracking-[0.2em]">&copy; 2024 Yhalason Court Club Management</p>
          <p className="text-slate-300 text-[9px] uppercase tracking-widest">Designed for Distinction</p>
        </div>
      </footer>

      {/* Persistent Components */}
      <ChatBot slots={slots} news={news} />
      <SuccessModal 
        isOpen={showSuccess} 
        onClose={() => setShowSuccess(false)} 
        booking={lastBooking} 
      />
    </div>
  );
};

export default App;
