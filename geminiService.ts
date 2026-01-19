
import { GoogleGenAI, Type } from "@google/genai";
import { NewApiResponse, ConsciousnessMode, AppLanguage } from "./types";
import { getSystemPrompt } from "./constants";

// API 키가 없을 경우를 대비한 안전한 초기화
const getAI = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("Gemini API_KEY가 설정되지 않았습니다. 환경 변수를 확인해주세요.");
  }
  return new GoogleGenAI({ apiKey: apiKey || "" });
};

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    user_analysis: {
      type: Type.OBJECT,
      properties: {
        level: { type: Type.STRING },
        lux: { type: Type.STRING },
        reasoning: {
          type: Type.OBJECT,
          properties: {
            emotion_match: { type: Type.STRING },
            action_match: { type: Type.STRING },
            logic: { type: Type.STRING }
          },
          required: ["emotion_match", "action_match", "logic"]
        }
      },
      required: ["level", "lux", "reasoning"]
    },
    metrics: {
      type: Type.OBJECT,
      properties: {
        emotion_alignment: { type: Type.INTEGER },
        action_consistency: { type: Type.INTEGER },
        energy_direction: { type: Type.STRING },
        lux_clarity: { type: Type.INTEGER }
      },
      required: ["emotion_alignment", "action_consistency", "energy_direction", "lux_clarity"]
    },
    wisdom_bridge: {
      type: Type.OBJECT,
      properties: {
        master: { type: Type.STRING },
        scripture_raw: { type: Type.STRING },
        source: { type: Type.STRING },
        master_guidance: { type: Type.STRING },
        growth_steps: {
          type: Type.ARRAY,
          items: { 
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              key_guide: { type: Type.STRING },
              method: {
                type: Type.OBJECT,
                properties: {
                  timer: { type: Type.STRING },
                  action: { type: Type.STRING },
                  mindset: { type: Type.STRING }
                },
                required: ["timer", "action", "mindset"]
              },
              insight: { type: Type.STRING }
            },
            required: ["title", "description", "key_guide", "method", "insight"]
          }
        },
        supplementary_advice: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              master: { type: Type.STRING },
              advice: { type: Type.STRING },
              source: { type: Type.STRING }
            },
            required: ["master", "advice", "source"]
          }
        }
      },
      required: ["master", "scripture_raw", "source", "master_guidance", "growth_steps"]
    }
  },
  required: ["user_analysis", "metrics", "wisdom_bridge"]
};

export async function processConsciousness(
  history: { role: string; content: string }[],
  mode: ConsciousnessMode,
  lang: AppLanguage
): Promise<NewApiResponse> {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview', // 가장 안정적인 최신 모델 사용
      contents: history.map(h => ({
        role: h.role === 'user' ? 'user' : 'model',
        parts: [{ text: h.content }]
      })),
      config: {
        systemInstruction: getSystemPrompt(mode, lang),
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.7
      }
    });

    const text = response.text || "{}";
    return JSON.parse(text) as NewApiResponse;
  } catch (e: any) {
    console.error("Gemini API 호출 에러 상세:", e);
    if (e.message?.includes("API key not valid")) {
      throw new Error("API 키가 유효하지 않습니다. 다시 확인해주세요.");
    }
    throw e;
  }
}

export async function processAnattaInsight(
  history: { role: string; content: string }[],
  selectedKeyword: string
): Promise<string> {
  const ai = getAI();
  const systemPrompt = `
    너는 사용자의 자아 관념을 해체하여 불교의 '무아(無我)'와 '연기(緣起)'의 통찰로 이끄는 명상 가이드다.
    사용자는 자신을 '${selectedKeyword}'라고 믿고 있다. 
    질문 규칙:
    1. 매우 차분하고 고요한 말투 유지.
    2. 한 번에 하나의 질문만.
    3. 3문답 이내 마무리.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: history.map(h => ({
      role: h.role === 'user' ? 'user' : 'model',
      parts: [{ text: h.content }]
    })),
    config: {
      systemInstruction: systemPrompt,
      temperature: 0.8
    }
  });

  return response.text || "지혜의 흐름이 잠시 멈췄습니다.";
}
