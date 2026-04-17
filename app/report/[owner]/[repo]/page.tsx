"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { ArrowLeft, Star, GitFork, ExternalLink, History, Sparkles, ShieldCheck, Compass } from "lucide-react";
import { RepoAnalysisData } from "@/types";
import {
  calculateMaintenanceScore,
  calculateContributionScore,
  calculatePRIntelligence,
} from "@/lib/scoring";
import { MaintenanceScore } from "@/components/MaintenanceScore";
import { ContributionScore } from "@/components/ContributionScore";
import { PRIntelligence } from "@/components/PRIntelligence";
import { FileStructureTree } from "@/components/FileStructureTree";
import { LanguageBar } from "@/components/LanguageBar";
import { AISummary } from "@/components/AISummary";
import { DependencySnapshot } from "@/components/DependencySnapshot";
import { ReportLoading } from "@/components/ReportLoading";
import { ReportSidebar } from "@/components/ReportSidebar";

export default function ReportPage({ params }: { params: Promise<{ owner: string; repo: string }> }) {
  const resolvedParams = use(params);
  const { owner, repo } = resolvedParams;

  const [data, setData] = useState<RepoAnalysisData | null>(null);
  const [loadingStep, setLoadingStep] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overall");

  useEffect(() => {
    let isMounted = true;
    let stepInterval: NodeJS.Timeout;

    const fetchData = async () => {
      try {
        setLoadingStep(1);
        stepInterval = setInterval(() => {
          setLoadingStep((prev) => (prev < 4 ? prev + 1 : prev));
        }, 1500);

        const res = await fetch(`/api/analyze?owner=${owner}&repo=${repo}`);
        if (!res.ok) {
          const errData = (await res.json()) as { error?: string };
          throw new Error(errData.error || "Failed to fetch repository data");
        }

        const json = (await res.json()) as RepoAnalysisData;

        if (isMounted) {
          clearInterval(stepInterval);
          setLoadingStep(5);
          setTimeout(() => setData(json), 500);
        }
      } catch (err) {
        if (isMounted) {
          clearInterval(stepInterval);
          setError(err instanceof Error ? err.message : "An unexpected error occurred");
        }
      }
    };

    void fetchData();

    return () => {
      isMounted = false;
      if (stepInterval) clearInterval(stepInterval);
    };
  }, [owner, repo]);

  if (error) {
    return (
      <div className="container mx-auto flex flex-col items-center justify-center px-4 py-20 text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-500/10 text-red-400">
          <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="mb-4 font-display text-4xl text-ink">Analysis Failed</h2>
        <p className="mb-8 max-w-md text-muted">{error}</p>
        <Link href="/" className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 font-medium text-paper transition-colors hover:bg-[#11140e]">
          <ArrowLeft className="h-4 w-4" /> Try another repository
        </Link>
      </div>
    );
  }

  if (!data) {
    return <ReportLoading owner={owner} repo={repo} step={loadingStep} />;
  }

  const { metadata, commits, fileTree, languages } = data;
  const maintScore = calculateMaintenanceScore(data);
  const contScore = calculateContributionScore(data);
  const prIntel = calculatePRIntelligence(data);
  const repoHealthLabel = maintScore >= 80 ? "Robust" : maintScore >= 55 ? "Steady" : "Fragile";

  return (
    <div className="flex w-full">
      <ReportSidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="mx-auto w-full max-w-7xl flex-1 animate-in fade-in zoom-in-95 p-5 duration-500 md:ml-64 lg:p-10">
        <header className="panel-card mb-10 space-y-8 rounded-[2.4rem] p-7 md:p-10">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-ink">
            <ArrowLeft className="h-4 w-4" /> Back to search
          </Link>

          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-frame bg-canvas px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">
                  Repository Dossier
                </span>
                <span className="rounded-full bg-accent px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-accent-foreground">
                  {repoHealthLabel}
                </span>
              </div>
              <div className="mt-3 flex items-center gap-3">
                <h1 className="font-display text-5xl tracking-[-0.05em] text-ink md:text-7xl">
                  {owner}
                  <span className="font-light text-accent">/</span>
                  {repo}
                </h1>
                <span className="rounded-full border border-frame bg-panel px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-muted">
                  Public
                </span>
              </div>
              <p className="max-w-2xl text-lg leading-relaxed text-muted">
                {metadata.description || "No description provided. Repository analysis is assembled from live GitHub metadata and RepoLens scoring logic."}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.6rem] border border-frame bg-canvas p-5">
                <p className="text-[10px] uppercase tracking-[0.22em] text-muted">Repository pulse</p>
                <div className="mt-4 flex items-end gap-2">
                  <span className="font-display text-5xl text-ink">{maintScore}</span>
                  <span className="pb-2 text-sm text-muted">/100</span>
                </div>
                <p className="mt-3 text-sm leading-7 text-muted">{prIntel.verdict}</p>
              </div>
              <div className="rounded-[1.6rem] border border-frame bg-ink p-5 text-paper">
                <p className="text-[10px] uppercase tracking-[0.22em] text-paper/60">Key stats</p>
                <div className="mt-4 flex flex-wrap gap-3 text-sm">
                  <div className="flex items-center gap-2 rounded-full bg-paper/10 px-3 py-2">
                    <Star className="h-4 w-4" /> {metadata.stars.toLocaleString()}
                  </div>
                  <div className="flex items-center gap-2 rounded-full bg-paper/10 px-3 py-2">
                    <GitFork className="h-4 w-4" /> {metadata.forks.toLocaleString()}
                  </div>
                </div>
                {metadata.license && <p className="mt-4 text-sm text-paper/70">{metadata.license}</p>}
              </div>
            </div>
          </div>

          <div className="grid gap-4 border-t border-frame pt-7 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
            <div className="rounded-[1.4rem] border border-frame bg-panel p-4">
              <div className="mb-2 flex items-center gap-2 text-muted">
                <ShieldCheck className="h-4 w-4 text-accent" />
                <span className="text-[10px] uppercase tracking-[0.2em]">Health Summary</span>
              </div>
              <p className="text-sm leading-7 text-ink">
                {maintScore >= 80
                  ? "Active stewardship and strong merge hygiene."
                  : maintScore >= 55
                    ? "Usable project with some response friction."
                    : "Needs care before depending on it heavily."}
              </p>
            </div>
            <div className="rounded-[1.4rem] border border-frame bg-panel p-4">
              <div className="mb-2 flex items-center gap-2 text-muted">
                <Compass className="h-4 w-4 text-teal" />
                <span className="text-[10px] uppercase tracking-[0.2em]">Core Tech</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {languages &&
                  Object.entries(languages)
                    .slice(0, 3)
                    .map(([name]) => (
                      <span key={name} className="rounded-full bg-canvas px-3 py-1 text-xs font-semibold text-ink">
                        {name}
                      </span>
                    ))}
              </div>
            </div>
            <div className="rounded-[1.4rem] border border-frame bg-panel p-4">
              <div className="mb-2 flex items-center gap-2 text-muted">
                <Sparkles className="h-4 w-4 text-accent" />
                <span className="text-[10px] uppercase tracking-[0.2em]">Contribution Ease</span>
              </div>
              <p className="font-display text-4xl text-ink">{contScore}</p>
            </div>
            <a
              href={`https://github.com/${owner}/${repo}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-[1.4rem] border border-frame bg-panel p-4 transition hover:-translate-y-0.5 hover:bg-canvas"
            >
              <div className="mb-2 flex items-center gap-2 text-muted">
                <ExternalLink className="h-4 w-4 text-ink" />
                <span className="text-[10px] uppercase tracking-[0.2em]">Source</span>
              </div>
              <p className="text-sm leading-7 text-ink">Open the repository on GitHub</p>
            </a>
          </div>
        </header>

        {activeTab === "overall" && (
          <>
            <section className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-3">
              <MaintenanceScore score={maintScore} />
              <ContributionScore score={contScore} />
              <PRIntelligence {...prIntel} />
            </section>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
              <div className="space-y-8 lg:col-span-4">
                <FileStructureTree tree={fileTree} />

                <section className="panel-card rounded-[1.9rem] p-6">
                  <h2 className="mb-6 flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-muted">
                    <History className="h-5 w-5 text-accent" />
                    Recent Activity
                  </h2>
                  <div className="relative space-y-6">
                    <div className="absolute bottom-2 left-[9px] top-2 w-[2px] bg-frame"></div>
                    {commits.slice(0, 5).map((commit, i) => (
                      <div key={commit.sha} className="relative pl-8">
                        <div className={`absolute left-0 top-1 h-5 w-5 rounded-full border-4 border-paper ${i === 0 ? "bg-accent" : "bg-frame"}`}></div>
                        <p className="truncate pr-2 text-xs font-bold text-ink">{commit.message}</p>
                        <p className="mt-1 text-[11px] text-muted">Committed by {commit.authorName}</p>
                        <span className={`text-[10px] font-medium ${i === 0 ? "text-accent" : "text-muted"}`}>
                          {new Date(commit.date).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                    {commits.length === 0 && <p className="text-xs text-muted">No recent commits found.</p>}
                  </div>
                </section>
              </div>

              <div className="space-y-8 lg:col-span-8">
                <AISummary repoData={data} />

                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                  <LanguageBar languages={languages} />
                  <DependencySnapshot owner={owner} repo={repo} tree={fileTree} />
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === "file-tree" && (
          <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
            <FileStructureTree tree={fileTree} />
          </div>
        )}

        {activeTab === "activity" && (
          <div className="mx-auto max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            <section className="panel-card rounded-[1.9rem] p-6">
              <h2 className="mb-6 flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-muted">
                <History className="h-5 w-5 text-accent" />
                Recent Activity
              </h2>
              <div className="relative space-y-6">
                <div className="absolute bottom-2 left-[9px] top-2 w-[2px] bg-frame"></div>
                {commits.slice(0, 20).map((commit, i) => (
                  <div key={commit.sha} className="relative pl-8">
                    <div className={`absolute left-0 top-1 h-5 w-5 rounded-full border-4 border-paper ${i === 0 ? "bg-accent" : "bg-frame"}`}></div>
                    <p className="pr-2 text-sm font-bold text-ink">{commit.message}</p>
                    <p className="mt-1 text-[11px] text-muted">
                      Committed by {commit.authorName} · {commit.sha.substring(0, 7)}
                    </p>
                    <span className={`text-[10px] font-medium ${i === 0 ? "text-accent" : "text-muted"}`}>
                      {new Date(commit.date).toLocaleDateString()}
                    </span>
                  </div>
                ))}
                {commits.length === 0 && <p className="text-xs text-muted">No recent commits found.</p>}
              </div>
            </section>
          </div>
        )}

        {activeTab === "insights" && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <AISummary repoData={data} />
            <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <PRIntelligence {...prIntel} />
              <MaintenanceScore score={maintScore} />
              <ContributionScore score={contScore} />
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
