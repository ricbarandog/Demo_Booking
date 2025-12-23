
import React from 'react';
import { CheckCircle2, X } from 'lucide-react';
import { format } from 'date-fns';
import { BookingDetails } from '../types';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: BookingDetails | null;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, onClose, booking }) => {
  if (!isOpen || !booking) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden relative animate-in fade-in zoom-in duration-300">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="p-8 text-center">
          <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={48} />
          </div>

          <h2 className="text-3xl mb-2 text-[#1b4332]">Booking Confirmed!</h2>
          <p className="text-slate-500 mb-8 font-light">
            We've sent your receipt to your chosen {booking.notification} account.
          </p>

          <div className="bg-slate-50 rounded-2xl p-6 text-left mb-8 space-y-3">
            <div className="flex justify-between">
              <span className="text-slate-400 text-sm">Player</span>
              <span className="text-[#1b4332] font-semibold">{booking.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 text-sm">Date</span>
              <span className="text-[#1b4332] font-semibold">{format(booking.date, 'MMM do, yyyy')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 text-sm">Time</span>
              <span className="text-[#1b4332] font-semibold">{booking.time} ({booking.duration} mins)</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full bg-[#1b4332] text-white font-bold py-4 rounded-2xl shadow-lg shadow-[#1b4332]/20 hover:scale-[1.02] active:scale-95 transition-all"
          >
            Fantastic, see you then!
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
