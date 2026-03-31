import { NextRequest } from "next/server";
import { generateContentStream } from "@/lib/gemini";

export async function POST(request: NextRequest) {
  // ── 1. ENV CHECK ─────────────────────────────────────────────
  if (!process.env.GEMINI_API_KEY) {
    return json({ error: "GEMINI_API_KEY is not configured." }, 500);
  }

  // ── 2. PARSE BODY ────────────────────────────────────────────
  let body: any;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON body." }, 400);
  }

  const { repoDataJSON } = body ?? {};
  if (!repoDataJSON) {
    return json({ error: "repoDataJSON is required." }, 400);
  }

  const dataString =
    typeof repoDataJSON === "string"
      ? repoDataJSON
      : JSON.stringify(repoDataJSON, null, 2);

  // ── 3. PROMPT ────────────────────────────────────────────────
  const prompt = `You are an expert software architect and open-source analyst. Analyze the GitHub repository data below and return a structured JSON response. Be concise but insightful.

Return ONLY valid JSON matching this exact schema (no markdown fences, no extra text):

{
  "overview": {
    "title": "string — repo name or inferred title (≤ 60 chars)",
    "tagline": "string — one-line punchy description (≤ 120 chars)",
    "description": "string — 2–3 sentences covering what it does and why it matters"
  },
  "audience": {
    "primary": "string — primary target user (e.g. 'Backend engineers building REST APIs')",
    "useCases": ["string", "string", "string"]
  },
  "techStack": {
    "languages": ["string"],
    "frameworks": ["string"],
    "tooling": ["string"],
    "highlights": "string — 1 sentence about the most interesting tech choices"
  },
  "health": {
    "status": "active" | "experimental" | "stale" | "archived",
    "statusReason": "string — 1-2 sentences explaining the status verdict",
    "activityScore": number between 1–10,
    "activityNote": "string — brief note on commit/PR/issue frequency",
    "hasTests": boolean,
    "hasDocs": boolean,
    "hasCI": boolean
  },
  "contribution": {
    "verdict": "YES" | "MAYBE" | "NO",
    "reasoning": "string — 2–3 sentences",
    "entryPoints": [
      { "label": "string — short title", "detail": "string — 1 sentence" },
      { "label": "string", "detail": "string" },
      { "label": "string", "detail": "string" }
    ]
  },
  "risks": ["string — 1 risk per item, max 3 items"],
  "tldr": "string — 1 bold sentence summary of the whole repo in plain English"
}

Repository Data:
${dataString}`;

  // ── 4. SAFE AI CALL ─────────────────────────────────────────
  const result = await generateContentStream(prompt);

  // ── 5. STREAM RESPONSE ──────────────────────────────────────
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of result) {
          const text = chunk.text;
          if (text) {
            controller.enqueue(encoder.encode(text));
          }
        }
      } catch (err) {
        console.error("[ai-summary] Stream error:", err);
        controller.enqueue(encoder.encode("\n\n__STREAM_ERROR__"));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}

// ── Helper ─────────────────────────────────────────────────────
function json(data: object, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}