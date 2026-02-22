
import React, { useState } from 'react';
import { X, Users, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { WaitlistEntry } from '../types';

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJoin: (entry: WaitlistEntry) => Promise<void>;
  waitlistCount: number;
}

const WaitlistModal: React.FC<WaitlistModalProps> = ({ isOpen, onClose, onJoin, waitlistCount }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const newEntry: WaitlistEntry = {
      id: `wl-${Date.now()}`,
      name,
      phone,
      timestamp: new Date(),
    };
    
    try {
      await onJoin(newEntry);
      setSubmitted(true);
      setTimeout(() => {
        onClose();
        setSubmitted(false);
        setName('');
        setPhone('');
      }, 2000);
    } catch (error) {
      console.error('Waitlist error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#1B4332]/95 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="bg-white rounded-[3rem] p-12 w-full max-w-md shadow-2xl relative overflow-hidden animate-in zoom-in duration-300">
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 p-3 bg-slate-50 hover:bg-slate-100 rounded-full text-slate-400 transition-all"
        >
          <X size={20} />
        </button>

        {!submitted ? (
          <>
            <div className="mb-10 text-center">
              <div className="w-20 h-20 bg-[#C5A059]/10 text-[#C5A059] rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                <Users size={32} />
              </div>
              <h2 className="text-3xl font-bold text-[#1B4332] font-serif italic mb-2">Join the Waitlist</h2>
              <p className="text-slate-500 text-sm font-light">
                There are currently <span className="font-bold text-[#1B4332]">{waitlistCount}</span> people ahead of you.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Full Name</label>
                  <input 
                    required
                    type="text" 
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full p-5 bg-[#F5F4F0] rounded-2xl border border-[#F0EEEA] outline-none text-sm"
                    placeholder="Juan Dela Cruz"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Phone Number</label>
                  <input 
                    required
                    type="tel" 
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full p-5 bg-[#F5F4F0] rounded-2xl border border-[#F0EEEA] outline-none text-sm"
                    placeholder="0912 345 6789"
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full py-5 bg-[#1B4332] text-white font-bold rounded-2xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all uppercase text-[10px] tracking-[0.3em] disabled:opacity-50"
              >
                {isSubmitting ? 'Processing...' : 'Secure My Spot'}
              </button>
            </form>
          </>
        ) : (
          <div className="py-12 text-center animate-in zoom-in duration-500">
            <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8">
              <CheckCircle2 size={48} />
            </div>
            <h2 className="text-3xl font-bold text-[#1B4332] font-serif italic mb-4">You're on the list!</h2>
            <p className="text-slate-500 font-light leading-relaxed">
              We'll notify you as soon as a slot becomes available. Thank you for your patience.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WaitlistModal;
