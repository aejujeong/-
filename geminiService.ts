
import { GoogleGenAI, Type } from "@google/genai";
import { NewApiResponse, ConsciousnessMode, AppLanguage } from "./types";
import { getSystemPrompt } from "./constants";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

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
              key_guide: { type: Type.STRING }, // 스키마에 핵심 가이드 추가
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
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
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

  try {
    const text = response.text || "{}";
    return JSON.parse(text) as NewApiResponse;
  } catch (e) {
    console.error("AI Analysis Parse Error:", e);
    throw new Error("Analysis failed");
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
    너의 목표는 사용자가 자신이라고 믿는 육체, 감정, 사회적 역할이 시시각각 변하며 고정된 실체가 없음을 깨닫게 하는 것이다.
    
    질문 규칙:
    1. 매우 차분하고, 철학적이며, 강요하지 않는 고요한 말투를 유지하라.
    2. 한 번에 하나의 질문만 던져라.
    3. 사용자의 답변을 경청하고, 그 답변 속에서 '변하는 성질'을 찾아내어 다시 질문하라.
    4. 3문답 이내에 대화를 마무리할 수 있도록 통찰의 깊이를 조절하라.
    5. 답변은 오직 텍스트로만 반환하라.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: history.map(h => ({
      role: h.role === 'user' ? 'user' : 'model',
      parts: [{ text: h.content }]
    })),
    config: {
      systemInstruction: systemPrompt,
      temperature: 0.8
    }
  });

  return response.text || "지혜의 흐름이 잠시 멈췄습니다. 다시 말씀해 주시겠습니까?";
}
