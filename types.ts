
export type AppView = 'home' | 'chat' | 'level-detail' | 'history-detail' | 'insight' | 'profile' | 'admin' | 'meditation' | 'library';

export type AppLanguage = 'ko' | 'ja' | 'fr' | 'en';

export enum ConsciousnessMode {
  Jesus = "Jesus",
  Buddha = "Buddha",
  Sage = "Masters",
  Unified = "All-in-One"
}

export interface UserAnalysis {
  level: string; // e.g., "1단 파괴"
  lux: string | number;
  reasoning: {
    emotion_match: string;
    action_match: string;
    logic: string;
  };
}

export interface EnergyMetrics {
  emotion_alignment: number;
  action_consistency: number;
  energy_direction: "Power" | "Force" | string;
  lux_clarity: number;
}

export interface MissionItem {
  title: string;
  description: string;
  key_guide: string; // 미션별 맞춤형 핵심 가이드 필드 추가
  method: {
    timer: string;
    action: string;
    mindset: string;
  };
  insight: string;
}

export interface MissionRecord {
  id: string;
  timestamp: number;
  title: string;
  feeling: string;
  note: string;
  details?: MissionItem; // 완료 시점의 미션 상세 정보 저장
}

export interface WisdomBridge {
  master: string;
  scripture_raw: string;
  source: string;
  master_guidance: string;
  growth_steps: MissionItem[]; 
  supplementary_advice?: { master: string; advice: string; source: string }[];
}

export interface NewApiResponse {
  user_analysis: UserAnalysis;
  metrics: EnergyMetrics;
  wisdom_bridge: WisdomBridge;
}

export interface Scripture {
  source: string;
  quote: string;
  insight: string;
}

export interface EnergyRecord {
  date: string; 
  timestamp: number;
  level: number; // 1-10
  lux_score: string | number;
  status_label: string; // e.g., "용기"
  summary: string;
  metrics: EnergyMetrics; 
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  data?: NewApiResponse;
}
