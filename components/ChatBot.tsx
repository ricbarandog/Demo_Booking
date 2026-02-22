
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { MessageSquare, Send, X, Bot, Loader2 } from 'lucide-react';
import { TimeSlot, NewsItem } from '../types.ts';
import { CLUB_RATES } from '../constants.ts';

// Add global declaration to fix "Cannot find name 'process'" in TypeScript environments
declare var process: {
  env: {
    [key: string]: string | undefined;
  };
};

interface ChatBotProps {
  slots: TimeSlot[];
  news: NewsItem[];
}

const ChatBot: React.FC<ChatBotProps> = ({ slots, news }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'bot'; text: string }[]>([
    { role: 'bot', text: 'Welcome to Yhalason Court Club concierge. How may I assist you with your booking today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      // Create a new instance right before use as per guidelines, using process.env.API_KEY directly
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const availableSlots = slots.filter(s => s.isAvailable).map(s => s.time).join(', ');
      
      const systemInstruction = `
        You are the premium concierge for "Yhalason Court Club". 
        Be professional, helpful, and sophisticated.
        Here is the current club data:
        - Available time slots today: ${availableSlots || 'No slots currently available'}
        - Rates: $${CLUB_RATES.member}/hr for members, $${CLUB_RATES.nonMember}/hr for non-members. Guest fee is $${CLUB_RATES.guestFee}.
        - Latest news highlights: ${news.map(n => n.title).join(', ')}.
        
        Answer user questions about availability and rates concisely. If they want to book, tell them to use the reservation engine on the page.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMsg,
        config: { systemInstruction }
      });

      setMessages(prev => [...prev, { role: 'bot', text: response.text || "I apologize, I'm having trouble connecting to my systems." }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { role: 'bot', text: "I'm sorry, I'm currently resting. Please try again in a moment." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-16 h-16 bg-[#1b4332] text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50 ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
      >
        <MessageSquare size={28} />
      </button>

      <div className={`fixed bottom-6 right-6 w-[360px] max-w-[90vw] h-[500px] bg-white rounded-[2rem] shadow-2xl z-50 flex flex-col overflow-hidden transition-all origin-bottom-right ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`}>
        <div className="bg-[#1b4332] p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Bot size={24} />
            </div>
            <div>
              <p className="font-bold text-sm">Concierge</p>
              <p className="text-[10px] text-emerald-200 uppercase tracking-widest font-bold">Online</p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div ref={scrollRef} className="flex-grow p-6 overflow-y-auto space-y-4 bg-slate-50/50">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm ${m.role === 'user' ? 'bg-[#1b4332] text-white rounded-tr-none shadow-lg' : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'}`}>
                {m.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-none border border-slate-100 flex items-center gap-2 text-slate-400">
                <Loader2 size={16} className="animate-spin" />
                <span className="text-xs">Thinking...</span>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 bg-white border-t border-slate-100">
          <div className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about rates or availability..."
              className="w-full pl-4 pr-12 py-3 bg-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4332]/10"
            />
            <button
              onClick={handleSend}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-[#1b4332] hover:bg-[#1b4332]/5 rounded-lg"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatBot;
