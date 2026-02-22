
import React from 'react';
import { CheckCircle2, X, AlertTriangle, Download } from 'lucide-react';
import { format } from 'date-fns';
import { QRCodeSVG } from 'qrcode.react';
import { BookingDetails } from '../types';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: BookingDetails | null;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, onClose, booking }) => {
  if (!isOpen || !booking) return null;

  const qrData = JSON.stringify({
    id: booking.id,
    name: booking.name,
    date: format(booking.date, 'yyyy-MM-dd'),
    time: booking.time
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden relative animate-in fade-in zoom-in duration-300">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="p-8 text-center">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={32} />
          </div>

          <h2 className="text-2xl font-bold mb-2 text-[#1b4332]">Booking Confirmed!</h2>
          <p className="text-slate-500 mb-6 text-sm font-light">
            Your reservation is secured. Please save your reference code below.
          </p>

          <div className="bg-white border-2 border-dashed border-slate-200 rounded-[2rem] p-6 mb-6 flex flex-col items-center gap-4">
            <div className="p-4 bg-white rounded-2xl shadow-sm border border-slate-100">
              <QRCodeSVG value={qrData} size={140} />
            </div>
            <div className="text-center">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C5A059] mb-1">Reference Code</p>
              <p className="text-sm font-mono font-bold text-[#1B4332]">{booking.id.toUpperCase()}</p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full text-[9px] font-bold uppercase tracking-widest text-slate-400">
              <Download size={12} />
              Please screenshot or save this code
            </div>
          </div>

          <div className="bg-[#F5F4F0] rounded-2xl p-6 text-left mb-6 space-y-3 border border-[#F0EEEA]">
            <div className="flex justify-between items-center">
              <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Total Due</span>
              <span className="text-[#1b4332] text-xl font-bold font-serif italic">₱{booking.totalPaid.toLocaleString()}</span>
            </div>
            <div className="h-px bg-slate-200 w-full" />
            <div className="flex justify-between">
              <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Session</span>
              <span className="text-[#1b4332] text-xs font-bold">{format(booking.date, 'MMM do')} @ {booking.time}</span>
            </div>
          </div>

          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex gap-3 items-start text-left mb-8">
            <AlertTriangle className="text-amber-600 flex-shrink-0" size={16} />
            <p className="text-[10px] text-amber-800 leading-relaxed font-medium">
              <span className="font-bold uppercase tracking-wider">Cancellation Policy:</span> A fee of <span className="font-bold">₱200</span> applies for cancellations made less than 24 hours before the session.
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-full bg-[#1b4332] text-white font-bold py-5 rounded-2xl shadow-lg shadow-[#1b4332]/20 hover:scale-[1.02] active:scale-95 transition-all uppercase text-[10px] tracking-[0.3em]"
          >
            I've saved my code
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
