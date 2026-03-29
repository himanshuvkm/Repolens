import { NextRequest } from "next/server";
import { generateContentStream } from "@/lib/gemini";

export async function POST(request: NextRequest) {
  try {
    // ✅ Guard: check API key early
    if (!process.env.GEMINI_API_KEY) {
      return new Response(
        JSON.stringify({ error: "GEMINI_API_KEY is not configured" }),
        { status: 500 }
      );
    }

    const body = await request.json();
    const { repoDataJSON } = body;

    if (!repoDataJSON) {
      return new Response(
        JSON.stringify({ error: "repoDataJSON is required" }),
        { status: 400 }
      );
    }

    // ✅ Guard: handle both string and object
    const dataString =
      typeof repoDataJSON === "string"
        ? repoDataJSON
        : JSON.stringify(repoDataJSON, null, 2);

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

    const result = await generateContentStream(prompt);
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const text = chunk.text();
            if (text) {
              controller.enqueue(encoder.encode(text));
            }
          }
        } catch (err) {
          console.error("Stream error:", err);
          controller.error(err);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        "Connection": "keep-alive",
        // ✅ Removed Transfer-Encoding: chunked — Next.js handles this
      },
    });
  } catch (error: any) {
    console.error("API AI-Summary Error:", error);
    return new Response(
      JSON.stringify({
        error: error.message || "Failed to generate AI summary",
      }),
      { status: 500 }
    );
  }
}