
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
  
  const [activeMissions, setActiveMissions] = useState<MissionItem[]>([]);
  const [missionHistory, setMissionHistory] = useState<MissionRecord[]>([]);
  const [levelDetailTab, setLevelDetailTab] = useState<'energy' | 'mission'>('energy');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

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

  useEffect(() => {
    const browserLang = navigator.language.split('-')[0];
    const detected = (['ko', 'ja', 'fr', 'en'] as AppLanguage[]).includes(browserLang as AppLanguage) ? (browserLang as AppLanguage) : 'en';
    setLang((localStorage.getItem('app_lang') as AppLanguage) || detected);
    
    const savedName = localStorage.getItem('user_name');
    const savedBirth = localStorage.getItem('user_birth');
    const savedHistory = localStorage.getItem('energy_history');
    const savedAllUsers = localStorage.getItem('registered_users_db');
    
    if (savedAllUsers) { try { setAllUsers(JSON.parse(savedAllUsers)); } catch(e) {} }
    if (savedName) setUserName(savedName);
    if (savedBirth) setUserBirth(savedBirth);
    if (savedHistory) {
      try {
        const parsed: EnergyRecord[] = JSON.parse(savedHistory);
        setEnergyHistory(parsed);
        if (parsed.length > 0) setCurrentEnergy(parsed[parsed.length - 1]);
      } catch (e) { console.error(e); }
    }
    wisdomDb.initialize();
  }, []);

  // 로그인 체크 헬퍼
  const checkLogin = () => {
    if (!userName) {
      setSetupStep('platform');
      setShowSetup(true);
      return false;
    }
    return true;
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
    if (!loginId.trim() || !loginPw.trim()) return;
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
    if (!userName.trim() || !userBirth.trim()) return;
    localStorage.setItem('user_name', userName);
    localStorage.setItem('user_birth', userBirth);
    const updatedAllUsers = [...allUsers.filter(u => u.id !== loginId), { id: loginId, name: userName, birth: userBirth }];
    setAllUsers(updatedAllUsers);
    localStorage.setItem('registered_users_db', JSON.stringify(updatedAllUsers));
    setShowSetup(false);
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading || isLocked) return;
    const userMessage: ChatMessage = { role: 'user', content: input.trim(), timestamp: Date.now() };
    setMessagesByMode(prev => ({ ...prev, [selectedMode]: [...prev[selectedMode], userMessage] }));
    setInput('');
    setIsLoading(true);
    try {
      const response = await processConsciousness([...messages, userMessage].map(m => ({ role: m.role, content: m.content })), selectedMode, lang);
      const ts = Date.now();
      const newRecord: EnergyRecord = { 
        date: new Date(ts).toISOString(), timestamp: ts, 
        level: parseInt(response.user_analysis.level.replace(/[^0-9]/g, '')) || 1, 
        lux_score: response.user_analysis.lux, status_label: response.user_analysis.level, 
        summary: response.user_analysis.reasoning.logic, metrics: response.metrics 
      };
      setEnergyHistory(prev => {
        const updated = [...prev, newRecord].slice(-30);
        localStorage.setItem('energy_history', JSON.stringify(updated));
        return updated;
      });
      setCurrentEnergy(newRecord);
      setMessagesByMode(prev => ({ ...prev, [selectedMode]: [...prev[selectedMode], { role: 'assistant', content: "", timestamp: ts, data: response } as ChatMessage] }));
    } catch (error) {
      setMessagesByMode(prev => ({ ...prev, [selectedMode]: [...prev[selectedMode], { role: 'assistant', content: '오류가 발생했습니다.', timestamp: Date.now() } as ChatMessage] }));
    } finally { setIsLoading(false); }
  };

  const renderHeader = (colorClass: string) => (
    <header className={`absolute top-0 left-0 right-0 z-[100] px-6 py-5 flex items-center justify-between pointer-events-none ${colorClass}`}>
      <button 
        onClick={() => userName ? setView('profile') : (setSetupStep('platform'), setShowSetup(true))}
        className="text-current text-xs font-bold pointer-events-auto px-2 py-1 active:opacity-60 transition-all drop-shadow-md"
      >
        {userName ? `${userName} (${currentEnergy?.level || 0}단계)` : '로그인'}
      </button>
      <button 
        onClick={() => setIsMenuOpen(true)} 
        className="text-current pointer-events-auto p-2 active:opacity-60 transition-all drop-shadow-md"
      >
        <Menu size={20} />
      </button>
    </header>
  );

  const renderSetup = () => (
    <div className="fixed inset-0 z-[250] flex flex-col bg-cosmic-bg text-slate-900 overflow-y-auto pt-20 pb-12 px-10 items-center animate-in fade-in duration-300">
      <button onClick={() => setShowSetup(false)} className="absolute top-8 right-8 p-2 text-slate-300 hover:text-slate-900 transition-colors">
        <X size={24} />
      </button>
      <div className="w-full space-y-12 max-w-sm">
        <div className="text-center space-y-4">
           <div className="w-20 h-20 rounded-[2.5rem] bg-white border border-slate-200/60 flex items-center justify-center mx-auto shadow-premium mb-6">
              <div className="relative flex flex-col items-center h-10 justify-center animate-tilt">
                 <div className="w-4 h-4 bg-growth-blue rounded-full mb-1" />
                 <div className="w-8 h-4 bg-growth-blue/40 rounded-t-full" />
              </div>
           </div>
           <h1 className="serif text-3xl font-bold text-slate-900 leading-tight">인간다움</h1>
           <p className="text-sm text-slate-400 font-medium italic">성자들의 지혜로 에고를 해체하고<br/>관찰자 자아를 회복해주십시오.</p>
        </div>

        {setupStep === 'platform' && (
          <div className="space-y-4 pt-4">
            <button onClick={() => handleStartAuth('kakao')} className="w-full h-16 rounded-3xl bg-[#FEE500] text-[#3A1D1D] font-bold text-sm shadow-sm flex items-center justify-center gap-3 active:scale-95 transition-all"><KakaoIcon /> 카카오톡으로 시작하기</button>
            <button onClick={() => handleStartAuth('google')} className="w-full h-16 rounded-3xl bg-white border border-slate-200 text-slate-700 font-bold text-sm shadow-sm flex items-center justify-center gap-3 active:scale-95 transition-all"><GoogleIcon /> Google로 시작하기</button>
            <button onClick={() => handleStartAuth('apple')} className="w-full h-16 rounded-3xl bg-black text-white font-bold text-sm shadow-sm flex items-center justify-center gap-3 active:scale-95 transition-all"><AppleIcon /> Apple로 시작하기</button>
            <button onClick={() => handleStartAuth('guest')} className="w-full h-16 rounded-3xl bg-slate-100 text-slate-500 font-bold text-sm shadow-sm flex items-center justify-center gap-3 active:scale-95 transition-all mt-2"><User size={18} /> 가입 없이 이용하기</button>
          </div>
        )}

        {setupStep === 'auth' && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 mb-2">
              <button onClick={() => setSetupStep('platform')} className="text-slate-400"><ChevronLeft size={24} /></button>
              <h3 className="text-lg font-bold">인증하기</h3>
            </div>
            <div className="space-y-4">
              <input type="email" value={loginId} onChange={(e) => setLoginId(e.target.value)} placeholder="이메일 또는 아이디" className="w-full h-16 bg-white border border-slate-100 rounded-3xl px-6 text-[15px] focus:outline-none shadow-inner-soft" />
              <input type="password" value={loginPw} onChange={(e) => setLoginPw(e.target.value)} placeholder="비밀번호" className="w-full h-16 bg-white border border-slate-100 rounded-3xl px-6 text-[15px] focus:outline-none shadow-inner-soft" />
            </div>
            <button onClick={handleAuthSubmit} className="w-full h-16 rounded-full bg-slate-900 text-white font-bold shadow-premium active:scale-95 transition-all">인증 완료</button>
          </div>
        )}

        {setupStep === 'profile' && (
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <h3 className="text-xl font-bold">환영합니다!</h3>
              <p className="text-xs text-slate-400">서비스 이용을 위해 이름을 설정해주십시오.</p>
            </div>
            <div className="space-y-6">
              <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="이름" className="w-full h-16 bg-white border border-slate-100 rounded-3xl px-6 text-[15px] focus:outline-none shadow-inner-soft" />
              <input type="date" value={userBirth} onChange={(e) => setUserBirth(e.target.value)} className="w-full h-16 bg-white border border-slate-100 rounded-3xl px-6 text-[15px] focus:outline-none shadow-inner-soft" />
            </div>
            <button onClick={handleSetupComplete} className="w-full h-18 rounded-[2.2rem] bg-slate-900 text-white font-bold text-base shadow-premium active:scale-95 transition-all">대화 시작하기</button>
          </div>
        )}
      </div>
    </div>
  );

  const renderContent = () => {
    if (showArchive) return <WisdomArchive category={archiveCategory} onReadFull={() => {}} onStartChat={(m) => checkLogin() && (setSelectedMode(m), setView('chat'), setShowArchive(false))} />;
    switch(view) {
      case 'level-detail': return <LevelDetailPage currentEnergy={currentEnergy} onBack={() => setView('home')} activeMissions={activeMissions} onToggleMission={() => {}} onSaveMissionRecord={() => {}} missionHistory={missionHistory} detailTab={levelDetailTab} />;
      case 'history-detail': return <HistoryDetailPage history={energyHistory} onBack={() => setView('home')} />;
      case 'insight': return <InsightView onBack={() => setView('home')} />;
      case 'meditation': return <MeditationView onBack={() => setView('home')} />;
      case 'library': return <LibraryView onBack={() => setView('home')} onSelectCategory={(cat) => { setArchiveCategory(cat); setShowArchive(true); }} />;
      case 'profile':
        return (
          <div className="flex-1 p-8 pt-20 space-y-10 overflow-y-auto">
            <div className="flex items-center gap-4">
              <button onClick={() => setView('home')} className="p-2 -ml-2 text-slate-400"><ChevronLeft size={24} /></button>
              <h2 className="serif text-2xl font-bold">개인정보 수정</h2>
            </div>
            <div className="space-y-6">
              <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} className="w-full h-16 bg-white border border-slate-100 rounded-3xl px-6" />
              <input type="date" value={userBirth} onChange={(e) => setUserBirth(e.target.value)} className="w-full h-16 bg-white border border-slate-100 rounded-3xl px-6" />
              <button onClick={() => (localStorage.setItem('user_name', userName), setView('home'))} className="w-full h-18 rounded-[2rem] bg-slate-900 text-white font-bold">수정 완료</button>
            </div>
          </div>
        );
      case 'home': return (
        <EnergyDashboard 
          currentEnergy={currentEnergy} history={energyHistory} lang={lang} 
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
            <div ref={scrollRef} className="flex-1 overflow-y-auto scroll-smooth z-10 flex flex-col pt-20 px-8 pb-44">
              {renderHeader('text-slate-900')}
              <div className="flex bg-white p-1.5 rounded-[2.2rem] border border-slate-100 mb-4 shadow-sm">
                {(Object.keys(MODE_CONFIG) as ConsciousnessMode[]).map(m => (
                  <button key={m} onClick={() => setSelectedMode(m)} className={`flex-1 py-3.5 rounded-[1.6rem] text-[10px] font-bold transition-all ${selectedMode === m ? 'bg-slate-900 text-white' : 'text-slate-400'}`}>
                    {MODE_CONFIG[m].label.split(' ')[0]}
                  </button>
                ))}
              </div>
              <div className="space-y-10">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={msg.role === 'user' ? 'max-w-[85%]' : 'w-full'}>
                      {msg.role === 'user' ? <div className="p-6 rounded-[2.4rem] rounded-tr-md bg-growth-blue text-white text-[15px]">{msg.content}</div> : msg.data ? <PrescriptionView data={msg.data} mode={selectedMode} lang={lang} isLocked={isLocked && i === messages.length - 1} activeMissions={[]} onToggleMission={() => {}} /> : <div className="p-10 text-center font-bold serif bg-white rounded-[3rem] shadow-sm">{msg.content}</div>}
                    </div>
                  </div>
                ))}
                {isLoading && <div className="p-6 text-xs text-slate-400 font-bold animate-pulse">동기화 중...</div>}
              </div>
            </div>
            <div className="absolute bottom-6 left-8 right-8 z-50 flex items-center gap-2">
              <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSend()} placeholder="내면의 소리를 들려주십시오..." className="flex-1 h-18 bg-white border border-slate-100 rounded-full px-8 shadow-premium" />
              <button onClick={handleSend} className="w-18 h-18 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-lg"><Send size={20} /></button>
            </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="h-screen max-w-md mx-auto flex flex-col bg-cosmic-bg text-slate-900 overflow-hidden shadow-2xl relative">
      <div className="flex-1 relative flex flex-col overflow-hidden">{renderContent()}</div>
      <nav className="flex-none h-24 bottom-nav-blur flex items-center justify-around px-12 pb-4 relative z-40">
        <button onClick={() => setView('home')} className={`p-4 transition-all ${view === 'home' ? 'text-growth-blue' : 'text-slate-300'}`}><LayoutDashboard size={28} /></button>
        <button onClick={() => checkLogin() && setView('chat')} className="w-16 h-16 -mt-10 rounded-full bg-slate-900 flex items-center justify-center text-white shadow-premium"><Zap size={24} fill="currentColor" /></button>
        <button onClick={() => checkLogin() && setView('library')} className={`p-4 transition-all ${view === 'library' ? 'text-growth-blue' : 'text-slate-300'}`}><Archive size={28} /></button>
      </nav>
      {showSetup && renderSetup()}
    </div>
  );
};

export default App;
