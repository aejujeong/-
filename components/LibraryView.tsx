
import React from 'react';
import { ChevronLeft, Cross, Flower2, Sun, ArrowRight } from 'lucide-react';

interface LibraryViewProps {
  onBack: () => void;
  onSelectCategory: (cat: 'bible' | 'buddha' | 'sage') => void;
}

export const LibraryView: React.FC<LibraryViewProps> = ({ onBack, onSelectCategory }) => {
  return (
    <div className="flex-1 flex flex-col bg-[#E9EEF6] animate-in overflow-hidden relative">
      <header className="flex-none px-8 pt-10 pb-4 flex items-center justify-between z-20">
        <button onClick={onBack} className="p-2 -ml-2 text-slate-400 hover:text-slate-900">
          <ChevronLeft size={24} />
        </button>
        <span className="text-meta text-slate-400">성인들의 지혜</span>
        <div className="w-10" />
      </header>

      <div className="flex-1 overflow-y-auto p-8 space-y-10 pb-32">
        <div className="space-y-3">
          <h2 className="serif text-2xl font-bold text-slate-900 leading-tight">시간이 증명한 <br/>영원한 말씀의 도서관.</h2>
          <p className="text-sm text-slate-400 font-medium italic">성인들의 목소리가 당신의 길을 비춥니다.</p>
        </div>

        <div className="grid grid-cols-1 gap-5">
          {[
            { id: 'bible', name: '성경 (Bible)', sub: '사랑과 구원의 말씀', icon: Cross, color: 'text-amber-500', bg: 'bg-amber-50' },
            { id: 'buddha', name: '불경 (Dharma)', sub: '공(空)과 깨달음의 지혜', icon: Flower2, color: 'text-emerald-500', bg: 'bg-emerald-50' },
            { id: 'sage', name: '고전/스승 (Sages)', sub: '스토아학파와 동서양 고전', icon: Sun, color: 'text-indigo-500', bg: 'bg-indigo-50' }
          ].map((cat) => (
            <button 
              key={cat.id} 
              onClick={() => onSelectCategory(cat.id as any)}
              className="w-full p-8 bg-white rounded-[2.8rem] shadow-premium border border-slate-100 flex items-center justify-between group active:scale-[0.98] transition-all"
            >
              <div className="flex items-center gap-6">
                <div className={`w-16 h-16 rounded-[1.8rem] ${cat.bg} flex items-center justify-center ${cat.color} group-hover:scale-110 transition-transform`}>
                  <cat.icon size={32} />
                </div>
                <div className="text-left">
                  <h4 className="text-xl font-bold text-slate-900 serif leading-none mb-2">{cat.name}</h4>
                  <p className="text-[11px] text-slate-400 font-bold uppercase tracking-tight">{cat.sub}</p>
                </div>
              </div>
              <ArrowRight size={20} className="text-slate-200 group-hover:text-slate-900 group-hover:translate-x-1 transition-all" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
