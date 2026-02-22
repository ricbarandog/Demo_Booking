
import React, { useState } from 'react';
import { X, Lock, ArrowRight, ShieldCheck, ShieldAlert } from 'lucide-react';

interface AdminLoginProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ isOpen, onClose, onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simplified security check for this demo environment
    if (password === 'admin123') {
      onLogin();
      setPassword('');
      setError(false);
    } else {
      setError(true);
      setPassword('');
      // Vibrate if available
      if ('vibrate' in navigator) navigator.vibrate(200);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#1B4332]/98 backdrop-blur-3xl animate-in fade-in duration-500">
      <div className="bg-white rounded-[4rem] p-16 w-full max-w-md shadow-3xl relative overflow-hidden text-center animate-in zoom-in slide-in-from-bottom-12 duration-500">
        {/* Subtle Decorative Accents */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#C5A059] to-transparent opacity-50" />
        
        <button 
          onClick={onClose}
          className="absolute top-10 right-10 p-4 bg-[#F5F4F0] hover:bg-[#E5E1DA] rounded-full text-[#7D7C7A] transition-all group"
        >
          <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
        </button>

        <div className="mb-16">
          <div className="w-24 h-24 bg-[#1B4332] text-[#C5A059] rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-2xl relative group overflow-hidden">
            <div className="absolute inset-0 bg-white/5 group-hover:bg-white/10 transition-colors"></div>
            <Lock size={36} className="relative z-10 group-hover:scale-110 transition-transform duration-500" />
          </div>
          <h2 className="text-4xl font-bold text-[#1B4332] tracking-tight mb-3 font-serif italic">Executive Portal</h2>
          <p className="text-[#A8A7A5] text-[10px] uppercase tracking-[0.5em] font-bold">Encrypted Management Entry</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">
          <div className="space-y-4">
            <div className={`relative transition-all duration-300 ${error ? 'animate-shake' : ''}`}>
              <input
                autoFocus
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(false);
                }}
                placeholder="Manager Key"
                className={`w-full px-10 py-6 rounded-[2rem] border bg-[#F5F4F0] focus:outline-none transition-all text-center tracking-[1.5em] font-bold text-xl placeholder:tracking-normal placeholder:font-medium placeholder:text-slate-300 ${error ? 'border-rose-500 ring-8 ring-rose-500/5' : 'border-[#F0EEEA] focus:ring-8 focus:ring-[#1B4332]/5 focus:border-[#C5A059]'}`}
              />
            </div>
            <div className="h-6 flex items-center justify-center">
              {error && (
                <p className="text-rose-500 text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-2 animate-in slide-in-from-top-2">
                  <ShieldAlert size={14} /> Security Rejection
                </p>
              )}
              {!error && !password && (
                <p className="text-slate-300 text-[9px] uppercase tracking-widest flex items-center gap-2">
                   <ShieldCheck size={12} /> Station ID: YH-994
                </p>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#1B4332] text-white font-bold py-6 rounded-[1.5rem] shadow-2xl shadow-[#1B4332]/20 hover:bg-[#2D5A47] hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-4 group uppercase text-[10px] tracking-[0.4em]"
          >
            Authenticate Identity
            <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform duration-300" />
          </button>
        </form>

        <div className="mt-16 pt-12 border-t border-[#F5F4F0]">
           <p className="text-[#A8A7A5] text-[9px] font-medium uppercase tracking-[0.2em] leading-relaxed max-w-[200px] mx-auto">
             Unauthorized access attempts are logged and flagged for <span className="text-[#1B4332] font-bold">Steward Review.</span>
           </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
