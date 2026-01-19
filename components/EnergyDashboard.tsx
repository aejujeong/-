
import React, { useMemo } from 'react';
import { EnergyRecord, AppLanguage } from '../types';
import { TrendingUp, ChevronRight, Sparkles, Target, MessageCircle, Mic, BookOpen } from 'lucide-react';
import { UI_STRINGS } from '../constants';

interface EnergyDashboardProps {
  currentEnergy: EnergyRecord | null;
  history: EnergyRecord[];
  lang: AppLanguage;
  onStartChat: () => void;
  onViewLevel: () => void;
  onViewMission: () => void;
  onViewHistory: () => void;
  onOpenInsight: () => void;
  onViewMeditation: () => void;
  onViewLibrary: () => void;
  header?: React.ReactNode;
}

interface OHLCData {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

export const EnergyDashboard: React.FC<EnergyDashboardProps> = ({ 
  currentEnergy, 
  history, 
  lang,
  onStartChat,
  onViewLevel,
  onViewMission,
  onViewHistory,
  onOpenInsight,
  onViewMeditation,
  onViewLibrary,
  header
}) => {
  const t = UI_STRINGS[lang] || UI_STRINGS.en;
  
  const levelNames = lang === 'ko' ? 
    ["비어있음", "파괴", "무력", "불안", "저항", "용기", "중용", "신뢰", "수용", "사랑", "현존"] :
    ["Empty", "Destruction", "Apathy", "Fear", "Pride", "Courage", "Neutrality", "Willingness", "Acceptance", "Love", "Peace"];

  const level = currentEnergy ? currentEnergy.level : 0;
  const levelName = levelNames[level] || (lang === 'ko' ? "측정 중" : "Scanning...");

  const { candleData, startTime, scaleRange, xAxisLabels } = useMemo(() => {
    if (history.length === 0) return { candleData: [], startTime: Date.now(), scaleRange: 7 * 24 * 60 * 60 * 1000, xAxisLabels: [] };
    
    const sorted = [...history].sort((a, b) => a.timestamp - b.timestamp);
    const start = new Date(sorted[0].timestamp);
    start.setHours(0, 0, 0, 0); 
    const startTimeMs = start.getTime();

    const periodMs = 7 * 24 * 60 * 60 * 1000;
    const intervalMs = 6 * 60 * 60 * 1000; 
    const numBars = Math.ceil(periodMs / intervalMs);

    const bars: OHLCData[] = [];
    for (let i = 0; i < numBars; i++) {
      const intervalStart = startTimeMs + i * intervalMs;
      const intervalEnd = intervalStart + intervalMs - 1;
      const intervalRecords = history.filter(r => r.timestamp >= intervalStart && r.timestamp <= intervalEnd)
                                    .sort((a, b) => a.timestamp - b.timestamp);

      if (intervalRecords.length > 0) {
        bars.push({
          timestamp: intervalStart,
          open: intervalRecords[0].level,
          close: intervalRecords[intervalRecords.length - 1].level,
          high: Math.max(...intervalRecords.map(r => r.level)),
          low: Math.min(...intervalRecords.map(r => r.level)),
        });
      }
    }

    const labels = [];
    for (let i = 0; i <= 7; i++) {
      const labelDate = new Date(startTimeMs + i * 24 * 60 * 60 * 1000);
      labels.push({
        text: `${labelDate.getMonth() + 1}/${labelDate.getDate()}`,
        pos: (i / 7) * 100
      });
    }

    return { candleData: bars, startTime: startTimeMs, scaleRange: periodMs, xAxisLabels: labels };
  }, [history]);

  const getYPos = (level: number) => {
    if (level === 0) return 85; 
    const padding = 15;
    const height = 70;
    return padding + (height - ((Math.min(Math.max(Number(level || 0), 1), 10) - 1) / 9) * height);
  };

  const getXPos = (ts: number) => {
    const padding = 2;
    const width = 96;
    const ratio = (ts - startTime) / scaleRange;
    return padding + ratio * width;
  };

  return (
    <div className="flex-1 overflow-y-auto relative animate-in flex flex-col bg-[#E9EEF6]">
      {header}
      
      <div className="bg-gradient-to-b from-indigo-800 to-growth-blue px-6 pt-20 pb-12 rounded-b-[3.5rem] shadow-2xl space-y-8">
        
        <div 
          onClick={onViewLevel}
          className="flex items-center gap-6 px-2 cursor-pointer active:scale-[0.98] transition-all"
        >
          <div className="w-20 h-20 rounded-3xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-lg shrink-0">
            <span className="text-4xl font-black serif text-white">
              {level || 0}
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-bold text-white serif tracking-tight">
              {levelName}
            </h1>
            <div className="flex items-center gap-1.5 opacity-60">
              <span className="text-[10px] font-bold text-white uppercase tracking-[0.2em]">현재 에너지 단계</span>
              <ChevronRight size={14} className="text-white" />
            </div>
          </div>
        </div>

        <div 
          onClick={onViewHistory}
          className="p-8 pb-10 flex flex-col bg-white/5 backdrop-blur-lg rounded-[2.5rem] border border-white/10 shadow-inner"
        >
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <TrendingUp size={16} className="text-white/40" />
              <h2 className="text-[11px] font-bold text-white/40 tracking-[0.1em] uppercase">에너지 공명 추이</h2>
            </div>
            <div className="px-2 py-1 rounded-md bg-white/5 border border-white/10">
               <span className="text-[8px] font-bold text-white/30 uppercase tracking-tighter">7 DAYS HISTORY</span>
            </div>
          </div>

          <div className="flex gap-1 h-28 overflow-visible relative">
            <div className="flex flex-col justify-between text-[8px] font-bold text-white/30 pr-2 py-2 h-full z-10">
              <span>10</span>
              <span>5</span>
              <span>1</span>
            </div>
            
            <div className="flex-1 relative h-full">
              <svg className="absolute inset-0 w-full h-full overflow-visible block" viewBox="0 0 100 100" preserveAspectRatio="none">
                {[1, 5, 10].map(val => {
                  const y = getYPos(val);
                  return (
                    <line key={val} x1="2" y1={y} x2="98" y2={y} stroke="white" strokeOpacity="0.05" strokeWidth="0.5" strokeDasharray="2 2" />
                  );
                })}
                
                {candleData.map((d, i) => {
                  const x = getXPos(d.timestamp);
                  const yOpen = getYPos(d.open);
                  const yClose = getYPos(d.close);
                  const yHigh = getYPos(d.high);
                  const yLow = getYPos(d.low);
                  const isUp = d.close >= d.open;
                  const color = isUp ? "#10B981" : "#F43F5E";
                  const candleWidth = 2.6;

                  return (
                    <g key={i}>
                      <line x1={x} y1={yHigh} x2={x} y2={yLow} stroke={color} strokeWidth="0.5" strokeOpacity="0.8" />
                      <rect 
                        x={x - candleWidth / 2} 
                        y={Math.min(yOpen, yClose)} 
                        width={candleWidth} 
                        height={Math.max(Math.abs(yClose - yOpen), 1)} 
                        fill={color}
                        fillOpacity={0.9}
                        rx="0.2"
                      />
                    </g>
                  );
                })}
              </svg>

              <div className="absolute bottom-[-16px] left-0 right-0 h-4 pointer-events-none z-10">
                {xAxisLabels.map((label, i) => (
                  <span 
                    key={i} 
                    className={`absolute text-[8px] font-bold text-white/30 uppercase tracking-tighter -translate-x-1/2 whitespace-nowrap`}
                    style={{ left: `${Math.max(2, Math.min(98, label.pos * 0.96 + 2))}%` }}
                  >
                    {label.text}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-10 space-y-6 pb-32">
        <div 
          onClick={onStartChat}
          className="bento-card p-7 flex items-center justify-between bg-white cursor-pointer active:scale-[0.98] transition-all shadow-premium rounded-[2.5rem] group border border-slate-100"
        >
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-[1.8rem] bg-indigo-50 flex items-center justify-center text-growth-blue">
              <MessageCircle size={28} fill="currentColor" />
            </div>
            <div className="space-y-0.5">
              <h4 className="text-xl font-bold serif text-slate-900 tracking-tight">대화 시작하기</h4>
              <p className="text-[11px] text-slate-400 font-bold tracking-widest uppercase">성자들과의 공명</p>
            </div>
          </div>
          <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-growth-blue transition-colors">
            <ChevronRight size={22} className="text-slate-300 group-hover:text-white" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-5">
          <div 
            onClick={onOpenInsight}
            className="bento-card p-8 flex flex-col aspect-square bg-white shadow-premium rounded-[2.5rem] border border-white group cursor-pointer active:scale-[0.96] transition-all"
          >
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-400 mb-auto group-hover:scale-110 transition-transform">
              <Sparkles size={28} />
            </div>
            <div className="space-y-1">
              <h4 className="text-xl font-bold text-slate-900 serif">인사이트</h4>
              <p className="text-[12px] text-slate-400 font-bold uppercase tracking-tight">심층 분석</p>
            </div>
          </div>

          <div 
            onClick={onViewMission}
            className="bento-card p-8 flex flex-col aspect-square bg-white shadow-premium rounded-[2.5rem] border border-white group cursor-pointer active:scale-[0.96] transition-all"
          >
            <div className="w-14 h-14 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-400 mb-auto group-hover:scale-110 transition-transform">
              <Target size={28} />
            </div>
            <div className="space-y-1">
              <h4 className="text-xl font-bold text-slate-900 serif">미션</h4>
              <p className="text-[12px] text-slate-400 font-bold uppercase tracking-tight">영적 도약</p>
            </div>
          </div>

          <div 
            onClick={onViewMeditation}
            className="bento-card p-8 flex flex-col aspect-square bg-white shadow-premium rounded-[2.5rem] border border-white group cursor-pointer active:scale-[0.96] transition-all"
          >
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-500 mb-auto group-hover:scale-110 transition-transform">
              <Mic size={28} />
            </div>
            <div className="space-y-1">
              <h4 className="text-xl font-bold text-slate-900 serif">명상</h4>
              <p className="text-[12px] text-slate-400 font-bold uppercase tracking-tight">성찰 명상</p>
            </div>
          </div>

          <div 
            onClick={onViewLibrary}
            className="bento-card p-8 flex flex-col aspect-square bg-white shadow-premium rounded-[2.5rem] border border-white group cursor-pointer active:scale-[0.96] transition-all"
          >
            <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500 mb-auto group-hover:scale-110 transition-transform">
              <BookOpen size={28} />
            </div>
            <div className="space-y-1">
              <h4 className="text-xl font-bold text-slate-900 serif">말씀</h4>
              <p className="text-[12px] text-slate-400 font-bold uppercase tracking-tight">성인들의 지혜</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
