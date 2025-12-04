import { GoogleGenAI } from "@google/genai";
import { Level } from "../types";

// Initialize Gemini
// NOTE: We are strictly following the guideline to use process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
You are a Supervisor at the Ministry of Truth in the world of 1984. 
You are cold, bureaucratic, and menacing. You praise conformity and threaten deviation.
You MUST speak in Simplified Chinese (zh-CN).
Speak directly to the "Analyst" (the user).
Keep responses short (under 50 words) and atmospheric.
Use terms like "同志" (Comrade), "双重思想" (Doublethink), "思想罪" (Thoughtcrime).
`;

export const getNarrativeFeedback = async (
  stage: Level,
  userQuery: string,
  isSuccess: boolean
): Promise<string> => {
  try {
    const prompt = `
      Context: The user is playing a SQL game.
      Stage Title: ${stage.title}
      Stage Briefing: ${stage.briefing}
      User Query: "${userQuery}"
      Result: ${isSuccess ? "Success" : "Failure"}
      
      Generate a response from the Supervisor in Simplified Chinese.
      If Success: Acknowledge the adequate work. Warn them not to be complacent.
      If Failure: Threaten them with the Ministry of Love. Mention the error vaguely.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });

    return response.text || "加倍不加好。传输错误。";
  } catch (error) {
    console.error("Gemini Error:", error);
    return isSuccess 
      ? "处理完成。继续下一层级。" 
      : "检测到错误。立即修正。";
  }
};

export const analyzeEnding = async (userQuery: string): Promise<{ type: 'REBELLION' | 'SUBMISSION' | 'LOVE' | 'CONFUSION', narrative: string }> => {
  try {
    const prompt = `
      The user is at the final stage of the game. They had a choice to DELETE 'Winston S.' (Submission), DELETE 'O'Brien' (Rebellion), or DELETE 'Julia' (Betrayal/Tragedy), or something else.
      
      The user wrote: "${userQuery}"
      
      Analyze the semantic intent of this SQL query.
      
      Return a JSON object with:
      - type: "REBELLION" (if attacking authority/O'Brien), "SUBMISSION" (if deleting Winston/Julia/Traitors), "LOVE" (if trying to save everyone or weird logic), "CONFUSION" (invalid SQL).
      - narrative: A paragraph describing the outcome in the 1984 style, written in Simplified Chinese.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response");
    
    return JSON.parse(text);
  } catch (error) {
    return {
      type: 'CONFUSION',
      narrative: "屏幕闪烁。查询格式错误。思想警察已经在门口了。"
    };
  }
};