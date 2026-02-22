import React, { useState } from 'react';
import { X, UserPlus, Phone, ShieldCheck } from 'lucide-react';
import { Member } from '../types';

interface MemberSignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignUp: (member: Member) => Promise<void>;
}

const MemberSignUpModal: React.FC<MemberSignUpModalProps> = ({ isOpen, onClose, onSignUp }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const newMember: Member = {
      id: `mem-${Date.now()}`,
      name,
      phone,
      joinedAt: new Date(),
    };

    try {
      await onSignUp(newMember);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
        setName('');
        setPhone('');
      }, 2000);
    } catch (error) {
      console.error('Sign up error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-[2.5rem] w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="relative p-8">
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X size={20} className="text-slate-400" />
          </button>

          {!isSuccess ? (
            <>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-[#1B4332] rounded-2xl flex items-center justify-center">
                  <UserPlus className="text-[#C5A059]" size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-[#1B4332] tracking-tight">Elite Membership</h3>
                  <p className="text-slate-400 text-xs font-medium uppercase tracking-widest">Join the Yhalason Legacy</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-4">Full Name</label>
                  <input
                    required
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full px-8 py-5 rounded-3xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#1B4332]/5 outline-none transition-all text-sm font-medium"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-4">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input
                      required
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="09XX XXX XXXX"
                      className="w-full pl-16 pr-8 py-5 rounded-3xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#1B4332]/5 outline-none transition-all text-sm font-medium"
                    />
                  </div>
                </div>

                <div className="p-6 bg-[#F5F4F0] rounded-3xl border border-[#F0EEEA] space-y-3">
                  <div className="flex items-center gap-3 text-[#1B4332]">
                    <ShieldCheck size={18} className="text-[#C5A059]" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Member Benefits</span>
                  </div>
                  <ul className="text-[10px] text-slate-500 space-y-2 font-medium uppercase tracking-wider leading-relaxed">
                    <li>• Exclusive ₱500/hr Court Rate</li>
                    <li>• Priority Booking Window</li>
                    <li>• Complimentary Guest Access</li>
                  </ul>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-6 bg-[#1B4332] text-white font-bold rounded-3xl hover:bg-[#2D5A46] transition-all shadow-xl shadow-[#1B4332]/20 disabled:opacity-50 uppercase text-[10px] tracking-[0.3em]"
                >
                  {isSubmitting ? 'Processing...' : 'Complete Registration'}
                </button>
              </form>
            </>
          ) : (
            <div className="py-12 text-center space-y-6">
              <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto animate-bounce">
                <ShieldCheck size={40} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-[#1B4332]">Welcome, Elite Member</h3>
                <p className="text-slate-500 text-sm mt-2">Your membership has been verified.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MemberSignUpModal;
