
import React from 'react';
import { ChevronLeft, Play, Clock, Heart, Wind, Eye } from 'lucide-react';

interface MeditationContent {
  id: string;
  title: string;
  sub: string;
  duration: string;
  icon: any;
  color: string;
  bg: string;
}

const MEDITATION_LIST: MeditationContent[] = [
  { id: '1', title: '무아(無我) 관찰', sub: '변하는 것들 속에서 변치 않는 나를 찾기', duration: '15분', icon: Eye, color: 'text-indigo-500', bg: 'bg-indigo-50' },
  { id: '2', title: '현존 호흡', sub: '지금 이 순간의 감각에 머무르는 기술', duration: '10분', icon: Wind, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { id: '3', title: '자애 명상', sub: '자신과 타인을 향한 조건 없는 연민', duration: '12분', icon: Heart, color: 'text-rose-500', bg: 'bg-rose-50' },
];

export const MeditationView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  return (
    <div className="flex-1 flex flex-col bg-[#E9EEF6] animate-in overflow-hidden relative">
      <header className="flex-none px-8 pt-10 pb-4 flex items-center justify-between z-20">
        <button onClick={onBack} className="p-2 -ml-2 text-slate-400 hover:text-slate-900">
          <ChevronLeft size={24} />
        </button>
        <span className="text-meta text-slate-400">성찰 명상</span>
        <div className="w-10" />
      </header>

      <div className="flex-1 overflow-y-auto p-8 space-y-10 pb-32">
        <div className="space-y-3">
          <h2 className="serif text-2xl font-bold text-slate-900 leading-tight">고요함 속에서 <br/>의식의 본질을 마주하세요.</h2>
          <p className="text-sm text-slate-400 font-medium italic">에고의 소음이 잦아들면 지혜가 들립니다.</p>
        </div>

        <div className="space-y-5">
          {MEDITATION_LIST.map((m) => (
            <div key={m.id} className="bg-white p-7 rounded-[2.5rem] shadow-premium border border-slate-100 flex items-center justify-between group cursor-pointer active:scale-[0.98] transition-all">
              <div className="flex items-center gap-5">
                <div className={`w-14 h-14 rounded-2xl ${m.bg} flex items-center justify-center ${m.color}`}>
                  <m.icon size={28} />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900 serif leading-none mb-1.5">{m.title}</h4>
                  <p className="text-[11px] text-slate-400 font-medium tracking-tight mb-2">{m.sub}</p>
                  <div className="flex items-center gap-1 opacity-40">
                    <Clock size={10} />
                    <span className="text-[9px] font-bold uppercase tracking-widest">{m.duration}</span>
                  </div>
                </div>
              </div>
              <div className="w-12 h-12 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Play size={18} fill="currentColor" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
