
import React, { useState } from 'react';
import { TimeSlot, NewsItem, BookingDetails } from '../types';
import { Check, X, Plus, Trash2, Edit3, Save, Users, CalendarDays, Clock, Eye } from 'lucide-react';
import { format } from 'date-fns';

interface AdminDashboardProps {
  slots: TimeSlot[];
  setSlots: React.Dispatch<React.SetStateAction<TimeSlot[]>>;
  news: NewsItem[];
  setNews: React.Dispatch<React.SetStateAction<NewsItem[]>>;
  reservations: BookingDetails[];
  setReservations: React.Dispatch<React.SetStateAction<BookingDetails[]>>;
  onClose: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  slots, 
  setSlots, 
  news, 
  setNews, 
  reservations, 
  setReservations, 
  onClose 
}) => {
  const [editingNews, setEditingNews] = useState<Partial<NewsItem> | null>(null);
  const [editingReservation, setEditingReservation] = useState<Partial<BookingDetails> | null>(null);
  const [viewingReservation, setViewingReservation] = useState<BookingDetails | null>(null);

  const toggleSlot = (id: string) => {
    setSlots(prev => prev.map(s => s.id === id ? { ...s, isAvailable: !s.isAvailable } : s));
  };

  const deleteNews = (id: string) => {
    setNews(prev => prev.filter(n => n.id !== id));
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
        tag: editingNews.tag || 'Update',
        imageUrl: editingNews.imageUrl || `https://picsum.photos/seed/${Date.now()}/400/300`,
      };
      setNews(prev => [newItem, ...prev]);
    }
    setEditingNews(null);
  };

  const deleteReservation = (id: string) => {
    const res = reservations.find(r => r.id === id);
    if (res) {
      // Free up the slot if it matches
      setSlots(prev => prev.map(s => s.time === res.time ? { ...s, isAvailable: true } : s));
    }
    setReservations(prev => prev.filter(r => r.id !== id));
  };

  const saveReservation = () => {
    if (!editingReservation?.name || !editingReservation?.email) return;
    setReservations(prev => prev.map(r => r.id === editingReservation.id ? (editingReservation as BookingDetails) : r));
    setEditingReservation(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/95 backdrop-blur-xl overflow-y-auto">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h2 className="text-4xl text-white font-bold tracking-tight">Club Management</h2>
            <p className="text-slate-400 mt-2">Executive control for Yhalason Court Club operations</p>
          </div>
          <button 
            onClick={onClose}
            className="px-8 py-3 bg-white text-slate-900 font-bold rounded-full hover:bg-slate-100 transition-all shadow-xl active:scale-95"
          >
            Exit Dashboard
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Schedule Management */}
          <section className="lg:col-span-1">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
              <span className="w-1.5 h-6 bg-emerald-500 rounded-full"></span>
              Daily Schedule
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {slots.map(slot => (
                <button
                  key={slot.id}
                  onClick={() => toggleSlot(slot.id)}
                  className={`p-4 rounded-2xl border transition-all text-left flex justify-between items-center ${slot.isAvailable ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20' : 'bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20'}`}
                >
                  <div className="flex items-center gap-3">
                    <Clock size={16} />
                    <span className="font-bold">{slot.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] uppercase font-bold">
                    {slot.isAvailable ? <><Check size={14} /> Available</> : <><X size={14} /> Reserved</>}
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* Reservations Management */}
          <section className="lg:col-span-2 space-y-12">
            <div>
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="w-1.5 h-6 bg-amber-500 rounded-full"></span>
                Member Bookings
              </h3>
              <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-white/5 text-slate-400 uppercase text-[10px] font-bold tracking-widest border-b border-white/10">
                      <tr>
                        <th className="px-6 py-4">Player</th>
                        <th className="px-6 py-4">Schedule</th>
                        <th className="px-6 py-4">Duration</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {reservations.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-6 py-12 text-center text-slate-500 italic">No current reservations listed.</td>
                        </tr>
                      ) : (
                        reservations.map(res => (
                          <tr key={res.id} className="text-white hover:bg-white/5 transition-colors group">
                            <td className="px-6 py-4">
                              <div className="font-bold">{res.name}</div>
                              <div className="text-xs text-slate-500">{res.email}</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <CalendarDays size={14} className="text-amber-500" />
                                {format(new Date(res.date), 'MMM do')}
                              </div>
                              <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                                <Clock size={14} />
                                {res.time}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="px-2 py-1 bg-white/10 rounded-lg text-xs">{res.duration} min</span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex justify-end gap-2">
                                <button onClick={() => setViewingReservation(res)} className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-all" title="View Details"><Eye size={16} /></button>
                                <button onClick={() => setEditingReservation(res)} className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-all" title="Edit Booking"><Edit3 size={16} /></button>
                                <button onClick={() => deleteReservation(res.id)} className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all" title="Cancel Booking"><Trash2 size={16} /></button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* News Management */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-3">
                  <span className="w-1.5 h-6 bg-blue-500 rounded-full"></span>
                  Club News & Feed
                </h3>
                <button 
                  onClick={() => setEditingNews({})}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all text-xs font-bold"
                >
                  <Plus size={16} /> New Article
                </button>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {news.map(item => (
                  <div key={item.id} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex gap-4 items-center group">
                    <img src={item.imageUrl} className="w-14 h-14 rounded-xl object-cover grayscale group-hover:grayscale-0 transition-all" />
                    <div className="flex-grow">
                      <p className="text-white font-bold text-sm leading-tight">{item.title}</p>
                      <p className="text-slate-500 text-[10px] uppercase tracking-widest mt-1">{item.tag}</p>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => setEditingNews(item)} className="p-2 text-slate-500 hover:text-white transition-colors"><Edit3 size={16} /></button>
                      <button onClick={() => deleteNews(item.id)} className="p-2 text-slate-500 hover:text-red-400 transition-colors"><Trash2 size={16} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* Edit News Modal */}
        {editingNews && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="bg-white rounded-[2.5rem] p-8 w-full max-w-md shadow-2xl relative">
               <button onClick={() => setEditingNews(null)} className="absolute top-6 right-6 p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 transition-colors"><X size={18} /></button>
              <h4 className="text-2xl font-bold text-slate-900 mb-6">{editingNews.id ? 'Edit Article' : 'Compose News'}</h4>
              <div className="space-y-4">
                <input 
                  type="text" 
                  placeholder="Title" 
                  value={editingNews.title || ''}
                  onChange={e => setEditingNews({...editingNews, title: e.target.value})}
                  className="w-full p-4 bg-slate-50 rounded-xl border border-slate-100 focus:outline-none focus:ring-2 focus:ring-[#1b4332]/20"
                />
                <textarea 
                  placeholder="Brief Description" 
                  value={editingNews.description || ''}
                  onChange={e => setEditingNews({...editingNews, description: e.target.value})}
                  className="w-full p-4 bg-slate-50 rounded-xl border border-slate-100 h-24 focus:outline-none focus:ring-2 focus:ring-[#1b4332]/20"
                />
                <input 
                  type="text" 
                  placeholder="Category (e.g. Tournament, Facility)" 
                  value={editingNews.tag || ''}
                  onChange={e => setEditingNews({...editingNews, tag: e.target.value})}
                  className="w-full p-4 bg-slate-50 rounded-xl border border-slate-100 focus:outline-none focus:ring-2 focus:ring-[#1b4332]/20"
                />
                <div className="flex gap-3 pt-4">
                  <button 
                    onClick={saveNews}
                    className="flex-1 py-4 bg-[#1b4332] text-white font-bold rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-lg"
                  >
                    Update Journal
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Reservation Modal */}
        {editingReservation && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="bg-white rounded-[2.5rem] p-8 w-full max-w-md shadow-2xl relative">
              <button onClick={() => setEditingReservation(null)} className="absolute top-6 right-6 p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 transition-colors"><X size={18} /></button>
              <h4 className="text-2xl font-bold text-slate-900 mb-6">Modify Reservation</h4>
              <div className="space-y-4">
                <div className="space-y-1">
                   <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Member Name</label>
                   <input 
                    type="text" 
                    value={editingReservation.name || ''}
                    onChange={e => setEditingReservation({...editingReservation, name: e.target.value})}
                    className="w-full p-4 bg-slate-50 rounded-xl border border-slate-100 focus:outline-none focus:ring-2 focus:ring-[#1b4332]/20"
                  />
                </div>
                <div className="space-y-1">
                   <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Contact Email</label>
                   <input 
                    type="email" 
                    value={editingReservation.email || ''}
                    onChange={e => setEditingReservation({...editingReservation, email: e.target.value})}
                    className="w-full p-4 bg-slate-50 rounded-xl border border-slate-100 focus:outline-none focus:ring-2 focus:ring-[#1b4332]/20"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Time</label>
                    <select 
                      value={editingReservation.time || ''}
                      onChange={e => setEditingReservation({...editingReservation, time: e.target.value})}
                      className="w-full p-4 bg-slate-50 rounded-xl border border-slate-100 focus:outline-none"
                    >
                      {slots.map(s => <option key={s.id} value={s.time}>{s.time}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Duration</label>
                    <select 
                      value={editingReservation.duration || 60}
                      onChange={e => setEditingReservation({...editingReservation, duration: parseInt(e.target.value) as 60 | 90})}
                      className="w-full p-4 bg-slate-50 rounded-xl border border-slate-100 focus:outline-none"
                    >
                      <option value={60}>60 Min</option>
                      <option value={90}>90 Min</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <button 
                    onClick={saveReservation}
                    className="flex-1 py-4 bg-[#1b4332] text-white font-bold rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-lg"
                  >
                    Apply Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* View Details Modal */}
        {viewingReservation && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="bg-white rounded-[2.5rem] p-10 w-full max-w-md shadow-2xl relative">
              <button onClick={() => setViewingReservation(null)} className="absolute top-6 right-6 p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 transition-colors"><X size={18} /></button>
              
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-emerald-50 text-[#1b4332] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users size={32} />
                </div>
                <h4 className="text-2xl font-bold text-[#1b4332]">Booking Certificate</h4>
                <p className="text-slate-400 text-xs uppercase tracking-widest mt-1">Ref: {viewingReservation.id}</p>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-y-6">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Player</p>
                    <p className="text-slate-900 font-bold">{viewingReservation.name}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Date</p>
                    <p className="text-slate-900 font-bold">{format(new Date(viewingReservation.date), 'MMMM do, yyyy')}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Time / Duration</p>
                    <p className="text-slate-900 font-bold">{viewingReservation.time} ({viewingReservation.duration}m)</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Contact</p>
                    <p className="text-slate-900 font-bold">{viewingReservation.email}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Notification</p>
                    <p className="text-slate-900 font-bold">{viewingReservation.notification}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Status</p>
                    <p className="text-emerald-600 font-bold flex items-center gap-1">Confirmed <Check size={14} /></p>
                  </div>
                </div>

                <button 
                  onClick={() => setViewingReservation(null)}
                  className="w-full py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all mt-4"
                >
                  Close Record
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
