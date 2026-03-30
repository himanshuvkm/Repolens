import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function generateContentStream(prompt: string) {
  try {
    const response = await ai.models.generateContentStream({
      model: "gemini-3-flash-preview", // ✅ correct model
      contents: prompt, // ✅ simple string works in new SDK
    });

    return response;
  } catch (err: any) {
    console.error("❌ Gemini error:", err);

    if (err?.status === 429) {
      throw new Error(
        "Quota exceeded. Enable billing or switch project."
      );
    }

    throw new Error(err?.message || "Gemini API failed");
  }
}