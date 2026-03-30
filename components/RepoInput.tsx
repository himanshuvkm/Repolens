"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowRight, Loader2 } from "lucide-react";
import { GithubIcon as Github } from "@/components/GithubIcon";

const exampleRepos = ["vercel/next.js", "facebook/react", "shadcn-ui/ui"];

export function RepoInput() {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const navigate = (owner: string, repo: string) => {
    setLoading(true);
    router.push(`/report/${owner}/${repo}`);
  };

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmed = url.trim();
    if (!trimmed) {
      setError("Please enter a GitHub repository URL.");
      return;
    }

    try {
      const parsedUrl = new URL(trimmed);
      if (parsedUrl.hostname !== "github.com") throw new Error("Not github.com");

      const parts = parsedUrl.pathname.split("/").filter(Boolean);
      if (parts.length < 2) throw new Error("Missing owner/repo");

      navigate(parts[0], parts[1]);
    } catch {
      setError("Enter a valid GitHub URL — e.g. https://github.com/vercel/next.js");
    }
  };

  const handleChipClick = (exampleRepo: string) => {
    setUrl(`https://github.com/${exampleRepo}`);
    const [owner, repo] = exampleRepo.split("/");
    navigate(owner, repo);
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      <form onSubmit={handleAnalyze} id="analyzer" className="relative group scroll-mt-32">
        {/* Glow */}
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-primary-container/20 rounded-2xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

        <div className="relative flex flex-col sm:flex-row gap-2.5 p-2 bg-surface-container-low rounded-2xl ring-1 ring-white/[0.07] shadow-2xl">
          {/* Input */}
          <div className="flex flex-1 items-center px-4 gap-3 bg-surface-container-lowest rounded-xl min-w-0">
            <Search className="w-4 h-4 text-outline shrink-0" />
            <input
              type="url"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                if (error) setError("");
              }}
              placeholder="https://github.com/facebook/react"
              className="w-full py-3.5 bg-transparent border-none focus:ring-0 text-on-surface placeholder:text-on-surface-variant/40 text-sm outline-none min-w-0"
              autoComplete="off"
              spellCheck={false}
            />
            {url && (
              <button
                type="button"
                onClick={() => setUrl("")}
                className="shrink-0 text-on-surface-variant/40 hover:text-on-surface-variant text-sm font-medium transition-colors"
                aria-label="Clear input"
              >
                ✕
              </button>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-primary-container to-primary text-on-primary-container px-7 py-3.5 rounded-xl font-bold text-sm transition-all active:scale-[0.97] shadow-lg shadow-primary/20 whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                Analyze
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Error */}
      {error && (
        <p className="text-error mt-3 text-center text-xs font-medium animate-in fade-in slide-in-from-top-2">
          {error}
        </p>
      )}

      {/* Example chips */}
      <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3 flex-wrap">
        <span className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant/50">Try:</span>
        <div className="flex flex-wrap justify-center gap-2">
          {exampleRepos.map((repo) => (
            <button
              key={repo}
              type="button"
              onClick={() => handleChipClick(repo)}
              disabled={loading}
              className="px-3.5 py-1.5 rounded-full bg-surface-container-low border border-outline-variant/10 text-xs font-medium text-on-surface-variant hover:bg-surface-container-high hover:text-primary hover:border-primary/20 transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              <Github className="w-3.5 h-3.5" />
              {repo}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}