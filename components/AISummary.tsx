"use client";

import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Sparkles, RefreshCw, AlertCircle } from "lucide-react";

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
    <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-full">
      <div className="bg-gradient-to-r from-blue-900/40 to-indigo-900/40 p-4 border-b border-gray-800 flex items-center justify-between">
        <h3 className="text-white font-semibold flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-blue-400" /> AI Repository Analysis
        </h3>
        {error && (
          <button 
            onClick={fetchSummary}
            className="text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Retry
          </button>
        )}
      </div>
      
      <div className="p-6 overflow-y-auto custom-scrollbar flex-grow prose prose-invert prose-blue max-w-none">
        {summary ? (
          <div className="markdown-body text-gray-300 text-sm leading-relaxed">
            <ReactMarkdown>{summary}</ReactMarkdown>
            {loading && (
              <span className="inline-block w-2 h-4 bg-blue-500 animate-pulse ml-1 align-middle" />
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-48 text-gray-500">
            {error ? (
              <>
                <AlertCircle className="w-8 h-8 mb-3 text-red-500/50" />
                <p>Failed to generate analysis.</p>
              </>
            ) : (
              <>
                <Sparkles className="w-8 h-8 mb-3 text-blue-500/50 animate-pulse" />
                <p className="animate-pulse">Generating insights with Gemini 2.0...</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
