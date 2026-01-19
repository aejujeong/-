
import React from 'react';
import { Scripture } from '../types';
import { Quote, BookOpen, ExternalLink } from 'lucide-react';

interface SageCardProps {
  scripture: Scripture;
  onExplore: (scripture: Scripture) => void;
}

export const SageCard: React.FC<SageCardProps> = ({ scripture, onExplore }) => {
  return (
    <div className="glass-panel p-7 rounded-2xl border-l-4 border-white/20 my-6 animate-in fade-in slide-in-from-bottom-4 duration-1000 shadow-xl shadow-black/20">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-white/40">
          <BookOpen size={16} />
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase">{scripture.source}</span>
        </div>
        <button 
          onClick={() => onExplore(scripture)}
          className="flex items-center gap-1 text-[10px] font-bold text-rose-400 hover:text-rose-300 transition-colors uppercase tracking-widest bg-rose-500/5 px-2 py-1 rounded-md border border-rose-500/10"
        >
          <ExternalLink size={12} />
          전문 읽기
        </button>
      </div>
      
      <div className="relative">
        <Quote className="absolute -top-4 -left-4 text-white/5" size={56} />
        <p className="serif text-xl md:text-2xl text-white/90 leading-[1.6] relative z-10 italic font-light tracking-tight">
          {scripture.quote}
        </p>
      </div>
      
      <div className="mt-8 pt-5 border-t border-white/5">
        <p className="text-[13px] text-gray-400 leading-relaxed">
          <span className="text-white/20 font-bold mr-2 uppercase tracking-tighter italic text-xs">Insight:</span>
          {scripture.insight}
        </p>
      </div>
    </div>
  );
};
