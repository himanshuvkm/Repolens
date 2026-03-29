import { NextRequest, NextResponse } from "next/server";
import { analyzeRepo } from "@/lib/github";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const owner = searchParams.get("owner");
    const repo = searchParams.get("repo");

    if (!owner || !repo) {
      return NextResponse.json(
        { error: "Owner and Repo are required parameters" },
        { status: 400 }
      );
    }

    const data = await analyzeRepo(owner, repo);
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("API Analyze Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to analyze repository" },
      { status: 500 }
    );
  }
}
