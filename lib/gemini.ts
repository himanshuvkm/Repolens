import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GEMINI_API_KEY) {
  console.warn("GEMINI_API_KEY is not defined.");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "dummy_key");

export const geminiModel = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
});

export async function generateContentStream(prompt: string) {
  return geminiModel.generateContentStream(prompt);
}
