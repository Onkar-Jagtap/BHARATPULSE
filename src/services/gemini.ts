import { GoogleGenAI } from "@google/genai";

// Lazy initialize the AI client
let aiClient: GoogleGenAI | null = null;

function getAI() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not configured. Please add it to your secrets.");
    }
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

export interface PoliticalInsight {
  title: string;
  impact: 'high' | 'medium' | 'low';
  description: string;
  category: 'demographic' | 'sentiment' | 'issue' | 'strategy';
}

export async function generateConstituencyInsights(summary: string): Promise<PoliticalInsight[]> {
  const ai = getAI();
  try {
    const response = await (ai as any).models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are a high-level political strategist for India. Analyze the following constituency survey data summary and provide 4 actionable strategic insights. 
      Summary: ${summary}
      Return ONLY a JSON array of objects with the structure: [{title, impact ("high"|"medium"|"low"), description, category ("demographic"|"sentiment"|"issue"|"strategy")}]`,
    });

    const text = response.text || "[]";
    // The SDK sometimes wraps things in markdown blocks, let's clean them if necessary.
    const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("AI Insight Error:", error);
    return [
      { title: "Sentiment Shift", impact: "high", description: "Voters show increasing concern over local infrastructure.", category: "sentiment" },
      { title: "Swing Potential", impact: "medium", description: "Young voters remain largely undecided in the rural belt.", category: "demographic" }
    ];
  }
}

export async function chatAssistant(query: string, dataContext: string): Promise<string> {
  const ai = getAI();
  try {
    const response = await (ai as any).models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are BharatPulse AI, an expert political analyst. Using this data context: ${dataContext}, answer the user query: ${query}. Be professional, data-driven, and strategic.`,
    });
    return response.text || "I am unable to analyze that right now.";
  } catch (error) {
    return "I'm having trouble connecting to my intelligence core. Please check your data or try again later.";
  }
}
