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
      setError("Enter a valid GitHub URL, for example https://github.com/vercel/next.js");
    }
  };

  const handleChipClick = (exampleRepo: string) => {
    setUrl(`https://github.com/${exampleRepo}`);
    const [owner, repo] = exampleRepo.split("/");
    navigate(owner, repo);
  };

  return (
    <div className="mx-auto w-full max-w-5xl px-5 md:px-8">
      <form onSubmit={handleAnalyze} id="analyzer" className="panel-card relative scroll-mt-32 overflow-hidden rounded-[2rem] p-4 md:p-5">
        <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,#1ca9c9_0%,#dd8330_55%,#1f231c_100%)]" />
        <div className="mb-4 flex items-center justify-between gap-4 px-2">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-muted">Analyze a repository</p>
            <p className="mt-1 text-sm text-muted">Paste any public GitHub repository URL to generate the report.</p>
          </div>
          <div className="hidden rounded-full border border-frame bg-canvas px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted md:block">
            Live GitHub fetch
          </div>
        </div>

        <div className="relative flex flex-col gap-3 md:flex-row">
          <div className="flex min-w-0 flex-1 items-center gap-3 rounded-[1.5rem] border border-frame bg-canvas px-5">
            <Search className="h-4 w-4 shrink-0 text-muted" />
            <input
              type="url"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                if (error) setError("");
              }}
              placeholder="https://github.com/facebook/react"
              className="min-w-0 w-full bg-transparent py-4 text-sm text-ink outline-none placeholder:text-muted/70"
              autoComplete="off"
              spellCheck={false}
            />
            {url && (
              <button
                type="button"
                onClick={() => setUrl("")}
                className="shrink-0 text-sm font-medium text-muted transition-colors hover:text-ink"
                aria-label="Clear input"
              >
                x
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-[1.5rem] bg-ink px-8 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-paper transition hover:-translate-y-0.5 hover:bg-[#11140e] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                Analyze
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </form>

      {error && (
        <p className="mt-3 text-center text-xs font-medium text-error animate-in fade-in slide-in-from-top-2">
          {error}
        </p>
      )}

      <div className="mt-7 flex flex-col flex-wrap items-center justify-center gap-3 sm:flex-row">
        <span className="text-[10px] uppercase tracking-[0.2em] text-muted">Popular:</span>
        <div className="flex flex-wrap justify-center gap-2">
          {exampleRepos.map((repo) => (
            <button
              key={repo}
              type="button"
              onClick={() => handleChipClick(repo)}
              disabled={loading}
              className="flex items-center gap-1.5 rounded-full border border-frame bg-panel px-4 py-2 text-xs font-medium text-muted transition-all hover:-translate-y-0.5 hover:border-ink hover:text-ink disabled:opacity-50"
            >
              <Github className="h-3.5 w-3.5" />
              {repo}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
