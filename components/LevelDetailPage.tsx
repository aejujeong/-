
import React, { useState, useMemo } from 'react';
import { EnergyRecord, MissionItem, MissionRecord } from '../types';
import { 
  HelpCircle, X, Activity, Zap, Sparkles, CheckCircle2, 
  ChevronLeft, Target, Timer, Footprints, Eye, MessageSquare, 
  Smile, Frown, Meh, Edit3, Info, History, Calendar, ChevronDown,
  PenLine, Flag, Sparkle
} from 'lucide-react';

// --- 커스텀 기도 아이콘 ---
const PrayingHands = ({ size, className }: { size: number, className: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M12 4c-2.5 0-5 5-5 14h5" />
    <path d="M12 4c2.5 0 5 5 5 14h-5" />
    <path d="M12 4v14" />
    <rect x="3" y="15" width="4" height="6" rx="0.5" />
    <rect x="17" y="15" width="4" height="6" rx="0.5" />
  </svg>
);

interface LevelDetailPageProps {
  currentEnergy: EnergyRecord | null;
  onBack: () => void;
  activeMissions: MissionItem[];
  onToggleMission: (mission: MissionItem) => void;
  onSaveMissionRecord: (record: MissionRecord) => void;
  missionHistory: MissionRecord[];
  detailTab: 'energy' | 'mission';
}

export const LevelDetailPage: React.FC<LevelDetailPageProps> = ({ 
  currentEnergy, 
  onBack, 
  activeMissions, 
  onToggleMission,
  onSaveMissionRecord,
  missionHistory,
  detailTab 
}) => {
  const [showGuide, setShowGuide] = useState<'levels' | 'metrics' | null>(null);
  const [recordMode, setRecordMode] = useState<string | null>(null);
  const [selectedFeeling, setSelectedFeeling] = useState<string>('평온');
  const [note, setNote] = useState<string>('');
  const [expandedHistoryId, setExpandedHistoryId] = useState<string | null>(null);

  const levels = [
    { level: 0, name: "비어있음", color: "text-slate-400", bg: "bg-slate-100", border: "border-slate-200", desc: "에너지가 측정되지 않은 대기 상태" },
    { level: 1, name: "파괴", color: "text-rose-600", bg: "bg-rose-50", border: "border-rose-100", desc: "수치심과 죄의식이 내면을 지배한 상태" },
    { level: 2, name: "무력", color: "text-rose-500", bg: "bg-rose-50", border: "border-rose-100", desc: "무기력과 슬픔으로 에너지가 고갈된 상태" },
    { level: 3, name: "불안", color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-100", desc: "두려움과 욕망으로 내면이 불안한 단계" },
    { level: 4, name: "저항", color: "text-orange-500", bg: "bg-orange-50", border: "border-orange-100", desc: "분노와 자존심으로 세상에 저항하는 단계" },
    { level: 5, name: "용기", color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100", desc: "현실을 직면하고 성장을 선택하는 단계" },
    { level: 6, name: "중용", color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100", desc: "판단을 내려놓고 삶을 관찰하는 상태" },
    { level: 7, name: "신뢰", color: "text-teal-600", bg: "bg-teal-50", border: "border-teal-100", desc: "자발적 의지로 내적 안정을 찾은 상태" },
    { level: 8, name: "수용", color: "text-growth-blue", bg: "bg-blue-50", border: "border-blue-100", desc: "결과를 책임지고 타인을 수용하는 단계" },
    { level: 9, name: "사랑", color: "text-rose-600", bg: "bg-rose-50", border: "border-rose-100", desc: "조건 없는 감사와 기쁨이 샘솟는 상태" },
    { level: 10, name: "현존", color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100", desc: "분별이 사라진 순수 의식으로 현존하는 상태" },
  ];

  const currentLevelInfo = currentEnergy 
    ? levels.find(l => l.level === currentEnergy.level) || levels[1]
    : levels[0];

  const cleanText = (text: string) => {
    return text
      .replace(/\(\d+\)/g, '')
      .trim();
  };

  const energyInfo = useMemo(() => {
    const levelNum = currentEnergy?.level || 0;
    if (levelNum >= 1 && levelNum <= 4) {
      const pct = Math.round(100 - (levelNum - 1) * (99 / 3));
      return { label: "수축", value: `${pct}%`, color: 'text-rose-600', bg: 'bg-rose-50' };
    } else if (levelNum >= 5 && levelNum <= 10) {
      const pct = Math.round(1 + (levelNum - 5) * (99 / 5));
      return { label: "확장", value: `${pct}%`, color: 'text-growth-blue', bg: 'bg-blue-50' };
    }
    return { label: "측정 전", value: "", color: 'text-slate-400', bg: 'bg-slate-50' };
  }, [currentEnergy]);

  const MetricBar = ({ label, value, color }: { label: string, value: number, color: string }) => (
    <div className="space-y-2">
      <div className="flex justify-between items-center px-1">
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{label}</span>
        <span className="text-sm font-bold text-slate-800">{value}%</span>
      </div>
      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
        <div 
          className={`h-full bg-gradient-to-r ${color} transition-all duration-1000 ease-out`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );

  const handleFinishRecord = (mission: MissionItem) => {
    onSaveMissionRecord({
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      title: mission.title,
      feeling: selectedFeeling,
      note: note,
      details: mission
    });
    setRecordMode(null);
    setNote('');
    setSelectedFeeling('평온');
  };

  const toggleHistory = (id: string) => {
    setExpandedHistoryId(prev => prev === id ? null : id);
  };

  const formatTimerLabel = (time: string) => {
    if (!time || time.trim() === '') return '즉시';
    const cleanTime = time.replace('', '').trim();
    if (cleanTime === '0분' || cleanTime === '즉시') return '즉시';
    if (cleanTime.includes('분')) return `${cleanTime}`;
    return cleanTime;
  };

  const getActionIcon = (action: string, title: string) => {
    const text = (action + title).toLowerCase();
    const commonClass = "text-growth-blue shrink-0 opacity-40";
    
    if (text.includes('기록') || text.includes('적기') || text.includes('글쓰기') || text.includes('작성')) {
      return <PenLine size={16} className={commonClass} />;
    }
    if (text.includes('산책') || text.includes('걷기') || text.includes('이동') || text.includes('발자국')) {
      return <Footprints size={16} className={commonClass} />;
    }
    if (text.includes('기도') || text.includes('명상') || text.includes('호흡') || text.includes('비우기') || text.includes('감사')) {
      return <PrayingHands size={16} className={commonClass} />;
    }
    return <Activity size={16} className={commonClass} />;
  };

  return (
    <div className="flex-1 flex flex-col bg-[#E9EEF6] animate-in fade-in duration-500 overflow-hidden relative">
      <header className="flex-none px-8 pt-10 pb-4 flex items-center justify-between z-20">
        <button onClick={onBack} className="p-2 -ml-2 text-slate-400 hover:text-slate-900 transition-colors">
          <ChevronLeft size={24} />
        </button>
        <span className="text-meta text-slate-400">
          {detailTab === 'mission' ? '나의 영적 도약 미션' : '의식의 상세 분석'}
        </span>
        <div className="w-10" />
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-10 pb-32">
        {detailTab === 'mission' && (
          <div className="space-y-12 animate-in">
            {activeMissions.length > 0 ? (
              activeMissions.map((mission, idx) => (
                <div key={idx} className="bg-white rounded-[3rem] shadow-premium border border-slate-100 overflow-hidden animate-in slide-in-from-bottom-4" style={{ animationDelay: `${idx * 150}ms` }}>
                  
                  {/* 미션 상단 타이틀 섹션 */}
                  <div className="bg-slate-900 px-8 py-10 relative overflow-hidden">
                    <Sparkle size={120} className="absolute -right-8 -top-8 text-white/5 animate-spin-slow" />
                    <div className="relative z-10 space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="px-3 py-1 bg-growth-blue rounded-full">
                          <span className="text-[10px] font-black text-white uppercase tracking-widest">성장 미션 {idx + 1}</span>
                        </div>
                      </div>
                      <h3 className="text-2xl font-bold serif text-white tracking-tight leading-tight">
                        {cleanText(mission.title)}
                      </h3>
                    </div>
                  </div>

                  <div className="p-8 space-y-10">
                    {/* 1. 미션 설명 박스 */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 px-1">
                        <Flag size={14} className="text-growth-blue" />
                        <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">미션 설명</span>
                      </div>
                      <div className="p-7 rounded-[2rem] bg-slate-50 border border-slate-100 space-y-4">
                        <p className="text-[15px] text-slate-800 font-bold leading-relaxed">
                          {cleanText(mission.description)}
                        </p>
                        <div className="pt-4 border-t border-slate-200/50 flex gap-3">
                          <Info size={14} className="text-growth-blue shrink-0 mt-0.5" />
                          <p className="text-[12px] text-slate-500 font-medium leading-relaxed italic">
                            {mission.key_guide || '관찰자 자아를 회복하여 에고의 패턴에서 벗어나세요.'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* 2. 수행 방법 박스 */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 px-1">
                        <Target size={14} className="text-growth-blue" />
                        <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">수행 방법</span>
                      </div>
                      <div className="grid grid-cols-1 gap-3">
                        <div className="flex items-center gap-5 p-5 bg-white border border-slate-100 rounded-2xl shadow-sm">
                          <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center">
                            <Timer size={18} className="text-growth-blue/40" />
                          </div>
                          <span className="text-[14px] font-bold text-slate-700">{formatTimerLabel(mission.method.timer)} </span>
                        </div>
                        <div className="flex items-center gap-5 p-5 bg-white border border-slate-100 rounded-2xl shadow-sm">
                          <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center">
                            {getActionIcon(mission.method.action, mission.title)}
                          </div>
                          <span className="text-[14px] font-bold text-slate-700">{mission.method.action} 활동</span>
                        </div>
                        <div className="flex items-center gap-5 p-5 bg-white border border-slate-100 rounded-2xl shadow-sm">
                          <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center">
                            <Eye size={18} className="text-growth-blue/40" />
                          </div>
                          <span className="text-[14px] font-bold text-slate-700">{mission.method.mindset}</span>
                        </div>
                      </div>
                    </div>

                    {/* 3. 왜 이 미션인가? 박스 */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 px-1">
                        <Sparkles size={14} className="text-indigo-400" />
                        <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">왜 이 미션인가?</span>
                      </div>
                      <div className="p-7 rounded-[2rem] bg-indigo-50/30 border border-indigo-100/20 shadow-inner-soft">
                        <p className="text-[14px] text-indigo-600/80 font-medium serif leading-relaxed italic">
                          "{cleanText(mission.insight)}"
                        </p>
                      </div>
                    </div>

                    {/* 기록 및 완료 버튼 */}
                    <div className="pt-6">
                      {recordMode === mission.title ? (
                        <div className="space-y-4 animate-in zoom-in-95">
                          <div className="flex justify-around py-4 bg-slate-50 rounded-3xl border border-slate-100">
                            {['힘듦', '보통', '평온'].map((feeling) => (
                              <button key={feeling} onClick={() => setSelectedFeeling(feeling)} className={`flex flex-col items-center gap-2 group transition-all ${selectedFeeling === feeling ? 'scale-110' : 'opacity-40'}`}>
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${selectedFeeling === feeling ? 'bg-slate-900 text-white shadow-md' : 'bg-white text-slate-300 border border-slate-200'}`}>
                                  {feeling === '힘듦' && <Frown size={24} />}
                                  {feeling === '보통' && <Meh size={24} />}
                                  {feeling === '평온' && <Smile size={24} />}
                                </div>
                                <span className="text-[10px] font-bold text-slate-500">{feeling}</span>
                              </button>
                            ))}
                          </div>
                          <div className="relative">
                            <Edit3 size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
                            <input type="text" value={note} onChange={(e) => setNote(e.target.value)} placeholder="실천 후 느낀 점을 짧게 기록해보세요" className="w-full h-14 bg-white border border-slate-200 rounded-2xl px-14 text-sm focus:outline-none focus:ring-2 focus:ring-growth-blue/10" />
                          </div>
                          <button onClick={() => handleFinishRecord(mission)} className="w-full h-16 bg-slate-900 text-white rounded-full text-sm font-bold shadow-lg active:scale-95 transition-all">오늘의 미션 완료하기</button>
                          <button onClick={() => setRecordMode(null)} className="w-full text-center text-[10px] font-bold text-slate-300 uppercase tracking-widest py-2">취소</button>
                        </div>
                      ) : (
                        <button onClick={() => setRecordMode(mission.title)} className="w-full h-16 rounded-full border-2 border-slate-100 flex items-center justify-center gap-3 text-slate-400 font-bold text-[13px] hover:border-growth-blue hover:text-growth-blue transition-all active:scale-[0.98]">
                          <CheckCircle2 size={20} /> 실천 완료 기록하기
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white/40 border border-dashed border-slate-300 rounded-[3rem] p-16 text-center space-y-4">
                <Target size={40} className="mx-auto text-slate-200" />
                <p className="text-xs text-slate-400 font-bold serif italic leading-relaxed">
                  수행 중인 처방이 없습니다.<br/>성자들과 대화하여 당신에게 맞는<br/>의식 미션을 받아보세요.
                </p>
              </div>
            )}

            {/* 완료 히스토리 */}
            {missionHistory.length > 0 && (
              <div className="space-y-6 pt-10 border-t border-slate-200/50">
                <div className="flex items-center gap-2 px-1">
                  <History size={14} className="text-slate-400" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">완료된 미션 ({missionHistory.length})</span>
                </div>
                <div className="space-y-4">
                  {missionHistory.map((record) => {
                    const isExpanded = expandedHistoryId === record.id;
                    return (
                      <div key={record.id} className="bg-white/60 rounded-[2rem] overflow-hidden border border-slate-100 shadow-sm transition-all duration-300">
                        <button onClick={() => toggleHistory(record.id)} className="w-full p-6 text-left flex items-center justify-between group">
                          <div className="flex flex-col gap-1">
                            <h4 className="text-[14px] font-bold text-slate-800 serif group-hover:text-growth-blue transition-colors">{cleanText(record.title)}</h4>
                            <div className="flex items-center gap-2">
                               <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">{new Date(record.timestamp).toLocaleDateString()}</span>
                               <div className="w-1 h-1 rounded-full bg-slate-200" />
                               <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest">완료됨</span>
                            </div>
                          </div>
                          <ChevronDown size={18} className={`text-slate-200 transition-transform ${isExpanded ? 'rotate-180 text-growth-blue' : ''}`} />
                        </button>
                        {isExpanded && (
                          <div className="px-6 pb-8 space-y-5 border-t border-slate-50 pt-6 animate-in slide-in-from-top-2">
                            {record.note && (
                              <div className="space-y-2">
                                <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">성찰 기록</span>
                                <p className="text-[13px] text-slate-600 font-medium italic p-4 bg-slate-50/50 rounded-2xl border border-slate-100">"{record.note}"</p>
                              </div>
                            )}
                            {record.details && (
                              <div className="space-y-2">
                                <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">수행한 목표</span>
                                <p className="text-[12px] text-slate-400 leading-relaxed font-medium">{cleanText(record.details.description)}</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 에너지 탭 */}
        {detailTab === 'energy' && (
          <div className="space-y-10 animate-in">
            <section className="space-y-4">
              <div className="flex items-center gap-2 px-1">
                <Zap size={14} className="text-growth-blue opacity-60" />
                <span className="text-meta">현재 에너지 상태</span>
                <button onClick={() => setShowGuide('levels')} className="text-slate-300 hover:text-growth-blue transition-colors">
                  <HelpCircle size={16} />
                </button>
              </div>
              
              <div className="bg-white rounded-[2.5rem] p-9 shadow-premium border border-slate-100 relative overflow-hidden">
                <div className={`absolute -top-6 -right-6 opacity-[0.04] ${currentLevelInfo.color}`}>
                  <Sparkles size={140} className="animate-tilt" />
                </div>
                <div className="relative z-10 space-y-5">
                  <div className="flex items-baseline gap-3">
                    <h3 className={`text-4xl font-bold serif ${currentLevelInfo.color} tracking-tighter`}>
                      {currentLevelInfo.name}
                    </h3>
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">{currentLevelInfo.level}단계</span>
                  </div>
                  <p className="text-base text-slate-700 leading-relaxed font-medium serif italic border-t border-slate-50 pt-5">
                    "{currentEnergy?.summary || "아직 측정된 데이터가 없습니다. 대화를 시작하여 분석을 받아보세요."}"
                  </p>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-2 px-1">
                <Activity size={14} className="text-indigo-500 opacity-60" />
                <span className="text-meta">단계 판정 근거</span>
                <button onClick={() => setShowGuide('metrics')} className="text-slate-300 hover:text-growth-blue transition-colors">
                  <HelpCircle size={16} />
                </button>
              </div>
              
              <div className="bg-white rounded-[2.5rem] p-9 shadow-premium border border-slate-100 space-y-10">
                <div className="space-y-8">
                  <MetricBar label="감정 몰입도" value={currentEnergy?.metrics?.emotion_alignment || 0} color="from-rose-500 to-rose-400" />
                  <MetricBar label="회복 탄력성" value={currentEnergy?.metrics?.action_consistency || 0} color="from-blue-600 to-blue-400" />
                  <MetricBar label="자기 인지력" value={currentEnergy?.metrics?.lux_clarity || 0} color="from-indigo-600 to-indigo-400" />
                </div>
                
                <div className="pt-8 border-t border-slate-50">
                  <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100 flex justify-between items-center">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">에너지 방향성</span>
                      <span className={`text-xl font-bold serif ${energyInfo.color}`}>
                        {energyInfo.label}
                      </span>
                    </div>
                    {energyInfo.value && (
                      <div className="flex flex-col items-end">
                        <span className={`text-3xl font-black ${energyInfo.color}`}>
                          {energyInfo.value}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}
      </div>

      {showGuide && (
        <div className="absolute inset-0 z-[100] flex items-end animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm" onClick={() => setShowGuide(null)} />
          <div className="relative w-full h-[85%] bg-white rounded-t-[3rem] shadow-2xl flex flex-col overflow-hidden">
            <div className="p-8 flex items-center justify-between border-b border-slate-50">
              <h2 className="text-2xl font-bold serif text-slate-900">
                {showGuide === 'levels' ? '에너지 단계 가이드' : '의식 지표 가이드'}
              </h2>
              <button onClick={() => setShowGuide(null)} className="p-2 rounded-full bg-slate-100 text-slate-400"><X size={24} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-8 space-y-6 pb-20">
              {showGuide === 'levels' ? (
                <div className="space-y-0 px-2">
                  {levels.map((l, idx) => (
                    <div key={l.level} className="relative pl-12 pb-12 last:pb-0">
                      {idx !== levels.length - 1 && (
                        <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-slate-100/80" />
                      )}
                      <div className={`absolute left-0 top-0 w-9 h-9 rounded-2xl ${l.bg} border-4 border-white shadow-sm flex items-center justify-center z-10`}>
                        <span className={`text-xs font-black ${l.color}`}>{l.level}</span>
                      </div>
                      <div className="space-y-1.5 pt-1">
                        <h4 className={`text-lg font-bold serif ${l.color} leading-none`}>
                          {l.name}
                        </h4>
                        <p className="text-[13px] text-slate-500 leading-relaxed font-medium">
                          {l.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="p-6 rounded-[2rem] bg-slate-50 border border-slate-100">
                    <h4 className="text-lg font-bold text-slate-900 mb-2">감정 몰입도</h4>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      사용자의 현재 감정이 특정 의식 수준에 얼마나 깊게 머물러 있는지를 나타냅니다. 고착된 감정의 농도를 측정하여 에너지 정렬 상태를 분석합니다.
                    </p>
                  </div>
                  <div className="p-6 rounded-[2rem] bg-slate-50 border border-slate-100">
                    <h4 className="text-lg font-bold text-slate-900 mb-2">회복 탄력성</h4>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      내면의 충돌이나 부정적인 에너지 상태로부터 평온한 중용의 상태로 되돌아올 수 있는 영적인 유연성과 회복 속도를 의미합니다.
                    </p>
                  </div>
                  <div className="p-6 rounded-[2rem] bg-slate-50 border border-slate-100">
                    <h4 className="text-lg font-bold text-slate-900 mb-2">자기 인지력</h4>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      에고의 반응을 객관적으로 관찰할 수 있는 명료함의 정도입니다. 관찰자 자아로서 자신의 상태를 얼마나 선명하게 인지하고 있는지를 측정합니다.
                    </p>
                  </div>
                  <div className="p-6 rounded-[2rem] bg-slate-50 border border-slate-100">
                    <h4 className="text-lg font-bold text-slate-900 mb-2">에너지 방향성</h4>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      에너지가 생명력을 향해 뻗어나가는 '확장(Power)' 상태인지, 아니면 두려움과 결핍에 의해 내면으로 오그라드는 '수축(Force)' 상태인지를 판별합니다.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
