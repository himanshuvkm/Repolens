import {
  GoogleGenerativeAI,
  GenerateContentStreamResult,
} from "@google/generative-ai";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not set in environment variables");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 5000;

export async function generateContentStream(
  prompt: string
): Promise<GenerateContentStreamResult> {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash"  // works with latest SDK
  });

  let lastError: unknown;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      return await model.generateContentStream(prompt);
    } catch (err: any) {
      lastError = err;
      const isRateLimited = err?.status === 429;

      if (isRateLimited && attempt < MAX_RETRIES) {
        console.warn(
          `⚠️ Rate limited (attempt ${attempt}/${MAX_RETRIES}). Retrying in ${RETRY_DELAY_MS / 1000}s...`
        );
        await new Promise((res) => setTimeout(res, RETRY_DELAY_MS));
      } else if (!isRateLimited) {
        throw err;
      }
    }
  }

  throw new Error(
    `Gemini rate limit exceeded after ${MAX_RETRIES} attempts. Original error: ${
      lastError instanceof Error ? lastError.message : String(lastError)
    }`
  );
}