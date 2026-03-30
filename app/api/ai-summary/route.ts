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
  const prompt = `You are a senior developer assistant analyzing a GitHub repository.

Given the following repository data, provide a detailed analysis in this exact format:

## What This Repo Does
[2-3 sentence plain English description]

## Who It's Built For
[Target audience and use cases]

## Tech Stack Detected
[List the detected languages, frameworks, tools]

## Production Readiness
[Is it stable, experimental, or abandoned? Why?]

## Should I Contribute?
Verdict: YES / MAYBE / NO
Reasoning: [2-3 sentences explaining the verdict]

## Suggested First Issues
1. [Issue title or suggestion]
2. [Issue title or suggestion]
3. [Issue title or suggestion]

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

        // 🔥 Never break stream
        controller.enqueue(
          encoder.encode("\n\n⚠️ Stream interrupted.")
        );
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