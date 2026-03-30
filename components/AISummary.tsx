"use client";

import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Sparkles, RefreshCw, AlertCircle, Brain } from "lucide-react";

interface Props {
  repoData: any;
}

export function AISummary({ repoData }: Props) {
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchSummary = async () => {
    setLoading(true);
    setError(false);
    setSummary("");
    
    try {
      const res = await fetch("/api/ai-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoDataJSON: repoData }),
      });

      if (!res.ok) throw new Error("Failed to fetch");

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) throw new Error("No reader");

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        setSummary((prev) => prev + chunk);
      }
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [repoData]);

  return (
    <section className="glass rounded-2xl p-6 lg:p-8 border border-outline-variant/5 flex flex-col h-1/2">
      <div className="flex items-center gap-3 mb-6 border-b border-outline-variant/10 pb-6 relative">
        <div className="bg-primary/20 p-2 rounded-lg text-primary">
          <Brain className="shrink-0 w-6 h-6 overflow-hidden self-start" />
        </div>
        <div>
          <h2 className="text-sm font-black uppercase tracking-[0.2em] text-on-surface">AI Strategic Summary</h2>
          <p className="text-xs text-on-surface-variant">Gemini 2.0 Architectural Synthesis</p>
        </div>
        
        {error && (
          <button 
            onClick={fetchSummary}
            className="absolute top-0 right-0 text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-highest hover:bg-surface-container-high transition-colors text-primary font-bold"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Retry
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
                <p>Failed to generate analysis.</p>
              </>
            ) : (
              <>
                <Sparkles className="w-8 h-8 mb-3 text-primary/50 animate-pulse" />
                <p className="animate-pulse">Generating insights...</p>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
