
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  Send, MessageCircle, Menu, X, Archive, LayoutDashboard, Lock, Zap, Sparkles, ChevronRight, ChevronLeft, User, Calendar, Settings, ShieldCheck, Trash2, Mail, Key, Info as InfoIcon
} from 'lucide-react';
import { NewApiResponse, ChatMessage, ConsciousnessMode, AppView, EnergyRecord, AppLanguage, MissionItem, MissionRecord } from './types';
import { processConsciousness } from './geminiService';
import { PrescriptionView } from './components/PrescriptionView';
import { EnergyDashboard } from './components/EnergyDashboard';
import { WisdomArchive } from './components/WisdomArchive';
import { LevelDetailPage } from './components/LevelDetailPage';
import { HistoryDetailPage } from './components/HistoryDetailPage';
import { InsightView } from './components/InsightView';
import { MeditationView } from './components/MeditationView';
import { LibraryView } from './components/LibraryView';
import { MODE_CONFIG, UI_STRINGS } from './constants';
import { wisdomDb } from './wisdomDb';

// --- 소셜 로고 아이콘 ---
const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

const KakaoIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24">
    <path fill="#3A1D1D" d="M12 3C7.03 3 3 6.12 3 10c0 2.51 1.68 4.71 4.21 5.92-.17.6-.62 2.18-.71 2.5-.1.34.11.34.23.26.09-.06 1.48-.99 2.08-1.4l.5-.34c.58.04 1.17.06 1.77.06 4.97 0 9-3.12 9-7s-4.03-7-9-7z"/>
  </svg>
);

const AppleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.05 20.28c-.98.95-2.05 1.78-3.19 1.76-1.07-.02-1.48-.63-2.73-.63-1.25 0-1.71.62-2.71.65-1.09.02-2.31-.92-3.3-2.36-2.03-2.93-2.6-7.36-.61-10.3 1-1.47 2.52-2.4 4.14-2.43 1.25-.02 2.43.83 3.2.83.76 0 2.17-.98 3.65-.83 1.24.05 2.38.67 3.09 1.57-2.58 1.53-2.16 5.16.51 6.37-.87 2.21-2.26 4.41-3.05 5.37zm-3.01-15.65c-.71.86-1.84 1.44-2.9 1.36-.14-1.13.33-2.26 1.05-3.09.73-.83 1.95-1.46 2.94-1.38.16 1.15-.38 2.25-1.09 3.11z"/>
  </svg>
);

// --- '인간다움' 시그니처 아이콘 셋 ---

export const AmbientLatinCross = ({ size, className, style }: { size: number, className: string, style?: React.CSSProperties }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    className={`${className} animate-tilt-cross`} 
    style={{ ...style, transform: 'rotate(10deg)', transformOrigin: 'center bottom' }}
  >
    <path d="M10 2H14V8H20V12H14V22H10V12H4V8H10V2Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="miter" />
  </svg>
);

export const AmbientLotus = ({ size, className, style }: { size: number, className: string, style?: React.CSSProperties }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={`${className} animate-tilt`} style={{ ...style, transform: 'rotate(20deg)', transformOrigin: 'center bottom' }}
  >
    <path d="M12 22C12 22 16.5 18 16.5 12.5C16.5 9.5 14.5 7.5 12 7.5C9.5 7.5 7.5 9.5 7.5 12.5C7.5 18 12 22 12 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M12 22C9.5 21 3.5 17.5 3.5 12.5C3.5 9.5 5.5 8.5 8 10C10.5 11.5 11.5 17.5 12 22" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M12 22C14.5 21 20.5 17.5 20.5 12.5C20.5 9.5 18.5 8.5 16 10C13.5 11.5 12.5 17.5 12 22" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

export const AmbientEnergy = ({ size, className, style }: { size: number, className: string, style?: React.CSSProperties }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={`${className} animate-tilt`} style={style}>
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1" strokeDasharray="3 6" opacity="0.3" />
    <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="0.8" opacity="0.2" />
  </svg>
);

export const AmbientSparkles = ({ size, className, style }: { size: number, className: string, style?: React.CSSProperties }) => (
  <Sparkles 
    size={size} 
    className={`${className} animate-tilt`} 
    style={style} 
    strokeWidth={2}
  />
);

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('home');
  const [showArchive, setShowArchive] = useState(false);
  const [archiveCategory, setArchiveCategory] = useState<'bible' | 'buddha' | 'sage'>('bible');
  const [messagesByMode, setMessagesByMode] = useState<Record<ConsciousnessMode, ChatMessage[]>>({
    [ConsciousnessMode.Jesus]: [], [ConsciousnessMode.Buddha]: [], [ConsciousnessMode.Sage]: [], [ConsciousnessMode.Unified]: [],
  });
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMode, setSelectedMode] = useState<ConsciousnessMode>(ConsciousnessMode.Unified);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showSubscription, setShowSubscription] = useState(false);
  
  // 글로벌 미션 상태
  const [activeMissions, setActiveMissions] = useState<MissionItem[]>([]);
  const [missionHistory, setMissionHistory] = useState<MissionRecord[]>([]);
  const [levelDetailTab, setLevelDetailTab] = useState<'energy' | 'mission'>('energy');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Setup Steps: 'platform' -> 'auth' -> 'profile'
  const [showSetup, setShowSetup] = useState(false);
  const [setupStep, setSetupStep] = useState<'platform' | 'auth' | 'profile'>('platform');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('');
  const [loginId, setLoginId] = useState('');
  const [loginPw, setLoginPw] = useState('');

  const [userName, setUserName] = useState('');
  const [userBirth, setUserBirth] = useState('');
  const [energyHistory, setEnergyHistory] = useState<EnergyRecord[]>([]);
  const [currentEnergy, setCurrentEnergy] = useState<EnergyRecord | null>(null);
  const [lang, setLang] = useState<AppLanguage>('ko');
  const [allUsers, setAllUsers] = useState<{id: string, name: string, birth: string}[]>([]);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const t = UI_STRINGS[lang as keyof typeof UI_STRINGS] || UI_STRINGS.en;
  const messages = useMemo(() => messagesByMode[selectedMode], [messagesByMode, selectedMode]);
  const isLocked = useMemo(() => messages.filter(m => m.role === 'user').length >= 5, [messages]);

  const modeStatus = useMemo(() => {
    const lastAssistantMsg = [...messages].reverse().find(m => m.role === 'assistant' && m.data);
    if (lastAssistantMsg?.data) {
      const numericLevel = parseInt(lastAssistantMsg.data.user_analysis.level.replace(/[^0-9]/g, '')) || 0;
      return { level: `${numericLevel}${lang === 'en' ? ' Level' : '단계'}`, lux: lastAssistantMsg.data.user_analysis.lux };
    }
    return currentEnergy ? { level: `${currentEnergy.level}${lang === 'en' ? ' Level' : '단계'}`, lux: currentEnergy.lux_score } : null;
  }, [messages, currentEnergy, lang]);

  useEffect(() => {
    const browserLang = navigator.language.split('-')[0];
    const supported: AppLanguage[] = ['ko', 'ja', 'fr', 'en'];
    const detected = supported.includes(browserLang as AppLanguage) ? (browserLang as AppLanguage) : 'en';
    const savedLang = localStorage.getItem('app_lang') as AppLanguage;
    setLang(savedLang || detected);
    
    const savedName = localStorage.getItem('user_name');
    const savedBirth = localStorage.getItem('user_birth');
    const savedHistory = localStorage.getItem('energy_history');
    const savedAllUsers = localStorage.getItem('registered_users_db');
    const savedMissions = localStorage.getItem('active_missions');
    const savedMissionHistory = localStorage.getItem('mission_history');
    
    if (savedAllUsers) {
      try { setAllUsers(JSON.parse(savedAllUsers)); } catch(e) {}
    }

    if (savedMissions) {
      try { setActiveMissions(JSON.parse(savedMissions)); } catch(e) {}
    }

    if (savedMissionHistory) {
      try { setMissionHistory(JSON.parse(savedMissionHistory)); } catch(e) {}
    }

    if (savedName) {
      setUserName(savedName);
      if (savedBirth) setUserBirth(savedBirth);
    }

    if (savedHistory) {
      try {
        const parsed: EnergyRecord[] = JSON.parse(savedHistory);
        setEnergyHistory(parsed);
        if (parsed.length > 0) setCurrentEnergy(parsed[parsed.length - 1]);
      } catch (e) { console.error(e); }
    }
    wisdomDb.initialize();
  }, []);

  useEffect(() => {
    localStorage.setItem('active_missions', JSON.stringify(activeMissions));
  }, [activeMissions]);

  useEffect(() => {
    localStorage.setItem('mission_history', JSON.stringify(missionHistory));
  }, [missionHistory]);

  // 로그인 체크 헬퍼
  const checkLogin = () => {
    if (!userName) {
      setSetupStep('platform');
      setShowSetup(true);
      return false;
    }
    return true;
  };

  const handleToggleMission = (mission: MissionItem) => {
    if (!checkLogin()) return;
    const isAlreadyIn = activeMissions.some(m => m.title === mission.title);
    
    if (!isAlreadyIn && activeMissions.length >= 3) {
      const msg = lang === 'ko' 
        ? '미션은 최대 3개까지만 가능합니다. 기존 미션을 수행하신 뒤 다시 선택해주십시오.' 
        : 'Max 3 missions allowed. Complete existing ones first.';
      setToastMessage(msg);
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }

    setActiveMissions(prev => 
      isAlreadyIn
        ? prev.filter(m => m.title !== mission.title) 
        : [...prev, mission]
    );
  };

  const handleSaveMissionRecord = (record: MissionRecord) => {
    setMissionHistory(prev => [record, ...prev]);
    setActiveMissions(prev => prev.filter(m => m.title !== record.title));
  };

  const handleStartAuth = (platform: string) => {
    setSelectedPlatform(platform);
    if (platform === 'guest') {
      setLoginId('guest_' + Date.now());
      setSetupStep('profile');
    } else {
      setSetupStep('auth');
    }
  };

  const handleAuthSubmit = () => {
    if (!loginId.trim() || !loginPw.trim()) {
      alert(lang === 'ko' ? '계정 정보와 비밀번호를 모두 입력해주십시오.' : 'Please enter ID and password.');
      return;
    }
    const existingUser = allUsers.find(u => u.id === loginId);
    if (existingUser && existingUser.name) {
      setUserName(existingUser.name);
      setUserBirth(existingUser.birth);
      localStorage.setItem('user_name', existingUser.name);
      localStorage.setItem('user_birth', existingUser.birth);
      setShowSetup(false);
      setView('home');
    } else {
      setSetupStep('profile');
    }
  };

  const handleSetupComplete = () => {
    if (!userName.trim() || !userBirth.trim()) {
      alert(lang === 'ko' ? '이름과 생년월일을 모두 입력해주십시오.' : 'Please enter both name and date of birth.');
      return;
    }
    localStorage.setItem('user_name', userName);
    localStorage.setItem('user_birth', userBirth);
    const newUser = { id: loginId, name: userName, birth: userBirth };
    const updatedAllUsers = [...allUsers.filter(u => u.id !== loginId), newUser];
    setAllUsers(updatedAllUsers);
    localStorage.setItem('registered_users_db', JSON.stringify(updatedAllUsers));
    setShowSetup(false);
  };

  const handleUpdateProfile = () => {
    if (!userName.trim() || !userBirth.trim()) return;
    localStorage.setItem('user_name', userName);
    localStorage.setItem('user_birth', userBirth);
    const updatedAllUsers = [...allUsers.filter(u => u.name !== userName), { id: loginId, name: userName, birth: userBirth }];
    setAllUsers(updatedAllUsers);
    localStorage.setItem('registered_users_db', JSON.stringify(updatedAllUsers));
    alert(lang === 'ko' ? '정보가 성공적으로 수정되었습니다.' : 'Information updated.');
    setView('home');
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading || isLocked) return;
    const text = input.trim();
    const userMessage: ChatMessage = { role: 'user', content: text, timestamp: Date.now() };
    setMessagesByMode(prev => ({ ...prev, [selectedMode]: [...prev[selectedMode], userMessage] }));
    setInput('');
    setIsLoading(true);
    try {
      const response = await processConsciousness([...messages, userMessage].map(m => ({ role: m.role, content: m.content })), selectedMode, lang);
      const ts = Date.now();
      const responseLevel = parseInt(response.user_analysis.level.replace(/[^0-9]/g, '')) || 1;
      const luxVal = response.user_analysis.lux;
      const newRecord: EnergyRecord = { 
        date: new Date(ts).toISOString(), 
        timestamp: ts, 
        level: responseLevel, 
        lux_score: luxVal, 
        status_label: response.user_analysis.level, 
        summary: response.user_analysis.reasoning.logic, 
        metrics: response.metrics 
      };
      setEnergyHistory(prev => {
        const updated = [...prev, newRecord].slice(-30);
        localStorage.setItem('energy_history', JSON.stringify(updated));
        return updated;
      });
      setCurrentEnergy(newRecord);
      setMessagesByMode(prev => ({ ...prev, [selectedMode]: [...prev[selectedMode], { role: 'assistant', content: "", timestamp: ts, data: response } as ChatMessage] }));
    } catch (error) {
      setMessagesByMode(prev => ({ ...prev, [selectedMode]: [...prev[selectedMode], { role: 'assistant', content: lang === 'ko' ? '연결 오류가 발생했습니다.' : 'Connection error occurred.', timestamp: Date.now() } as ChatMessage] }));
    } finally { setIsLoading(false); }
  };

  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' }); }, [messages, isLoading]);

  const renderHeader = (colorClass: string) => (
    <header className={`absolute top-0 left-0 right-0 z-[100] px-6 py-5 flex items-center justify-between pointer-events-none ${colorClass}`}>
      {userName ? (
        <button 
          onClick={() => setView('profile')}
          className="text-current text-xs font-bold pointer-events-auto px-2 py-1 active:opacity-60 transition-all drop-shadow-md"
        >
          {userName} ({currentEnergy?.level || 0}단계)
        </button>
      ) : (
        <button 
          onClick={() => { setSetupStep('platform'); setShowSetup(true); }}
          className="text-current text-xs font-bold pointer-events-auto px-2 py-1 active:opacity-60 transition-all drop-shadow-md"
        >
          로그인
        </button>
      )}
      <button 
        onClick={() => setIsMenuOpen(true)} 
        className="text-current pointer-events-auto p-2 active:opacity-60 transition-all drop-shadow-md"
      >
        <Menu size={20} />
      </button>
    </header>
  );

  const renderSetup = () => {
    return (
      <div className="fixed inset-0 z-[250] flex flex-col bg-cosmic-bg text-slate-900 overflow-y-auto pt-20 pb-12 px-10 items-center animate-in fade-in duration-300">
        <button onClick={() => setShowSetup(false)} className="absolute top-8 right-8 p-2 text-slate-300 hover:text-slate-900 transition-colors">
          <X size={24} />
        </button>
        <div className="w-full space-y-12 max-w-sm">
          <div className="text-center space-y-4">
             <div className="w-20 h-20 rounded-[2.5rem] bg-white border border-slate-200/60 flex items-center justify-center mx-auto shadow-premium group mb-6">
                <div className="relative flex flex-col items-center h-10 justify-center animate-tilt">
                   <div className="w-4 h-4 bg-growth-blue rounded-full mb-1" />
                   <div className="w-8 h-4 bg-growth-blue/40 rounded-t-full" />
                </div>
             </div>
             <h1 className="serif text-3xl font-bold text-slate-900 leading-tight">인간다움</h1>
             <p className="text-sm text-slate-400 font-medium italic">성자들의 지혜로 에고를 해체하고<br/>관찰자 자아를 회복해주십시오.</p>
          </div>

          {setupStep === 'platform' && (
            <div className="space-y-4 pt-4 animate-in fade-in duration-500">
              <button 
                onClick={() => handleStartAuth('kakao')}
                className="w-full h-16 rounded-3xl bg-[#FEE500] text-[#3A1D1D] font-bold text-sm shadow-sm flex items-center justify-center gap-3 active:scale-95 transition-all"
              >
                <KakaoIcon /> 카카오톡으로 시작하기
              </button>
              <button 
                onClick={() => handleStartAuth('google')}
                className="w-full h-16 rounded-3xl bg-white border border-slate-200 text-slate-700 font-bold text-sm shadow-sm flex items-center justify-center gap-3 active:scale-95 transition-all"
              >
                <GoogleIcon /> Google로 시작하기
              </button>
              <button 
                onClick={() => handleStartAuth('apple')}
                className="w-full h-16 rounded-3xl bg-black text-white font-bold text-sm shadow-sm flex items-center justify-center gap-3 active:scale-95 transition-all"
              >
                <AppleIcon /> Apple로 시작하기
              </button>
              <button 
                onClick={() => handleStartAuth('guest')}
                className="w-full h-16 rounded-3xl bg-slate-100 text-slate-500 font-bold text-sm shadow-sm flex items-center justify-center gap-3 active:scale-95 transition-all mt-2"
              >
                <User size={18} /> 가입 없이 이용하기
              </button>
            </div>
          )}

          {setupStep === 'auth' && (
            <div className="space-y-6 animate-in slide-in-from-right-10 duration-500">
              <div className="flex items-center gap-4 mb-2">
                <button onClick={() => setSetupStep('platform')} className="text-slate-400"><ChevronLeft size={24} /></button>
                <h3 className="text-lg font-bold flex items-center gap-2">
                  {selectedPlatform === 'kakao' && <KakaoIcon />}
                  {selectedPlatform === 'google' && <GoogleIcon />}
                  {selectedPlatform === 'apple' && <AppleIcon />}
                  인증하기
                </h3>
              </div>
              <div className="space-y-4">
                <div className="relative">
                  <Mail size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
                  <input 
                    type="email" 
                    value={loginId}
                    onChange={(e) => setLoginId(e.target.value)}
                    placeholder="이메일 또는 아이디를 입력해주십시오"
                    className="w-full h-16 bg-white border border-slate-100 rounded-3xl px-14 text-[15px] focus:outline-none focus:ring-2 focus:ring-growth-blue/10 shadow-inner-soft transition-all"
                  />
                </div>
                <div className="relative">
                  <Key size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
                  <input 
                    type="password" 
                    value={loginPw}
                    onChange={(e) => setLoginPw(e.target.value)}
                    placeholder="비밀번호를 입력해주십시오"
                    className="w-full h-16 bg-white border border-slate-100 rounded-3xl px-14 text-[15px] focus:outline-none focus:ring-2 focus:ring-growth-blue/10 shadow-inner-soft transition-all"
                  />
                </div>
              </div>
              <button 
                onClick={handleAuthSubmit}
                className="w-full h-16 rounded-full bg-slate-900 text-white font-bold shadow-premium active:scale-95 transition-all"
              >
                인증 완료하기
              </button>
            </div>
          )}

          {setupStep === 'profile' && (
            <div className="space-y-8 animate-in slide-in-from-bottom-10 duration-500">
              <div className="text-center space-y-2">
                <h3 className="text-xl font-bold">환영합니다!</h3>
                <p className="text-xs text-slate-400">서비스 이용을 위해 사용자 이름을 설정해주십시오.</p>
              </div>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-meta px-1">이름 설정</label>
                  <div className="relative">
                    <User size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
                    <input 
                      type="text" 
                      value={userName} 
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="예: 관찰자"
                      className="w-full h-16 bg-white border border-slate-100 rounded-3xl px-14 text-[15px] focus:outline-none focus:ring-2 focus:ring-growth-blue/10 shadow-inner-soft transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-meta px-1">생년월일</label>
                  <div className="relative">
                    <Calendar size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
                    <input 
                      type="date" 
                      value={userBirth} 
                      onChange={(e) => setUserBirth(e.target.value)}
                      className="w-full h-16 bg-white border border-slate-100 rounded-3xl px-14 text-[15px] focus:outline-none focus:ring-2 focus:ring-growth-blue/10 shadow-inner-soft transition-all"
                    />
                  </div>
                </div>
              </div>
              <button 
                onClick={handleSetupComplete}
                className="w-full h-18 rounded-[2.2rem] bg-slate-900 text-white font-bold text-base shadow-premium active:scale-95 transition-all flex items-center justify-center gap-3"
              >
                설정 완료 및 대화 시작하기 <ChevronRight size={20} />
              </button>
            </div>
          )}

          <p className="text-[10px] text-slate-300 text-center uppercase tracking-[0.2em] pt-8">
            계속 진행함으로써 서비스 이용약관 및 <br/>개인정보 처리방침에 동의하시게 됩니다.
          </p>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (showArchive) return <WisdomArchive category={archiveCategory} onReadFull={() => {}} onStartChat={(m) => { setSelectedMode(m); setView('chat'); setShowArchive(false); }} />;
    switch(view) {
      case 'level-detail': return <LevelDetailPage currentEnergy={currentEnergy} onBack={() => setView('home')} activeMissions={activeMissions} onToggleMission={handleToggleMission} onSaveMissionRecord={handleSaveMissionRecord} missionHistory={missionHistory} detailTab={levelDetailTab} />;
      case 'history-detail': return <HistoryDetailPage history={energyHistory} onBack={() => setView('home')} />;
      case 'insight': return <InsightView onBack={() => setView('home')} />;
      case 'meditation': return <MeditationView onBack={() => setView('home')} />;
      case 'library': return <LibraryView onBack={() => setView('home')} onSelectCategory={(cat) => { setArchiveCategory(cat); setShowArchive(true); }} />;
      case 'profile':
        return (
          <div className="flex-1 p-8 pt-20 space-y-10 animate-in overflow-y-auto">
            <div className="flex items-center gap-4">
              <button onClick={() => setView('home')} className="p-2 -ml-2 text-slate-400"><ChevronLeft size={24} /></button>
              <h2 className="serif text-2xl font-bold">개인정보 수정</h2>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-meta px-1">이름</label>
                <div className="relative">
                  <User size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
                  <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} className="w-full h-16 bg-white border border-slate-100 rounded-3xl px-14 text-[15px] focus:outline-none" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-meta px-1">생년월일</label>
                <div className="relative">
                  <Calendar size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
                  <input type="date" value={userBirth} onChange={(e) => setUserBirth(e.target.value)} className="w-full h-16 bg-white border border-slate-100 rounded-3xl px-14 text-[15px] focus:outline-none" />
                </div>
              </div>
              <button onClick={handleUpdateProfile} className="w-full h-18 rounded-[2rem] bg-slate-900 text-white font-bold text-base shadow-premium">수정 완료하기</button>
            </div>
          </div>
        );
      case 'admin':
        return (
          <div className="flex-1 p-8 pt-20 space-y-10 animate-in overflow-y-auto">
            <div className="flex items-center gap-4">
              <button onClick={() => setView('home')} className="p-2 -ml-2 text-slate-400"><ChevronLeft size={24} /></button>
              <h2 className="serif text-2xl font-bold">관리자 대시보드</h2>
            </div>
            <div className="space-y-4">
              <p className="text-meta">등록된 사용자 정보 ({allUsers.length})</p>
              <div className="space-y-3">
                {allUsers.map((u, i) => (
                  <div key={i} className="p-5 rounded-3xl bg-white border border-slate-100 shadow-sm flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900">{u.name}</h4>
                      <p className="text-xs text-slate-400 font-medium">생년월일: {u.birth}</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-200">
                      <User size={14} />
                    </div>
                  </div>
                ))}
                {allUsers.length === 0 && <p className="text-center text-slate-300 py-10">데이터가 존재하지 않습니다.</p>}
              </div>
            </div>
          </div>
        );
      case 'home': return (
        <EnergyDashboard 
          currentEnergy={currentEnergy} 
          history={energyHistory} 
          lang={lang} 
          onStartChat={() => checkLogin() && setView('chat')} 
          onViewLevel={() => checkLogin() && (setLevelDetailTab('energy'), setView('level-detail'))} 
          onViewMission={() => checkLogin() && (setLevelDetailTab('mission'), setView('level-detail'))}
          onViewHistory={() => checkLogin() && setView('history-detail')} 
          onOpenInsight={() => checkLogin() && setView('insight')}
          onViewMeditation={() => checkLogin() && setView('meditation')}
          onViewLibrary={() => checkLogin() && setView('library')}
          header={renderHeader('text-white')}
        />
      );
      case 'chat':
        return (
          <div className="flex-1 flex flex-col relative h-full overflow-hidden">
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0">
               {selectedMode === ConsciousnessMode.Jesus && <AmbientLatinCross size={400} className="absolute -left-[200px] top-[12%]" />}
               {selectedMode === ConsciousnessMode.Buddha && <AmbientLotus size={400} className="absolute -right-20 top-[18%] -rotate-12" />}
               {selectedMode === ConsciousnessMode.Sage && <AmbientEnergy size={400} className="absolute -left-20 top-[18%]" />}
               {selectedMode === ConsciousnessMode.Unified && <AmbientSparkles size={400} className="absolute -right-20 top-[18%]" />}
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto relative scroll-smooth z-10 flex flex-col pt-20 px-8 pb-44">
              {renderHeader('text-slate-900')}
              
              <div className="flex-none pb-4">
                <div className="flex bg-white p-1.5 rounded-[2.2rem] border border-slate-100 mb-4 shadow-sm">
                  {(Object.keys(MODE_CONFIG) as ConsciousnessMode[]).map(m => (
                    <button key={m} onClick={() => setSelectedMode(m)} className={`flex-1 py-3.5 rounded-[1.6rem] text-[10px] font-bold uppercase tracking-wider transition-all ${selectedMode === m ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-900'}`}>
                      {lang === 'ko' ? MODE_CONFIG[m].label.split(' ')[0] : MODE_CONFIG[m].label.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-10">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in`}>
                    <div className={`max-w-[92%] ${msg.role === 'user' ? 'max-w-[85%]' : 'w-full'}`}>
                      {msg.role === 'user' ? (
                        <div className="p-6 px-7 rounded-[2.4rem] rounded-tr-md bg-growth-blue text-white font-medium shadow-xl shadow-growth-blue/10 text-[15px]">{msg.content}</div>
                      ) : (
                        msg.data ? <PrescriptionView data={msg.data} mode={selectedMode} lang={lang} isLocked={isLocked && i === messages.length - 1} onUnlock={() => setShowSubscription(true)} activeMissions={activeMissions} onToggleMission={handleToggleMission} /> : <div className="p-10 text-slate-800 text-center font-bold serif bg-white rounded-[3rem] border border-slate-50 shadow-sm text-lg">{msg.content}</div>
                      )}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start animate-in">
                    <div className="bg-white/50 backdrop-blur-sm p-6 px-8 rounded-[2rem] border border-slate-100 flex items-center gap-4">
                      <div className="flex gap-1.5">
                        <div className="w-2 h-2 bg-growth-blue rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-growth-blue rounded-full animate-bounce [animation-delay:0.2s]" />
                        <div className="w-2 h-2 bg-growth-blue rounded-full animate-bounce [animation-delay:0.4s]" />
                      </div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em]">{t.syncing}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="absolute bottom-6 left-8 right-8 z-50">
              <div className="relative group">
                <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSend()} disabled={isLoading || isLocked} placeholder={isLocked ? (lang === 'ko' ? "오늘의 분석 한도를 초과했습니다" : "Limit reached") : (lang === 'ko' ? "지금 내면의 소리를 들려주십시오..." : "Talk to me...")} className="w-full h-18 bg-white/95 backdrop-blur-md border border-slate-100 rounded-full px-8 pr-20 text-[15px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-growth-blue/20 shadow-premium transition-all disabled:opacity-50" />
                <button onClick={handleSend} disabled={!input.trim() || isLoading || isLocked} className="absolute right-2 top-2 w-14 h-14 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-lg active:scale-90 disabled:bg-slate-100 disabled:text-slate-300"><Send size={20} /></button>
              </div>
            </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="h-screen max-w-md mx-auto flex flex-col bg-cosmic-bg text-slate-900 overflow-hidden shadow-2xl relative">
      <div className="flex-1 relative flex flex-col overflow-hidden">{renderContent()}</div>

      {toastMessage && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center pointer-events-none p-6 animate-in fade-in duration-300">
          <div className="bg-slate-900/90 backdrop-blur-md text-white px-8 py-6 rounded-[2.5rem] shadow-2xl border border-white/10 flex items-center gap-5 max-w-xs pointer-events-auto shadow-premium">
            <div className="w-10 h-10 rounded-full bg-growth-blue/20 flex items-center justify-center shrink-0">
              <InfoIcon size={20} className="text-growth-blue" />
            </div>
            <p className="text-sm font-bold leading-snug serif">{toastMessage}</p>
          </div>
        </div>
      )}

      <nav className="flex-none h-24 bottom-nav-blur flex items-center justify-around px-12 pb-4 relative z-40">
        <button onClick={() => { setView('home'); setShowArchive(false); }} className={`p-4 transition-all ${view === 'home' && !showArchive ? 'text-growth-blue scale-110' : 'text-slate-300'}`}><LayoutDashboard size={28} /></button>
        <button onClick={() => { if (checkLogin()) { setView('chat'); setShowArchive(false); } }} className={`w-16 h-16 -mt-10 rounded-full bg-slate-900 flex items-center justify-center text-white shadow-premium active:scale-90 transition-all`}><Zap size={24} fill="currentColor" /></button>
        <button onClick={() => { if (checkLogin()) { setView('library'); setShowArchive(false); } }} className={`p-4 transition-all ${view === 'library' || showArchive ? 'text-growth-blue scale-110' : 'text-slate-300'}`}><Archive size={28} /></button>
      </nav>

      {showSetup && renderSetup()}

      {isMenuOpen && (
        <div className="fixed inset-0 z-[200] flex animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)} />
          <div className="relative w-[80%] max-sm bg-white h-full shadow-2xl flex flex-col p-10 space-y-12 animate-in slide-in-from-right-10 duration-500">
            <div className="flex justify-between items-center">
              <h2 className="serif text-2xl font-bold">인간다움</h2>
              <button onClick={() => setIsMenuOpen(false)} className="p-2 -mr-2 text-slate-300"><X size={24} /></button>
            </div>
            
            <div className="space-y-6 overflow-y-auto pb-10">
              <div className="space-y-4">
                <p className="text-meta">언어 설정 (Language)</p>
                <div className="grid grid-cols-2 gap-2">
                  {[{ id: 'ko', label: '한국어' }, { id: 'en', label: 'English' }, { id: 'ja', label: '日本語' }, { id: 'fr', label: 'Français' }].map(l => (
                    <button key={l.id} onClick={() => { setLang(l.id as AppLanguage); localStorage.setItem('app_lang', l.id); }} className={`py-3 rounded-xl text-xs font-bold transition-all border ${lang === l.id ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4 pt-6 border-t border-slate-50">
                <p className="text-meta">계정 관리</p>
                <button onClick={() => { if (checkLogin()) { setView('profile'); setIsMenuOpen(false); } }} className="w-full p-5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-4 text-slate-600 hover:bg-white transition-all">
                  <Settings size={18} />
                  <span className="text-sm font-bold">개인정보 수정</span>
                </button>
                <button onClick={() => { if (checkLogin()) { setView('admin'); setIsMenuOpen(false); } }} className="w-full p-5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-4 text-slate-600 hover:bg-white transition-all">
                  <ShieldCheck size={18} />
                  <span className="text-sm font-bold">관리자 대시보드</span>
                </button>
              </div>

              <div className="space-y-4 pt-6 border-t border-slate-50">
                <p className="text-meta">멤버십</p>
                <button onClick={() => { if (checkLogin()) { setShowSubscription(true); setIsMenuOpen(false); } }} className="w-full p-6 rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-between group active:bg-slate-100 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-growth-blue flex items-center justify-center text-white">
                      <Sparkles size={18} />
                    </div>
                    <div className="text-left">
                      <h4 className="text-sm font-bold text-slate-900">Premium Pass</h4>
                      <p className="text-[10px] text-slate-400 uppercase tracking-widest">분석 제한 해제</p>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-slate-200" />
                </button>
              </div>
            </div>

            <div className="mt-auto">
               <p className="text-[10px] text-slate-300 font-bold uppercase tracking-[0.4em] text-center">Version 1.2.0.CONSCIOUSNESS</p>
            </div>
          </div>
        </div>
      )}

      {showSubscription && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-8 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setShowSubscription(false)} />
          <div className="relative w-full max-w-sm bg-white rounded-[3.5rem] p-10 space-y-10 shadow-2xl animate-in zoom-in-95 duration-500">
             <div className="text-center space-y-4">
               <div className="w-16 h-16 rounded-3xl bg-slate-900 flex items-center justify-center mx-auto text-white shadow-xl">
                 <Lock size={28} />
               </div>
               <h3 className="serif text-2xl font-bold text-slate-900 leading-snug">{t.paywall.title}</h3>
               <p className="text-xs text-slate-400 font-medium leading-relaxed">{t.paywall.subtitle}</p>
             </div>
             <div className="space-y-3">
               {[
                 { id: '1', title: t.paywall.option1, price: t.paywall.option1Price },
                 { id: '2', title: t.paywall.option2, price: t.paywall.option2Price, best: true },
                 { id: '3', title: t.paywall.option3, price: t.paywall.option3Price }
               ].map(opt => (
                 <button key={opt.id} className={`w-full p-6 rounded-3xl border-2 flex items-center justify-between transition-all ${opt.best ? 'border-growth-blue bg-blue-50/20' : 'border-slate-100 hover:border-slate-200'}`}>
                    <div className="text-left">
                      <span className="text-[13px] font-bold text-slate-900 block">{opt.title}</span>
                      <span className="text-[11px] font-medium text-slate-400">{opt.price}</span>
                    </div>
                    {opt.best && <span className="px-3 py-1 bg-growth-blue text-white text-[8px] font-bold uppercase tracking-widest rounded-full">Best</span>}
                 </button>
               ))}
             </div>
             <button className="w-full py-5 rounded-full bg-slate-900 text-white font-bold text-sm shadow-premium active:scale-95 transition-all">
                {t.paywall.subscribe}
             </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
