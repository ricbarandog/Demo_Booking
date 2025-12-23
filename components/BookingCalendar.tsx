
import React from 'react';
// Only import existing date-fns members to avoid "no exported member" errors
import { format, addMonths, endOfMonth, eachDayOfInterval, isSameDay, isToday } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface BookingCalendarProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

const BookingCalendar: React.FC<BookingCalendarProps> = ({ selectedDate, onDateChange }) => {
  const [currentMonth, setCurrentMonth] = React.useState(new Date());
  
  // FIX: Manual implementation of startOfToday()
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // FIX: Manual implementation of startOfMonth()
  const getStartOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1);

  const days = eachDayOfInterval({
    start: getStartOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  
  // FIX: Use addMonths with -1 instead of missing subMonths()
  const prevMonth = () => setCurrentMonth(addMonths(currentMonth, -1));

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 w-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-[#1b4332]">{format(currentMonth, 'MMMM yyyy')}</h3>
        <div className="flex gap-2">
          <button onClick={prevMonth} className="p-2 hover:bg-slate-50 rounded-full transition-colors">
            <ChevronLeft size={20} className="text-[#1b4332]" />
          </button>
          <button onClick={nextMonth} className="p-2 hover:bg-slate-50 rounded-full transition-colors">
            <ChevronRight size={20} className="text-[#1b4332]" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-slate-400 mb-2">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => <div key={i}>{d}</div>)}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {/* Placeholder for empty days at start of month */}
        {Array.from({ length: getStartOfMonth(currentMonth).getDay() }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        
        {days.map((day) => {
          const isSelected = isSameDay(day, selectedDate);
          const isPast = day < today;
          
          return (
            <button
              key={day.toString()}
              disabled={isPast}
              onClick={() => onDateChange(day)}
              className={`
                aspect-square flex items-center justify-center text-sm rounded-xl transition-all
                ${isSelected ? 'bg-[#1b4332] text-white shadow-lg' : 'hover:bg-slate-50 text-slate-700'}
                ${isPast ? 'opacity-20 cursor-not-allowed' : 'cursor-pointer'}
                ${isToday(day) && !isSelected ? 'text-[#1b4332] font-bold border border-[#1b4332]/20' : ''}
              `}
            >
              {format(day, 'd')}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BookingCalendar;
