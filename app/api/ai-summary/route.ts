import { NextRequest, NextResponse } from "next/server";
import { generateContentStream } from "@/lib/gemini";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { repoDataJSON } = body;

    if (!repoDataJSON) {
      return NextResponse.json({ error: "repoDataJSON is required" }, { status: 400 });
    }

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
${JSON.stringify(repoDataJSON)}`;

    const result = await generateContentStream(prompt);
    
    // Transform Gemini response into a standard Web ReadableStream
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            controller.enqueue(new TextEncoder().encode(chunkText));
          }
          controller.close();
        } catch (e) {
          controller.error(e);
        }
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error: any) {
    console.error("API AI-Summary Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate AI summary" },
      { status: 500 }
    );
  }
}
