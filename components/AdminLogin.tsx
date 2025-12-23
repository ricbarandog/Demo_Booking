
import React, { useState } from 'react';
import { X, ShieldCheck, ShieldAlert } from 'lucide-react';

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
    // In a real app, this would be an API call. 
    // For this prototype, we use a simple hardcoded key.
    if (password === 'admin123') {
      onLogin();
      setPassword('');
      setError(false);
    } else {
      setError(true);
      setPassword('');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-[2.5rem] p-10 w-full max-w-sm shadow-2xl relative overflow-hidden">
        {/* Background Decorative Element */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#1b4332]/5 rounded-bl-full -mr-10 -mt-10" />
        
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 transition-colors"
        >
          <X size={18} />
        </button>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#1b4332]/10 text-[#1b4332] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ShieldCheck size={28} />
          </div>
          <h2 className="text-2xl font-bold text-[#1b4332]">Management Portal</h2>
          <p className="text-slate-400 text-sm mt-1">Authorized Yhalason staff only</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Access Key</label>
            <div className={`relative transition-transform ${error ? 'animate-bounce' : ''}`}>
              <input
                autoFocus
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(false);
                }}
                placeholder="••••••••"
                className={`w-full px-5 py-4 rounded-2xl border bg-slate-50 focus:outline-none transition-all ${error ? 'border-red-500 ring-4 ring-red-500/10' : 'border-slate-100 focus:ring-4 focus:ring-[#1b4332]/10'}`}
              />
            </div>
            {error && (
              <p className="text-red-500 text-[10px] font-bold uppercase tracking-tighter flex items-center gap-1 mt-2 ml-1">
                <ShieldAlert size={12} /> Invalid access key
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-[#1b4332] text-white font-bold py-4 rounded-2xl shadow-lg shadow-[#1b4332]/20 hover:scale-[1.02] active:scale-95 transition-all mt-4"
          >
            Authenticate
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
