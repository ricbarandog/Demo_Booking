
import React from 'react';
import { NewsItem } from '../types';

const NewsCard: React.FC<{ item: NewsItem }> = ({ item }) => (
  <div className="snap-center flex-shrink-0 w-[320px] bg-white rounded-[2.5rem] border border-white/10 shadow-sm overflow-hidden hover:-translate-y-2 transition-all duration-500 group">
    <div className="h-48 overflow-hidden relative">
      <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#1B4332]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <span className="absolute top-6 left-6 px-4 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-[9px] font-bold uppercase tracking-widest text-[#1B4332] shadow-sm">
        {item.tag}
      </span>
    </div>
    <div className="p-10 space-y-3">
      <h4 className="text-xl font-bold text-[#1B4332] mb-1 leading-tight tracking-tight group-hover:text-[#C5A059] transition-colors">{item.title}</h4>
      <p className="text-slate-500 text-sm line-clamp-2 font-light leading-relaxed">{item.description}</p>
    </div>
  </div>
);

export default NewsCard;
