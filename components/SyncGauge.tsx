
import React from 'react';

interface SyncGaugeProps {
  score: number;
  label: string;
  level: number;
}

export const SyncGauge: React.FC<SyncGaugeProps> = ({ score, label, level }) => {
  const radius = 46;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center group">
      <div className="relative w-36 h-36 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90 drop-shadow-sm">
          <circle
            cx="72"
            cy="72"
            r={radius}
            stroke="currentColor"
            strokeWidth="3"
            fill="transparent"
            className="text-black/[0.03] dark:text-white/5"
          />
          <circle
            cx="72"
            cy="72"
            r={radius}
            stroke="currentColor"
            strokeWidth="3"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className={`transition-all duration-1000 ease-out ${
              score > 80 ? 'text-indigo-500 dark:text-indigo-400' : 
              score > 50 ? 'text-blue-500 dark:text-blue-400' : 
              'text-orange-500 dark:text-orange-400'
            }`}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-black tracking-tighter text-zen-text dark:text-white">{score}%</span>
          <div className="w-6 h-0.5 bg-black/5 dark:bg-white/10 my-1 rounded-full" />
          <span className="text-[9px] text-zen-text/30 dark:text-white/20 font-black uppercase tracking-widest">Master Sync</span>
        </div>
      </div>
      <div className="text-center mt-4 space-y-1">
        <p className="text-[15px] font-extrabold text-zen-text dark:text-white serif">{label}</p>
        <div className="inline-flex px-3 py-1 bg-black/[0.03] dark:bg-white/[0.05] rounded-full">
           <p className="text-[9px] font-black text-zen-text/40 dark:text-white/30 uppercase tracking-[0.1em]">Consciousness L{level}</p>
        </div>
      </div>
    </div>
  );
};
