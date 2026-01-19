
import React from 'react';
import { NewApiResponse, ConsciousnessMode, AppLanguage, MissionItem } from '../types';
import { 
  Quote, Activity, Sun, Flower2, Lock, Compass, MapPin,
  CheckCircle2, Crown, ChevronRight, Sparkles, Circle, Info
} from 'lucide-react';
import { UI_STRINGS } from '../constants';

const LatinCross = ({ size, className }: { size: number, className: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.2" 
    strokeLinejoin="miter" 
    className={className}
  >
    <path d="M10 2H14V8H20V12H14V22H10V12H4V8H10V2Z" />
  </svg>
);

interface PrescriptionViewProps {
  data: NewApiResponse;
  mode: ConsciousnessMode;
  lang: AppLanguage;
  isLocked?: boolean;
  onUnlock?: () => void;
  activeMissions: MissionItem[];
  onToggleMission: (mission: MissionItem) => void;
}

export const PrescriptionView: React.FC<PrescriptionViewProps> = ({ 
  data, 
  mode, 
  lang, 
  isLocked = false,
  onUnlock,
  activeMissions,
  onToggleMission
}) => {
  const { user_analysis, wisdom_bridge } = data;
  const t = UI_STRINGS[lang] || UI_STRINGS.en;
  const [isExpanded, setIsExpanded] = React.useState(false); 

  const levelNames = ["", "파괴", "무력", "불안", "저항", "용기", "중용", "신뢰", "수용", "사랑", "현존"];

  const levelNum = parseInt(user_analysis.level.replace(/[^0-9]/g, '')) || 0;
  
  const cleanText = (text: string) => {
    return text
      .replace(/\([A-Za-z\s]+\)/g, '')
      .replace(/\(개역한글\)/g, '')
      .replace(/\(\d+\)/g, '') // 괄호 안의 숫자(의식 지수) 제거
      .replace(/[A-Za-z]/g, '')
      .trim();
  };

  const formatSource = (source: string, masterName: string) => {
    let clean = cleanText(source);
    const mName = cleanText(masterName);
    if (clean.startsWith(mName)) {
      clean = clean.replace(mName, '').trim();
    }
    return `— ${clean}`;
  };

  const standardName = levelNum > 0 ? `${levelNum}단계 ${levelNames[levelNum]}` : cleanText(user_analysis.level);
  
  const extractSubLabel = (fullText: string) => {
    const match = fullText.match(/\(([^)]+)\)/);
    if (match) {
      const content = cleanText(match[1]);
      return content ? `(${content})` : '';
    }
    return '';
  };

  const subLabel = extractSubLabel(user_analysis.level);

  const getLevelColor = (luxStr: string | number) => {
    const lux = typeof luxStr === 'string' ? parseInt(luxStr.replace(/[^0-9]/g, '')) : luxStr;
    if (lux >= 500) return 'text-growth-blue';
    if (lux >= 200) return 'text-amber-600';
    return 'text-rose-500';
  };

  const levelColor = getLevelColor(user_analysis.lux);

  const formatMasterTitle = (name: string) => {
    const clean = cleanText(name).replace('붓다', '부처');
    if (!clean) return "성자의 말씀";
    return `${clean}의 말씀`;
  };

  const MasterIcon = (mName?: string) => {
    const master = (mName || '').toLowerCase();
    if (master.includes('예수') || master.includes('jesus')) return <LatinCross size={24} className="text-amber-500" />;
    if (master.includes('부처') || master.includes('buddha')) return <Flower2 size={24} className="text-emerald-500 animate-tilt" />;
    return <Sun size={24} className="text-indigo-500 animate-tilt" />;
  };

  return (
    <div className="w-full space-y-12 animate-in py-8 relative group">
      {isLocked && (
        <div className="absolute inset-0 z-[60] flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-1000 pointer-events-none">
           <div className="absolute inset-0 bg-white/95 backdrop-blur-2xl rounded-[3.5rem]" />
           <div className="relative z-10 space-y-8 pointer-events-auto">
              <div className="w-16 h-16 rounded-[1.8rem] bg-white flex items-center justify-center mx-auto border border-slate-100 shadow-premium">
                 <Lock size={28} className="text-growth-blue opacity-40 animate-tilt" />
              </div>
              <div className="space-y-2">
                <p className="text-meta">{t.lockedMessage}</p>
                <h3 className="text-lg font-bold text-slate-900 serif tracking-tight">
                  {lang === 'ko' ? '깊은 지혜의 통찰을 마주하기 위해' : 'To face the insights of deep wisdom'}
                </h3>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); onUnlock?.(); }}
                className="px-12 py-4 rounded-full bg-slate-900 text-white text-xs font-bold uppercase tracking-[0.2em] shadow-premium active:scale-95 transition-all"
              >
                {t.viewContent}
              </button>
           </div>
        </div>
      )}

      {/* 1. 의식의 심층 분석 섹션 */}
      <div className={`space-y-10 transition-all duration-1000 ${isLocked ? 'opacity-20 blur-xl' : ''}`}>
        <div className="flex items-center justify-between px-4">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center">
              <MapPin size={24} className={`${levelColor} opacity-60 animate-tilt`} />
            </div>
            <div className="flex flex-col">
              <span className="text-meta block mb-1">{t.diagnosis}</span>
              <span className={`text-2xl font-bold serif text-slate-900 tracking-tight leading-none`}>
                {standardName}
              </span>
              {subLabel && (
                <span className="text-sm font-bold text-slate-400 mt-1">
                  {subLabel}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className={`w-12 h-12 rounded-2xl bg-white border border-slate-100 text-slate-400 hover:text-growth-blue transition-all shadow-sm flex items-center justify-center ${isExpanded ? 'rotate-90 text-growth-blue bg-slate-50 border-growth-blue/20' : ''}`}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {isExpanded && (
          <div className="p-9 rounded-[3rem] bg-white border border-slate-50 shadow-sm space-y-8 animate-in slide-in-from-top-4 duration-500">
            <div className="flex items-center gap-3 opacity-30">
              <Activity size={24} className="animate-tilt" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em]">{t.logic}</span>
            </div>
            <p className="text-[15px] text-slate-600 leading-relaxed font-medium serif italic">
              "{user_analysis.reasoning.logic}"
            </p>
          </div>
        )}
      </div>

      {/* 2. 성자의 말씀 섹션 통합 리뉴얼 */}
      <div className={`space-y-6 transition-all duration-1000 ${isLocked ? 'blur-[50px] opacity-10' : ''}`}>
        <div className="bento-card overflow-hidden bg-white/95 border border-slate-100 shadow-premium">
          <div className="px-5 py-10 space-y-12">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-white shadow-inner-soft flex items-center justify-center">
                  {MasterIcon(wisdom_bridge.master)}
                </div>
                <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-slate-400">
                  {formatMasterTitle(wisdom_bridge.master)}
                </span>
              </div>
            </div>
            
            <div className="relative px-1">
              <Quote className="absolute -top-6 -left-4 text-slate-900/5" size={64} />
              <p className="serif text-xl md:text-2xl text-slate-900 leading-relaxed relative z-10 italic font-medium tracking-tight">
                "{wisdom_bridge.scripture_raw}"
              </p>
              <p className="text-[11px] text-slate-400 font-bold serif mt-6 text-right">
                {formatSource(wisdom_bridge.source, wisdom_bridge.master)}
              </p>
            </div>
            
            <div className="px-5 py-8 rounded-[2.5rem] bg-slate-50/80 border border-slate-100 space-y-5">
              <div className="flex items-center gap-2 opacity-40">
                <Sparkles size={16} className="text-slate-900" />
                <span className="text-[9px] font-black uppercase tracking-[0.3em]">지혜의 통찰</span>
              </div>
              <p className="text-[15px] text-slate-600 leading-relaxed font-medium serif italic">
                {wisdom_bridge.master_guidance}
              </p>
            </div>

            {mode === ConsciousnessMode.Unified && wisdom_bridge.supplementary_advice && wisdom_bridge.supplementary_advice.length > 0 && (
              <div className="space-y-6 pt-10 border-t border-slate-50 px-1">
                <div className="flex items-center gap-3 opacity-30 mb-2">
                  <Crown size={14} className="text-slate-400" />
                  <span className="text-[9px] font-black uppercase tracking-[0.3em]">공명하는 지혜들</span>
                </div>
                {wisdom_bridge.supplementary_advice.map((advice, idx) => (
                  <div key={idx} className="px-5 py-7 rounded-[2.2rem] bg-slate-50/40 border border-slate-100/50 shadow-inner-soft space-y-4 hover:bg-white transition-all">
                    <div className="flex items-center gap-3">
                      <div className="scale-75 origin-left opacity-60">
                        {MasterIcon(advice.master)}
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                        {formatMasterTitle(advice.master)}
                      </span>
                    </div>
                    <p className="serif text-[15px] font-bold text-slate-600 leading-relaxed italic">
                      "{advice.advice}"
                    </p>
                    <p className="text-[10px] text-slate-300 font-bold serif text-right">
                      {formatSource(advice.source, advice.master)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. 실천적 처방 (구조화된 MissionItem 대응) */}
      <div className={`space-y-8 px-2 transition-all duration-1000 ${isLocked ? 'blur-2xl opacity-10' : ''}`}>
        <div className="space-y-4 px-2">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-growth-blue/10 flex items-center justify-center text-growth-blue">
              <Compass size={20} />
            </div>
            <h4 className="text-meta">{t.path}</h4>
          </div>
          <div className="px-4 py-2.5 rounded-full bg-growth-blue/[0.03] border border-growth-blue/10 flex items-center gap-2 w-fit">
            <Info size={12} className="text-growth-blue shrink-0" />
            <p className="text-[10px] font-bold text-growth-blue whitespace-nowrap">
              선택한 미션은 메인화면 [미션] 탭에서 상시 확인 가능합니다.
            </p>
          </div>
        </div>
        
        <div className="space-y-4">
          {wisdom_bridge.growth_steps.map((mission, idx) => {
            const isAccepted = activeMissions.some(m => m.title === mission.title);
            return (
              <button 
                key={idx} 
                onClick={() => onToggleMission(mission)}
                className={`w-full text-left group p-6 rounded-[2rem] border transition-all flex items-center gap-5 active:scale-[0.98] min-h-[88px] ${
                  isAccepted 
                  ? 'bg-growth-blue border-growth-blue text-white shadow-xl shadow-growth-blue/20' 
                  : 'bg-white border-slate-100 text-slate-700 shadow-sm hover:border-growth-blue/20'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors shrink-0 ${
                  isAccepted ? 'bg-white/20 text-white' : 'bg-slate-50 text-slate-300 group-hover:text-growth-blue'
                }`}>
                  {isAccepted ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-center py-1">
                  <p className={`text-[15px] font-bold leading-tight ${isAccepted ? 'text-white' : 'text-slate-700'}`}>
                    {cleanText(mission.title)}
                  </p>
                  {isAccepted && (
                    <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest mt-1 animate-in fade-in slide-in-from-left-2">
                      미션 수행 중
                    </p>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
