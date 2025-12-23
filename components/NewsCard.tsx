
import React from 'react';
import { NewsItem } from '../types';

const NewsCard: React.FC<{ item: NewsItem }> = ({ item }) => (
  <div className="snap-center flex-shrink-0 w-[280px] bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
    <div className="h-40 overflow-hidden relative">
      <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
      <span className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-[10px] font-bold uppercase tracking-wider text-[#1b4332]">
        {item.tag}
      </span>
    </div>
    <div className="p-4">
      <h4 className="text-lg font-bold text-[#1b4332] mb-1 leading-tight">{item.title}</h4>
      <p className="text-slate-500 text-sm line-clamp-2">{item.description}</p>
    </div>
  </div>
);

export default NewsCard;
