"use client";

import { useEffect, useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { Sparkles, RefreshCw, AlertCircle, Brain } from "lucide-react";

interface Props {
  repoData: any;
}

/** Trim the repoData to only essential fields to avoid hitting Gemini token limits */
function buildPayload(repoData: any) {
  if (!repoData) return {};
  return {
    owner: repoData.owner,
    repo: repoData.repo,
    metadata: repoData.metadata,
    languages: repoData.languages,
    contributorsCount: repoData.contributorsCount,
    // Send only the last 10 commits (message + author + date)
    commits: (repoData.commits ?? []).slice(0, 10).map((c: any) => ({
      message: c.message,
      authorName: c.authorName,
      date: c.date,
    })),
    // Send only last 10 PRs
    prs: (repoData.prs ?? []).slice(0, 10).map((p: any) => ({
      title: p.title,
      state: p.state,
      mergedAt: p.mergedAt,
    })),
    // Send only last 10 issues
    issues: (repoData.issues ?? []).slice(0, 10).map((i: any) => ({
      title: i.title,
      state: i.state,
    })),
    // Only top-level file paths
    fileTree: (repoData.fileTree ?? []).slice(0, 40).map((f: any) => f.path),
  };
}

export function AISummary({ repoData }: Props) {
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const fetchSummary = async () => {
    // Abort any in-flight request
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);
    setSummary("");

    try {
      const payload = buildPayload(repoData);
      const res = await fetch("/api/ai-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoDataJSON: payload }),
        signal: controller.signal,
      });

      if (!res.ok) {
        let errMsg = `Request failed with status ${res.status}`;
        try {
          const errData = await res.json();
          errMsg = errData.error || errMsg;
        } catch {}
        throw new Error(errMsg);
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) throw new Error("No readable stream returned");

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        setSummary((prev) => prev + chunk);
      }
    } catch (err: any) {
      if (err?.name === "AbortError") return; // silently ignore aborted requests
      console.error("AISummary error:", err);
      setError(err?.message || "Failed to generate AI analysis.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (repoData) fetchSummary();
    return () => abortRef.current?.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [repoData]);

  return (
    <section className="glass rounded-2xl p-6 lg:p-8 border border-outline-variant/5 flex flex-col min-h-[420px]">
      <div className="flex items-center gap-3 mb-6 border-b border-outline-variant/10 pb-6 relative">
        <div className="bg-primary/20 p-2 rounded-lg text-primary">
          <Brain className="shrink-0 w-6 h-6" />
        </div>
        <div>
          <h2 className="text-sm font-black uppercase tracking-[0.2em] text-on-surface">AI Strategic Summary</h2>
          <p className="text-xs text-on-surface-variant">Gemini 2.0 Architectural Synthesis</p>
        </div>

        {(error || (!loading && summary)) && (
          <button
            onClick={fetchSummary}
            className="absolute top-0 right-0 text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-highest hover:bg-surface-container-high transition-colors text-primary font-bold"
            title="Regenerate"
          >
            <RefreshCw className="w-3.5 h-3.5" /> {error ? "Retry" : "Regen"}
          </button>
        )}
      </div>

      <div className="overflow-y-auto custom-scrollbar flex-grow prose prose-sm prose-invert max-w-none text-on-surface-variant leading-relaxed">
        {summary ? (
          <div>
            <ReactMarkdown>{summary}</ReactMarkdown>
            {loading && (
              <span className="inline-block w-2 h-4 bg-primary animate-pulse ml-1 align-middle" />
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-48 text-on-surface-variant/50">
            {error ? (
              <>
                <AlertCircle className="w-8 h-8 mb-3 text-red-500/50" />
                <p className="text-sm text-center text-red-400/70 max-w-xs">{error}</p>
              </>
            ) : (
              <>
                <Sparkles className="w-8 h-8 mb-3 text-primary/50 animate-pulse" />
                <p className="animate-pulse text-sm">Generating insights...</p>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
