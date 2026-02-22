
import React, { useState, useMemo } from 'react';
import { TimeSlot, NewsItem, BookingDetails, WaitlistEntry } from '../types.ts';
import { 
  Check, 
  X, 
  Plus, 
  Trash2, 
  Edit3, 
  Users, 
  CalendarDays, 
  Clock, 
  Eye, 
  TrendingUp, 
  DollarSign, 
  PieChart, 
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  Search,
  Filter,
  Download,
  BookOpen,
  UserPlus
} from 'lucide-react';
import { format } from 'date-fns';

interface AdminDashboardProps {
  slots: TimeSlot[];
  setSlots: React.Dispatch<React.SetStateAction<TimeSlot[]>>;
  news: NewsItem[];
  setNews: React.Dispatch<React.SetStateAction<NewsItem[]>>;
  reservations: BookingDetails[];
  setReservations: React.Dispatch<React.SetStateAction<BookingDetails[]>>;
  waitlist: WaitlistEntry[];
  setWaitlist: React.Dispatch<React.SetStateAction<WaitlistEntry[]>>;
  onClose: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  slots, 
  setSlots, 
  news, 
  setNews, 
  reservations, 
  setReservations, 
  waitlist,
  setWaitlist,
  onClose 
}) => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'operations' | 'journal' | 'waitlist'>('analytics');
  const [editingNews, setEditingNews] = useState<Partial<NewsItem> | null>(null);
  const [viewingReservation, setViewingReservation] = useState<BookingDetails | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Enhanced Analytics Logic
  const stats = useMemo(() => {
    const totalRevenue = reservations.reduce((acc, res) => acc + (res.totalPaid || 0), 0);
    const memberRev = reservations.filter(r => r.playerType === 'Member').reduce((acc, r) => acc + (r.totalPaid || 0), 0);
    const guestRev = reservations.filter(r => r.playerType === 'Guest').reduce((acc, r) => acc + (r.totalPaid || 0), 0);
    const avgBookingValue = reservations.length ? totalRevenue / reservations.length : 0;
    const capacityRate = (reservations.length / (slots.length * 30)) * 100; // Mock 30 days
    
    return {
      totalRevenue,
      memberRev,
      guestRev,
      avgBookingValue,
      count: reservations.length,
      capacityRate
    };
  }, [reservations, slots]);

  const filteredReservations = useMemo(() => {
    return reservations.filter(res => 
      res.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      res.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [reservations, searchTerm]);

  const toggleSlot = (id: string) => {
    setSlots(prev => prev.map(s => s.id === id ? { ...s, isAvailable: !s.isAvailable } : s));
  };

  const deleteReservation = (id: string) => {
    if(!confirm("Warning: Voiding this transaction will release the slot and refund the digital token. Proceed?")) return;
    const res = reservations.find(r => r.id === id);
    if (res) {
      setSlots(prev => prev.map(s => s.time === res.time ? { ...s, isAvailable: true } : s));
    }
    setReservations(prev => prev.filter(r => r.id !== id));
  };

  const deleteNews = (id: string) => {
    if(!confirm("Delete this article from the public journal?")) return;
    setNews(prev => prev.filter(n => n.id !== id));
  };

  const deleteWaitlistEntry = (id: string) => {
    if(!confirm("Remove this person from the waitlist?")) return;
    setWaitlist(prev => prev.filter(w => w.id !== id));
  };

  const saveNews = () => {
    if (!editingNews?.title || !editingNews?.description) return;
    if (editingNews.id) {
      setNews(prev => prev.map(n => n.id === editingNews.id ? (editingNews as NewsItem) : n));
    } else {
      const newItem: NewsItem = {
        id: `n${Date.now()}`,
        title: editingNews.title,
        description: editingNews.description,
        tag: editingNews.tag || 'Updates',
        imageUrl: editingNews.imageUrl || `https://picsum.photos/seed/${Date.now()}/400/300`,
      };
      setNews(prev => [newItem, ...prev]);
    }
    setEditingNews(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#FDFCFB] flex flex-col overflow-hidden animate-in fade-in duration-500">
      {/* Executive Sidebar/TopNav */}
      <header className="bg-[#1B4332] text-white px-12 py-8 flex items-center justify-between shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[#C5A059]/5 skew-x-[45deg] translate-x-1/2"></div>
        
        <div className="flex items-center gap-8 relative z-10">
          <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center border border-white/10 backdrop-blur-md">
            <ShieldCheck className="text-[#C5A059]" size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Executive Control</h2>
            <div className="flex items-center gap-3 mt-1 opacity-50">
               <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
               <p className="text-[10px] uppercase tracking-[0.3em] font-bold">System Online: Barangay Yhalason Station</p>
            </div>
          </div>
        </div>

        <div className="flex bg-black/30 p-2 rounded-[1.5rem] border border-white/5 relative z-10">
          {(['analytics', 'operations', 'journal', 'waitlist'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-8 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] transition-all flex items-center gap-3 ${activeTab === tab ? 'bg-white text-[#1B4332] shadow-2xl scale-[1.05]' : 'text-white/40 hover:text-white'}`}
            >
              {tab === 'analytics' && <TrendingUp size={14} />}
              {tab === 'operations' && <Activity size={14} />}
              {tab === 'journal' && <BookOpen size={14} />}
              {tab === 'waitlist' && <UserPlus size={14} />}
              {tab}
            </button>
          ))}
        </div>

        <button 
          onClick={onClose}
          className="px-6 py-3 bg-white/10 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-white/20 transition-all border border-white/10 relative z-10"
        >
          Exit Station
        </button>
      </header>

      {/* Main Administrative View */}
      <div className="flex-grow overflow-y-auto p-12 lg:p-20">
        {activeTab === 'analytics' && (
          <div className="max-w-7xl mx-auto space-y-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
            {/* Sales Dashboard Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { label: 'Gross Revenue', value: `₱${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-emerald-600', trend: '+14.2%', desc: 'Current Month' },
                { label: 'Club Velocity', value: `${stats.count} S/m`, icon: Activity, color: 'text-[#C5A059]', trend: '+8%', desc: 'Sessions per month' },
                { label: 'Member LTV', value: `₱${stats.avgBookingValue.toFixed(0)}`, icon: Users, color: 'text-blue-600', trend: '+2.1%', desc: 'Average Ticket' },
                { label: 'Utilization', value: `${stats.capacityRate.toFixed(1)}%`, icon: TrendingUp, color: 'text-indigo-600', trend: '-0.4%', desc: 'Court Occupancy' },
              ].map((stat, i) => (
                <div key={i} className="bg-white p-10 rounded-[3rem] border border-[#F0EEEA] shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group">
                  <div className="flex justify-between items-start mb-6">
                    <div className={`p-4 rounded-3xl bg-slate-50 ${stat.color} group-hover:scale-110 transition-transform duration-500 shadow-inner`}>
                      <stat.icon size={28} />
                    </div>
                    <div className={`px-3 py-1.5 rounded-full text-[10px] font-bold flex items-center gap-1 ${stat.trend.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                      {stat.trend.startsWith('+') ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                      {stat.trend}
                    </div>
                  </div>
                  <p className="text-[#A8A7A5] text-[10px] font-bold uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                  <p className="text-4xl font-serif text-[#1B4332]">{stat.value}</p>
                  <p className="text-[10px] text-slate-400 mt-4 italic font-medium">{stat.desc}</p>
                </div>
              ))}
            </div>

            <div className="grid lg:grid-cols-12 gap-16">
              {/* Transaction Ledger */}
              <div className="lg:col-span-8 space-y-10">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-[#1B4332] flex items-center gap-4 font-serif italic">
                    <DollarSign className="text-[#C5A059]" /> Intelligence Feed
                  </h3>
                  <div className="flex gap-4">
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input 
                        type="text" 
                        placeholder="Search Members..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-12 pr-6 py-3 bg-white border border-[#F0EEEA] rounded-2xl text-xs outline-none focus:ring-4 focus:ring-[#1B4332]/5 w-64 transition-all"
                      />
                    </div>
                    <button className="p-3 bg-white border border-[#F0EEEA] rounded-2xl text-slate-400 hover:text-[#1B4332] transition-all"><Filter size={18}/></button>
                  </div>
                </div>

                <div className="bg-white border border-[#F0EEEA] rounded-[3rem] shadow-sm overflow-hidden">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="bg-slate-50 text-[#A8A7A5] text-[10px] font-bold uppercase tracking-[0.2em] border-b border-[#F0EEEA]">
                        <th className="px-10 py-6">Transaction ID</th>
                        <th className="px-10 py-6">Member Profile</th>
                        <th className="px-10 py-6">Tier</th>
                        <th className="px-10 py-6 text-right">Settlement</th>
                        <th className="px-10 py-6 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F0EEEA]">
                      {filteredReservations.length === 0 ? (
                        <tr><td colSpan={5} className="px-10 py-20 text-center text-slate-400 font-light italic">No matching records found in intelligence database.</td></tr>
                      ) : (
                        filteredReservations.map(res => (
                          <tr key={res.id} className="group hover:bg-slate-50/50 transition-colors">
                            <td className="px-10 py-7">
                              <span className="text-[11px] font-bold text-[#A8A7A5] font-mono">#{res.id.slice(-8)}</span>
                            </td>
                            <td className="px-10 py-7">
                              <div className="font-bold text-[#1B4332] text-base">{res.name}</div>
                              <div className="text-[11px] text-[#7D7C7A] font-medium">{res.email}</div>
                            </td>
                            <td className="px-10 py-7">
                              <span className={`px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest ${res.playerType === 'Member' ? 'bg-[#1B4332]/5 text-[#1B4332]' : 'bg-[#C5A059]/10 text-[#C5A059]'}`}>
                                {res.playerType}
                              </span>
                            </td>
                            <td className="px-10 py-7 text-right font-serif text-[#1B4332] text-xl">
                              ₱{(res.totalPaid || 0).toLocaleString()}
                            </td>
                            <td className="px-10 py-7 text-center">
                              <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => setViewingReservation(res)} className="p-2.5 text-slate-400 hover:text-[#1B4332] hover:bg-white rounded-xl shadow-sm transition-all"><Eye size={18} /></button>
                                <button onClick={() => deleteReservation(res.id)} className="p-2.5 text-slate-400 hover:text-rose-500 hover:bg-white rounded-xl shadow-sm transition-all"><Trash2 size={18} /></button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
                
                <div className="flex justify-center">
                   <button className="flex items-center gap-3 px-8 py-4 bg-[#F5F4F0] text-[#1B4332] text-[10px] font-bold uppercase tracking-[0.3em] rounded-2xl hover:bg-[#E5E1DA] transition-all">
                      <Download size={16} /> Export Financial Ledger
                   </button>
                </div>
              </div>

              {/* Advanced Segmentation */}
              <div className="lg:col-span-4 space-y-12">
                <div className="bg-white border border-[#F0EEEA] rounded-[3rem] p-12 shadow-sm">
                  <h3 className="text-xl font-bold text-[#1B4332] mb-10 flex items-center gap-4 font-serif italic">
                    <PieChart size={24} className="text-[#C5A059]" /> Segmentation
                  </h3>
                  <div className="space-y-10">
                    {[
                      { label: 'Elite Members', amount: stats.memberRev, color: 'bg-[#1B4332]', icon: ShieldCheck },
                      // FIX: Using imported 'Users' instead of non-existent 'User'
                      { label: 'Guest Pass', amount: stats.guestRev, color: 'bg-[#C5A059]', icon: Users }
                    ].map((seg, i) => (
                      <div key={i} className="space-y-4">
                        <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-[0.2em] text-[#7D7C7A]">
                          <div className="flex items-center gap-3">
                            <seg.icon size={16} className={seg.color.replace('bg-', 'text-')} />
                            <span>{seg.label}</span>
                          </div>
                          <span className="text-[#1B4332] text-sm">₱{seg.amount.toLocaleString()}</span>
                        </div>
                        <div className="h-4 w-full bg-slate-50 rounded-full overflow-hidden shadow-inner">
                          <div 
                            className={`h-full ${seg.color} transition-all duration-1000 ease-out`} 
                            style={{ width: `${(seg.amount / (stats.totalRevenue || 1)) * 100}%` }}
                          />
                        </div>
                        <p className="text-[10px] text-slate-400 text-right italic">{((seg.amount / (stats.totalRevenue || 1)) * 100).toFixed(1)}% of total yield</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-[#1B4332] rounded-[3.5rem] p-12 text-white shadow-3xl relative overflow-hidden group">
                   <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent"></div>
                   <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-[#C5A059]/20 rounded-full blur-[80px] group-hover:scale-150 transition-transform duration-1000"></div>
                   
                   <h4 className="text-white/40 text-[10px] font-bold uppercase tracking-[0.4em] mb-4 relative z-10">Yield Projection</h4>
                   <p className="text-5xl font-serif text-[#C5A059] relative z-10">₱{(stats.totalRevenue * 1.5).toLocaleString()}</p>
                   <div className="mt-8 flex items-center gap-3 text-emerald-400 text-xs font-bold relative z-10">
                      <TrendingUp size={16} /> Projected Growth: +50% Q4
                   </div>
                   <p className="text-[11px] mt-8 text-white/50 leading-relaxed font-light relative z-10 italic">
                    Analysis indicates Barangay Yhalason expansion is driving unprecedented demand. Recommend dynamic pricing implementation for weekend peak hours.
                   </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'operations' && (
          <div className="max-w-6xl mx-auto space-y-20 animate-in fade-in slide-in-from-right-8 duration-700">
             <div className="grid md:grid-cols-12 gap-16">
                <div className="md:col-span-7 bg-white border border-[#F0EEEA] rounded-[3rem] p-12 shadow-sm">
                   <div className="flex justify-between items-center mb-12">
                      <h3 className="text-2xl font-bold text-[#1B4332] font-serif italic flex items-center gap-4">
                        <CalendarDays className="text-[#C5A059]" /> Scheduling Control
                      </h3>
                      <span className="px-4 py-2 bg-emerald-50 text-emerald-600 text-[9px] font-bold uppercase tracking-widest rounded-xl">Auto-Refresh: Active</span>
                   </div>
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {slots.map(slot => (
                        <button
                          key={slot.id}
                          onClick={() => toggleSlot(slot.id)}
                          className={`group p-8 rounded-[2.5rem] border transition-all text-left flex justify-between items-center ${slot.isAvailable ? 'bg-white border-[#F0EEEA] hover:border-emerald-500' : 'bg-slate-50 border-slate-200'}`}
                        >
                          <div className="space-y-3">
                             <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-colors ${slot.isAvailable ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-200 text-slate-400'}`}>
                                <Clock size={20} />
                             </div>
                             <p className="font-serif text-xl text-[#1B4332]">{slot.time}</p>
                             <p className={`text-[9px] font-bold uppercase tracking-widest ${slot.isAvailable ? 'text-emerald-500' : 'text-slate-400'}`}>
                                {slot.isAvailable ? 'Available' : 'Reserved'}
                             </p>
                          </div>
                          <div className={`p-3 rounded-xl transition-all ${slot.isAvailable ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-200 text-slate-400 group-hover:scale-110'}`}>
                             {slot.isAvailable ? <Check size={20}/> : <X size={20}/>}
                          </div>
                        </button>
                      ))}
                   </div>
                </div>

                <div className="md:col-span-5 space-y-12">
                   <div className="bg-[#1B4332] rounded-[3rem] p-12 text-white shadow-2xl">
                      <h3 className="text-xl font-bold mb-8 flex items-center gap-4 font-serif italic text-[#C5A059]">
                         <Activity size={24} /> Facility Status
                      </h3>
                      <div className="space-y-8">
                         {[
                           { l: 'Court 1 Surface', v: 'Optimal', s: 'text-emerald-400' },
                           { l: 'Lighting System', v: 'Standby', s: 'text-amber-400' },
                           { l: 'Refreshment Stock', v: 'Replenish', s: 'text-rose-400' },
                           { l: 'Gate Security', v: 'Encrypted', s: 'text-emerald-400' }
                         ].map((item, i) => (
                           <div key={i} className="flex justify-between items-center border-b border-white/5 pb-4">
                              <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold">{item.l}</span>
                              <span className={`text-xs font-bold uppercase tracking-[0.2em] ${item.s}`}>{item.v}</span>
                           </div>
                         ))}
                      </div>
                   </div>

                   <div className="bg-white border border-[#F0EEEA] rounded-[3rem] p-12 shadow-sm">
                      <h3 className="text-xl font-bold text-[#1B4332] mb-6 font-serif italic">Maintenance Log</h3>
                      <p className="text-xs text-slate-400 leading-relaxed italic mb-8">No critical system failures detected in the last 24 hours.</p>
                      <button className="w-full py-4 border border-[#F0EEEA] rounded-2xl text-[10px] font-bold uppercase tracking-widest text-[#1B4332] hover:bg-slate-50 transition-all">
                        Schedule Inspection
                      </button>
                   </div>
                </div>
             </div>
          </div>
        )}

        {activeTab === 'journal' && (
          <div className="max-w-6xl mx-auto space-y-16 animate-in fade-in slide-in-from-left-8 duration-700">
             <div className="flex justify-between items-center">
                <h3 className="text-3xl font-bold text-[#1B4332] font-serif italic flex items-center gap-4">
                  <BookOpen className="text-[#C5A059]" /> Content Management
                </h3>
                <button 
                  onClick={() => setEditingNews({})}
                  className="flex items-center gap-3 px-8 py-4 bg-[#1B4332] text-white rounded-2xl hover:bg-[#2D5A47] transition-all text-[10px] font-bold uppercase tracking-widest shadow-xl"
                >
                  <Plus size={16} /> Compose Article
                </button>
             </div>

             <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                {news.map(item => (
                  <div key={item.id} className="bg-white border border-[#F0EEEA] rounded-[2.5rem] overflow-hidden group hover:shadow-2xl transition-all duration-500">
                    <div className="h-48 relative overflow-hidden">
                       <img src={item.imageUrl} className="w-full h-full object-cover grayscale transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-110" />
                       <span className="absolute top-6 left-6 px-4 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-[9px] font-bold uppercase tracking-widest text-[#1B4332]">
                         {item.tag}
                       </span>
                    </div>
                    <div className="p-10 space-y-4">
                       <h4 className="text-xl font-bold text-[#1B4332] leading-tight line-clamp-1">{item.title}</h4>
                       <p className="text-slate-400 text-sm line-clamp-2 font-light leading-relaxed">{item.description}</p>
                       <div className="pt-6 flex justify-between items-center">
                          <button onClick={() => setEditingNews(item)} className="p-3 hover:bg-[#F5F4F0] rounded-xl text-[#1B4332] transition-colors"><Edit3 size={18} /></button>
                          <button onClick={() => deleteNews(item.id)} className="p-3 hover:bg-rose-50 rounded-xl text-rose-500 transition-colors"><Trash2 size={18} /></button>
                       </div>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        )}

        {activeTab === 'waitlist' && (
          <div className="max-w-6xl mx-auto space-y-16 animate-in fade-in slide-in-from-top-8 duration-700">
            <div className="flex justify-between items-center">
              <h3 className="text-3xl font-bold text-[#1B4332] font-serif italic flex items-center gap-4">
                <UserPlus className="text-[#C5A059]" /> Waitlist Management
              </h3>
              <div className="px-6 py-3 bg-[#C5A059]/10 text-[#C5A059] rounded-2xl text-[10px] font-bold uppercase tracking-widest">
                Total Queue: {waitlist.length}
              </div>
            </div>

            <div className="bg-white border border-[#F0EEEA] rounded-[3rem] shadow-sm overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-slate-50 text-[#A8A7A5] text-[10px] font-bold uppercase tracking-[0.2em] border-b border-[#F0EEEA]">
                    <th className="px-10 py-6">Position</th>
                    <th className="px-10 py-6">Contact Info</th>
                    <th className="px-10 py-6">Joined At</th>
                    <th className="px-10 py-6 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0EEEA]">
                  {waitlist.length === 0 ? (
                    <tr><td colSpan={4} className="px-10 py-20 text-center text-slate-400 font-light italic">The waitlist is currently empty.</td></tr>
                  ) : (
                    waitlist.map((entry, index) => (
                      <tr key={entry.id} className="group hover:bg-slate-50/50 transition-colors">
                        <td className="px-10 py-7">
                          <span className="text-2xl font-serif italic text-[#C5A059]">#{index + 1}</span>
                        </td>
                        <td className="px-10 py-7">
                          <div className="font-bold text-[#1B4332] text-base">{entry.name}</div>
                          <div className="text-[11px] text-[#7D7C7A] font-medium">{entry.email} • {entry.phone}</div>
                        </td>
                        <td className="px-10 py-7 text-slate-400 text-xs">
                          {format(new Date(entry.timestamp), 'MMM d, h:mm a')}
                        </td>
                        <td className="px-10 py-7 text-center">
                          <button 
                            onClick={() => deleteWaitlistEntry(entry.id)}
                            className="p-3 text-slate-400 hover:text-rose-500 hover:bg-white rounded-xl shadow-sm transition-all"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Article Composer Overlay */}
      {editingNews && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-[#1B4332]/95 backdrop-blur-xl">
            <div className="bg-white rounded-[3.5rem] p-16 w-full max-w-xl shadow-2xl relative animate-in zoom-in duration-300">
               <button onClick={() => setEditingNews(null)} className="absolute top-10 right-10 p-4 bg-slate-50 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"><X size={24} /></button>
               
               <div className="mb-12">
                  <h4 className="text-4xl font-bold text-[#1B4332] font-serif italic mb-2">{editingNews.id ? 'Refine Article' : 'Executive Composition'}</h4>
                  <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-[#C5A059]">Digital Journal Protocol</p>
               </div>

               <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Headline</label>
                  <input 
                    type="text" 
                    value={editingNews.title || ''}
                    onChange={e => setEditingNews({...editingNews, title: e.target.value})}
                    className="w-full p-6 bg-[#F5F4F0] rounded-2xl border border-[#F0EEEA] focus:ring-4 focus:ring-[#1B4332]/5 outline-none font-bold text-lg"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Abstract</label>
                  <textarea 
                    value={editingNews.description || ''}
                    onChange={e => setEditingNews({...editingNews, description: e.target.value})}
                    className="w-full p-6 bg-[#F5F4F0] rounded-2xl border border-[#F0EEEA] h-32 outline-none text-sm font-light leading-relaxed"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Category Tag</label>
                  <input 
                    type="text" 
                    value={editingNews.tag || ''}
                    onChange={e => setEditingNews({...editingNews, tag: e.target.value})}
                    className="w-full p-6 bg-[#F5F4F0] rounded-2xl border border-[#F0EEEA] outline-none text-xs font-bold uppercase tracking-widest"
                  />
                </div>
                <button onClick={saveNews} className="w-full py-6 bg-[#1B4332] text-white font-bold rounded-2xl shadow-2xl shadow-[#1B4332]/20 hover:scale-[1.01] active:scale-95 transition-all uppercase text-[10px] tracking-[0.4em]">Publish to Journal</button>
              </div>
            </div>
          </div>
      )}

      {/* Member Profile Overlay */}
      {viewingReservation && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-6 bg-[#1B4332]/95 backdrop-blur-3xl">
           <div className="bg-white rounded-[4rem] p-16 max-w-lg w-full shadow-2xl relative text-center">
              <button onClick={() => setViewingReservation(null)} className="absolute top-10 right-10 p-4 hover:bg-slate-50 rounded-full transition-colors"><X size={24} /></button>
              
              <div className="w-32 h-32 bg-[#F5F4F0] text-[#1B4332] rounded-[3rem] flex items-center justify-center mx-auto mb-10 shadow-inner">
                <Users size={56} />
              </div>

              <h4 className="text-3xl font-bold text-[#1B4332] font-serif italic mb-2">{viewingReservation.name}</h4>
              <p className="text-[10px] font-bold text-[#C5A059] uppercase tracking-[0.4em] mb-12">Yhalason Intelligence Record</p>
              
              <div className="text-left space-y-8 mb-16">
                {[
                  { l: 'Member Status', v: viewingReservation.playerType, s: viewingReservation.playerType === 'Member' ? 'text-emerald-500' : 'text-[#C5A059]' },
                  { l: 'Email Verification', v: viewingReservation.email, s: 'text-[#1B4332]' },
                  { l: 'Designated Schedule', v: `${format(new Date(viewingReservation.date), 'MMMM do')} at ${viewingReservation.time}`, s: 'text-[#1B4332]' },
                  { l: 'Settlement Amount', v: `₱${viewingReservation.totalPaid.toLocaleString()}`, s: 'text-[#1B4332]' }
                ].map((row, i) => (
                  <div key={i} className="flex justify-between items-end border-b border-slate-50 pb-4">
                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{row.l}</span>
                    <span className={`text-sm font-bold ${row.s}`}>{row.v}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-4">
                 <button onClick={() => setViewingReservation(null)} className="flex-1 py-6 bg-[#F5F4F0] text-[#7D7C7A] text-[10px] font-bold uppercase tracking-widest rounded-2xl hover:bg-[#E5E1DA] transition-all">Close Dossier</button>
                 <button onClick={() => deleteReservation(viewingReservation.id)} className="flex-1 py-6 bg-rose-50 text-rose-500 text-[10px] font-bold uppercase tracking-widest rounded-2xl hover:bg-rose-100 transition-all">Void Session</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
