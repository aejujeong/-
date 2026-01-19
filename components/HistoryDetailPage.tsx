import React, { useState, useMemo, useRef, useEffect } from 'react';
import { EnergyRecord } from '../types';
import { History, MessageSquare, ChevronDown, Calendar, TrendingUp, ChevronRight } from 'lucide-react';

interface HistoryDetailPageProps {
  history: EnergyRecord[];
  onBack: () => void;
  lang?: string;
}

interface OHLCData {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

export const HistoryDetailPage: React.FC<HistoryDetailPageProps> = ({ history, lang = 'ko' }) => {
  const [timePeriod, setTimePeriod] = useState<'1d' | '7d' | '30d' | '90d' | '180d' | '365d'>('7d');
  const [isPeriodOpen, setIsPeriodOpen] = useState(false);
  const [expandedDates, setExpandedDates] = useState<string[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const toggleDate = (date: string) => {
    setExpandedDates(prev => 
      prev.includes(date) ? prev.filter(d => d !== date) : [...prev, date]
    );
  };

  const getLabel = (p: string) => {
    if (lang === 'ko') {
      switch(p) {
        case '1d': return '1날';
        case '7d': return '1주';
        case '30d': return '1달';
        case '90d': return '3달';
        case '180d': return '6달';
        case '365d': return '12달';
        default: return p;
      }
    }
    return p;
  };

  const timeConfig = useMemo(() => {
    const sorted = [...history].sort((a, b) => a.timestamp - b.timestamp);
    const latestTs = sorted.length > 0 ? sorted[sorted.length - 1].timestamp : Date.now();
    const anchor = new Date(latestTs);

    let start = 0;
    let end = 0;

    switch(timePeriod) {
      case '1d': {
        const d = new Date(anchor);
        d.setHours(0, 0, 0, 0);
        start = d.getTime();
        end = start + 24 * 60 * 60 * 1000;
        break;
      }
      case '7d': {
        // '1주' 요청: x축 범위를 해당 월의 1/1~1/31일로 설정 (가로 스크롤)
        const dStart = new Date(anchor.getFullYear(), anchor.getMonth(), 1);
        dStart.setHours(0, 0, 0, 0);
        const dEnd = new Date(anchor.getFullYear(), anchor.getMonth() + 1, 0);
        dEnd.setHours(23, 59, 59, 999);
        start = dStart.getTime();
        end = dEnd.getTime();
        break;
      }
      case '30d': {
        // '1달' 요청: 1/1부터 12/31까지 가로 스크롤
        const dStart = new Date(anchor.getFullYear(), 0, 1);
        dStart.setHours(0, 0, 0, 0);
        const dEnd = new Date(anchor.getFullYear(), 11, 31);
        dEnd.setHours(23, 59, 59, 999);
        start = dStart.getTime();
        end = dEnd.getTime();
        break;
      }
      case '90d': {
        // '3달' 요청: 입력 달 포함 3개월
        const dStart = new Date(anchor.getFullYear(), anchor.getMonth(), 1);
        dStart.setHours(0, 0, 0, 0);
        const dEnd = new Date(anchor.getFullYear(), anchor.getMonth() + 3, 0);
        dEnd.setHours(23, 59, 59, 999);
        start = dStart.getTime();
        end = dEnd.getTime();
        break;
      }
      case '180d': {
        // '6달' 요청: 입력 달 포함 6개월
        const dStart = new Date(anchor.getFullYear(), anchor.getMonth(), 1);
        dStart.setHours(0, 0, 0, 0);
        const dEnd = new Date(anchor.getFullYear(), anchor.getMonth() + 6, 0);
        dEnd.setHours(23, 59, 59, 999);
        start = dStart.getTime();
        end = dEnd.getTime();
        break;
      }
      case '365d': {
        // '12달' 요청: 1월~12월 고정
        const dStart = new Date(anchor.getFullYear(), 0, 1);
        dStart.setHours(0, 0, 0, 0);
        const dEnd = new Date(anchor.getFullYear(), 11, 31);
        dEnd.setHours(23, 59, 59, 999);
        start = dStart.getTime();
        end = dEnd.getTime();
        break;
      }
    }

    return { start, end, scaleRange: end - start, latestTs };
  }, [history, timePeriod]);

  // 가로 스크롤을 위한 내부 너비 설정
  const chartInternalWidth = useMemo(() => {
    if (timePeriod === '30d') return 3650; // 1년 전체 (1달 보기)
    if (timePeriod === '7d') return 1200; // 1개월 전체 (1주 보기)
    return 100; // 나머지는 기본 %
  }, [timePeriod]);

  const chartData = useMemo(() => {
    const bars: OHLCData[] = [];
    const { start, end } = timeConfig;

    if (timePeriod === '1d') {
      for (let h = 0; h < 24; h++) {
        const s = start + h * 3600000;
        const e = s + 3600000;
        const records = history.filter(r => r.timestamp >= s && r.timestamp < e).sort((a, b) => a.timestamp - b.timestamp);
        if (records.length > 0) {
          bars.push({ timestamp: s, open: records[0].level, close: records[records.length - 1].level, high: Math.max(...records.map(r => r.level)), low: Math.min(...records.map(r => r.level)) });
        }
      }
    } else if (timePeriod === '7d' || timePeriod === '30d') {
      const days = Math.round((end - start) / 86400000);
      for (let d = 0; d < days; d++) {
        const s = start + d * 86400000;
        const e = s + 86400000;
        const records = history.filter(r => r.timestamp >= s && r.timestamp < e).sort((a, b) => a.timestamp - b.timestamp);
        if (records.length > 0) {
          bars.push({ timestamp: s, open: records[0].level, close: records[records.length - 1].level, high: Math.max(...records.map(r => r.level)), low: Math.min(...records.map(r => r.level)) });
        }
      }
    } else if (timePeriod === '90d' || timePeriod === '180d') {
      const monthsCount = timePeriod === '90d' ? 3 : 6;
      const stepDays = timePeriod === '90d' ? 3 : 7;
      const baseDate = new Date(start);
      for (let m = 0; m < monthsCount; m++) {
        const mStart = new Date(baseDate.getFullYear(), baseDate.getMonth() + m, 1);
        const mEnd = new Date(baseDate.getFullYear(), baseDate.getMonth() + m + 1, 0);
        const daysInMonth = mEnd.getDate();
        
        for (let d = 1; d <= daysInMonth; ) {
          let s = new Date(mStart);
          s.setDate(d);
          let e = new Date(s);
          
          let nextD = d + stepDays;
          // 마지막 날 유동적 처리 (3달: 3일 간격 / 6달: 7일 간격)
          if (nextD > daysInMonth - 1) {
            e.setDate(daysInMonth + 1);
            d = daysInMonth + 1;
          } else {
            e.setDate(nextD);
            d = nextD;
          }
          
          const records = history.filter(r => r.timestamp >= s.getTime() && r.timestamp < e.getTime()).sort((a, b) => a.timestamp - b.timestamp);
          if (records.length > 0) {
            bars.push({ timestamp: s.getTime(), open: records[0].level, close: records[records.length - 1].level, high: Math.max(...records.map(r => r.level)), low: Math.min(...records.map(r => r.level)) });
          }
        }
      }
    } else if (timePeriod === '365d') {
      const baseDate = new Date(start);
      for (let m = 0; m < 12; m++) {
        const s = new Date(baseDate.getFullYear(), m, 1);
        const e = new Date(baseDate.getFullYear(), m + 1, 1);
        const records = history.filter(r => r.timestamp >= s.getTime() && r.timestamp < e.getTime()).sort((a, b) => a.timestamp - b.timestamp);
        if (records.length > 0) {
          bars.push({ timestamp: s.getTime(), open: records[0].level, close: records[records.length - 1].level, high: Math.max(...records.map(r => r.level)), low: Math.min(...records.map(r => r.level)) });
        }
      }
    }
    return bars;
  }, [history, timeConfig, timePeriod]);

  const xAxisLabels = useMemo(() => {
    const labels: { text: string; pos: number }[] = [];
    const { start, end, scaleRange } = timeConfig;
    
    if (timePeriod === '1d') {
      [0, 6, 12, 18, 24].forEach(h => {
        labels.push({ text: `${String(h).padStart(2, '0')}:00`, pos: (h / 24) * 100 });
      });
    } else if (timePeriod === '7d') {
      const startD = new Date(start);
      const days = Math.round((end - start) / 86400000);
      for (let i = 0; i < days; i++) {
        const d = new Date(start + i * 86400000);
        if (i % 5 === 0 || i === days - 1) {
          labels.push({ text: `${d.getDate()}일`, pos: (i / days) * 100 });
        }
      }
    } else if (timePeriod === '30d') {
      for (let m = 0; m <= 12; m++) {
        const d = new Date(new Date(start).getFullYear(), m, 1);
        const pos = ((d.getTime() - start) / scaleRange) * 100;
        if (pos <= 100) labels.push({ text: `${d.getMonth() + 1}월`, pos });
      }
    } else if (timePeriod === '90d' || timePeriod === '180d' || timePeriod === '365d') {
      const monthsCount = timePeriod === '90d' ? 3 : (timePeriod === '180d' ? 6 : 12);
      const startD = new Date(start);
      for (let i = 0; i < monthsCount; i++) {
        const d = new Date(startD.getFullYear(), startD.getMonth() + i, 1);
        const pos = ((d.getTime() - start) / scaleRange) * 100;
        labels.push({ text: `${d.getMonth() + 1}월`, pos });
      }
    }
    return labels;
  }, [timeConfig, timePeriod]);

  // 스크롤 동기화
  useEffect(() => {
    if ((timePeriod === '30d' || timePeriod === '7d') && scrollContainerRef.current) {
      const { start, scaleRange, latestTs } = timeConfig;
      const ratio = (latestTs - start) / scaleRange;
      const containerWidth = scrollContainerRef.current.scrollWidth;
      
      // '첫 시작점 위치로 잡아줘' -> 해당 날짜가 스크롤 뷰의 맨 왼쪽에 오도록 설정
      const targetScroll = ratio * containerWidth;
      
      // 즉시 스크롤 혹은 자연스러운 이동
      scrollContainerRef.current.scrollTo({ left: Math.max(0, targetScroll), behavior: 'smooth' });
    } else if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
    }
  }, [timePeriod, timeConfig]);

  const getYPos = (level: number) => {
    const padding = 15;
    const height = 70;
    return padding + (height - ((Math.min(Math.max(Number(level || 0), 1), 10) - 1) / 9) * height);
  };

  const getXPos = (ts: number) => {
    const ratio = (ts - timeConfig.start) / timeConfig.scaleRange;
    return Math.min(Math.max(ratio, 0), 1) * 100;
  };

  const groupedHistory = useMemo(() => {
    const groups: Record<string, EnergyRecord[]> = {};
    [...history].sort((a, b) => b.timestamp - a.timestamp).forEach(record => {
      const dateKey = record.date.split('T')[0];
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(record);
    });
    return Object.entries(groups).sort((a, b) => b[0].localeCompare(a[0]));
  }, [history]);

  const getLevelColor = (level: number) => {
    const colors = ["text-rose-500", "text-rose-400", "text-orange-400", "text-orange-500", "text-amber-500", "text-emerald-500", "text-teal-500", "text-sky-500", "text-indigo-500", "text-growth-blue"];
    return colors[Math.floor(level) - 1] || "text-slate-400";
  };

  return (
    <div className="flex-1 flex flex-col bg-[#E9EEF6] animate-in fade-in duration-500 overflow-hidden">
      <div className="flex-1 overflow-y-auto p-6 space-y-8 pb-32 pt-10">
        <div className="bento-card p-8 bg-white shadow-premium rounded-[2.5rem] border border-slate-100 space-y-8 overflow-visible">
          <div className="flex justify-between items-center relative">
            <div className="flex items-center gap-3">
              <TrendingUp size={16} className="text-growth-blue" />
              <h3 className="text-sm font-bold text-slate-900 serif">{lang === 'ko' ? '에너지 흐름' : 'Energy Flow'}</h3>
            </div>
            
            <div className="relative">
              <button
                onClick={() => setIsPeriodOpen(!isPeriodOpen)}
                className="flex items-center gap-1 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-xl text-[9px] font-bold text-growth-blue transition-all active:scale-95"
              >
                {getLabel(timePeriod)}
                <ChevronRight size={10} className={`transition-transform duration-200 ${isPeriodOpen ? 'rotate-90' : ''}`} />
              </button>
              
              {isPeriodOpen && (
                <div className="absolute right-0 top-full mt-2 bg-white border border-slate-100 rounded-xl shadow-premium z-[60] overflow-hidden animate-in fade-in zoom-in-95 duration-200 min-w-[70px]">
                  {(['1d', '7d', '30d', '90d', '180d', '365d'] as const).map(p => (
                    <button
                      key={p}
                      onClick={() => { setTimePeriod(p); setIsPeriodOpen(false); }}
                      className={`w-full px-4 py-2 text-[9px] font-bold text-left transition-colors ${timePeriod === p ? 'bg-slate-50 text-growth-blue' : 'text-slate-400 hover:bg-slate-50'}`}
                    >
                      {getLabel(p)}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <div className="flex flex-col">
            <div className="h-48 flex gap-4">
              <div className="flex flex-col justify-between text-[10px] font-bold text-slate-400 py-0.5 h-full w-4 text-right pr-1 shrink-0">
                {[10, 5, 1].map(v => <span key={v}>{v}</span>)}
              </div>
              
              <div 
                ref={scrollContainerRef}
                className="flex-1 relative h-full overflow-x-auto overflow-y-hidden scrollbar-hide no-scrollbar"
              >
                <div 
                  className="h-full relative" 
                  style={{ width: (timePeriod === '30d' || timePeriod === '7d') ? `${chartInternalWidth}px` : '100%' }}
                >
                  <svg className="absolute inset-0 w-full h-full overflow-visible block" viewBox="0 0 100 100" preserveAspectRatio="none">
                    {[1, 5, 10].map(val => {
                      const y = 15 + (85 - 15) * (1 - (val - 1) / 9);
                      return (
                        <line key={val} x1="0" y1={y} x2="100" y2={y} stroke="#3B59FF" strokeOpacity="0.08" strokeWidth="0.5" strokeDasharray="1 1" />
                      );
                    })}

                    {chartData.map((d, i) => {
                      const x = getXPos(d.timestamp);
                      const yOpen = getYPos(d.open);
                      const yClose = getYPos(d.close);
                      const yHigh = getYPos(d.high);
                      const yLow = getYPos(d.low);
                      const isUp = d.close >= d.open;
                      const color = isUp ? "#10B981" : "#F43F5E";
                      const candleWidth = (timePeriod === '30d' || timePeriod === '7d') ? 0.3 : 2.4;

                      return (
                        <g key={i}>
                          <line x1={x} y1={yHigh} x2={x} y2={yLow} stroke={color} strokeWidth={(timePeriod === '30d' || timePeriod === '7d') ? "0.1" : "0.6"} />
                          <rect 
                            x={x - candleWidth / 2} 
                            y={Math.min(yOpen, yClose)} 
                            width={candleWidth} 
                            height={Math.max(Math.abs(yClose - yOpen), 1)} 
                            fill={color}
                            rx="0.1"
                          />
                        </g>
                      );
                    })}
                  </svg>
                  
                  {/* X축 레이블 */}
                  <div className="absolute bottom-[-24px] left-0 right-0 h-6">
                    {xAxisLabels.map((label, i) => (
                      <span 
                        key={i} 
                        className="absolute top-0 text-[10px] font-bold text-slate-500 uppercase tracking-tighter -translate-x-1/2 whitespace-nowrap"
                        style={{ left: `${label.pos}%` }}
                      >
                        {label.text}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="pt-6 text-center">
            <p className="text-[10px] text-slate-300 font-medium italic">
              {(timePeriod === '30d' || timePeriod === '7d') ? (lang === 'ko' ? '← 좌우로 스크롤하여 기록을 확인하세요 →' : '← Scroll to explore the flow →') : ''}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between px-2 pt-8">
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-slate-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
              {history.length} {lang === 'ko' ? '기록됨' : 'Sessions'}
            </span>
          </div>
        </div>
        
        {groupedHistory.length > 0 ? (
          <div className="space-y-4">
            {groupedHistory.map(([date, records]) => {
              const isExpanded = expandedDates.includes(date);
              const avgLevel = Math.round(records.reduce((sum, r) => sum + r.level, 0) / records.length);
              return (
                <div key={date} className="bg-white rounded-[2.2rem] overflow-hidden border border-slate-100 shadow-sm transition-all duration-300">
                  <button 
                    onClick={() => toggleDate(date)}
                    className="w-full p-6 flex items-center justify-between hover:bg-slate-50 transition-colors group text-left"
                  >
                    <div className="flex items-center gap-5">
                      <div className="flex flex-col items-center min-w-[40px]">
                        <span className="text-[10px] font-bold text-slate-300 uppercase tracking-tighter leading-none mb-1">
                          {date.split('-')[1]}.{date.split('-')[2]}
                        </span>
                        <div className="flex -space-x-1">
                          {records.slice(0, 3).map((r, idx) => (
                            <div key={idx} className={`w-3 h-3 rounded-full border border-white shadow-sm bg-current ${getLevelColor(r.level)}`} />
                          ))}
                        </div>
                      </div>
                      <div className="text-left">
                        <h4 className="text-[15px] font-bold text-slate-900 serif">
                          {records.length}{lang === 'ko' ? '건의 내면 성찰' : ' Session(s)'}
                        </h4>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                          {lang === 'ko' ? '평균 단계' : 'Avg Level'} {avgLevel}
                        </p>
                      </div>
                    </div>
                    <div className={`transition-transform duration-300 ${isExpanded ? 'rotate-180 text-growth-blue' : 'text-slate-200'}`}>
                      <ChevronDown size={20} />
                    </div>
                  </button>
                  {isExpanded && (
                    <div className="px-6 pb-6 pt-2 space-y-3 animate-in slide-in-from-top-2 duration-300">
                      {records.map((record, rIdx) => (
                        <div key={rIdx} className="p-5 rounded-[1.8rem] bg-slate-50 border border-slate-100 space-y-4">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                              <span className={`text-xl font-black ${getLevelColor(record.level)}`}>{record.level}</span>
                              <span className="text-sm font-bold text-slate-700 serif">{record.status_label}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 opacity-30">
                            <MessageSquare size={12} className="text-slate-900" />
                            <span className="text-[9px] font-bold uppercase tracking-widest text-slate-900">{lang === 'ko' ? '성찰 요약' : 'Summary'}</span>
                          </div>
                          <p className="text-[13px] text-slate-500 leading-relaxed font-medium serif italic">"{record.summary}"</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-24 opacity-10">
            <History size={64} className="mx-auto mb-4 text-slate-900" />
            <p className="text-xs font-black uppercase tracking-[0.5em] text-slate-900">{lang === 'ko' ? '기록된 내면의 울림이 없습니다' : 'No echoes yet'}</p>
          </div>
        )}
      </div>
    </div>
  );
};