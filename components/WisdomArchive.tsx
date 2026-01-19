
import React, { useState } from 'react';
import { ConsciousnessMode, Scripture } from '../types';
import { 
  Cross, Flower2, Sun, ArrowRight, Quote, BookOpen, 
  ExternalLink, Search, ChevronRight, BookText, ScrollText, Sparkles,
  MessageCircle, Library
} from 'lucide-react';
import { MODE_CONFIG, LIBRARY_INDEX } from '../constants';

interface WisdomArchiveProps {
  category: 'bible' | 'buddha' | 'sage';
  onReadFull: (scripture: Scripture) => void;
  onStartChat: (mode: ConsciousnessMode) => void;
}

export const WisdomArchive: React.FC<WisdomArchiveProps> = ({ category, onReadFull, onStartChat }) => {
  const [search, setSearch] = useState('');
  const [subTab, setSubTab] = useState<'old' | 'new'>('old');

  const renderBookItem = (book: { name: string, sub: string, cat: string }) => (
    <div 
      key={book.name}
      onClick={() => onReadFull({ source: book.name, quote: "", insight: "" })}
      className="glass-panel p-5 rounded-3xl border border-white/5 hover:border-white/20 transition-all group cursor-pointer active:scale-[0.98] flex flex-col items-center text-center relative overflow-hidden h-full"
    >
      <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-20 transition-opacity">
        <Library size={48} />
      </div>
      <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-white/10 transition-all">
        <BookText size={18} className="text-white/40 group-hover:text-white/80" />
      </div>
      <span className="text-[9px] text-rose-400 font-bold uppercase tracking-widest mb-1 opacity-60">{book.cat}</span>
      <h4 className="serif text-lg font-bold text-white/90 mb-1 leading-tight">{book.name}</h4>
      <p className="text-[10px] text-gray-500 uppercase tracking-tighter line-clamp-1">{book.sub}</p>
    </div>
  );

  const getTitle = () => {
    if (category === 'bible') return { main: "성경 전서", sub: "Genesis to Revelation", icon: <Cross size={24} className="text-amber-400" />, color: MODE_CONFIG[ConsciousnessMode.Jesus].color };
    if (category === 'buddha') return { main: "부처님 지혜", sub: "Buddhist Library", icon: <Flower2 size={24} className="text-emerald-400" />, color: MODE_CONFIG[ConsciousnessMode.Buddha].color };
    return { main: "영성 스승", sub: "Modern & Classical Sages", icon: <Sun size={24} className="text-indigo-400" />, color: MODE_CONFIG[ConsciousnessMode.Sage].color };
  };

  const info = getTitle();
  const mode = category === 'bible' ? ConsciousnessMode.Jesus : category === 'buddha' ? ConsciousnessMode.Buddha : ConsciousnessMode.Sage;

  const filteredItems = (items: any[]) => 
    items.filter(item => item.name.toLowerCase().includes(search.toLowerCase()) || item.sub.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex-1 overflow-y-auto scroll-smooth animate-in fade-in duration-700">
      <div className="p-6 pt-20 pb-40 space-y-8">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 shadow-lg">
              {info.icon}
            </div>
            <div>
              <h2 className="serif text-2xl font-bold text-white">{info.main}</h2>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-widest">{info.sub}</p>
            </div>
          </div>
          
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-white/50 transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="경전이나 스승을 검색하세요..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/5 focus:border-white/20 focus:ring-0 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-white transition-all outline-none"
            />
          </div>

          {category === 'bible' && (
            <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5">
              <button 
                onClick={() => setSubTab('old')} 
                className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${subTab === 'old' ? 'bg-white/10 text-white shadow-lg' : 'text-gray-500'}`}
              >
                구약성경 (39권)
              </button>
              <button 
                onClick={() => setSubTab('new')} 
                className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${subTab === 'new' ? 'bg-white/10 text-white shadow-lg' : 'text-gray-500'}`}
              >
                신약성경 (27권)
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          {category === 'bible' && (subTab === 'old' ? filteredItems(LIBRARY_INDEX.bible.oldTestament) : filteredItems(LIBRARY_INDEX.bible.newTestament)).map(renderBookItem)}
          {category === 'buddha' && filteredItems(LIBRARY_INDEX.buddha).map(renderBookItem)}
          {category === 'sage' && filteredItems(LIBRARY_INDEX.sage).map(renderBookItem)}
        </div>

        <div className="p-8 rounded-[3rem] bg-gradient-to-br from-white/5 to-transparent border border-white/10 text-center relative overflow-hidden group mt-12">
          <div className={`absolute inset-0 bg-gradient-to-br ${info.color} opacity-[0.03] group-hover:opacity-[0.06] transition-opacity`} />
          <div className="relative z-10 flex flex-col items-center">
            <MessageCircle className="text-white/40 mb-4" size={32} />
            <h4 className="serif text-xl font-bold text-white mb-2">{mode}의 가이드</h4>
            <p className="text-sm text-gray-500 mb-6 max-w-[240px]">이 방대한 지혜가 당신의 고통에 어떻게 답하는지 실시간으로 대화해보세요.</p>
            <button 
              onClick={() => onStartChat(mode)}
              className="px-10 py-3.5 rounded-full text-sm font-bold bg-white text-black hover:scale-105 transition-all shadow-xl active:scale-95"
            >
              지금 대화 시작하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
