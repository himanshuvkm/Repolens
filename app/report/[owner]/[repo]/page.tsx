"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { ArrowLeft, Star, GitFork, Eye, ExternalLink, History } from "lucide-react";
import { GithubIcon as Github } from "@/components/GithubIcon";
import { RepoAnalysisData } from "@/types";
import { 
  calculateMaintenanceScore, 
  calculateContributionScore, 
  calculatePRIntelligence 
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
  // Use React.use to unfold params Promise (Next.js 15+ convention for dynamic params on client)
  const resolvedParams = use(params);
  const { owner, repo } = resolvedParams;

  const [data, setData] = useState<RepoAnalysisData | null>(null);
  const [loadingStep, setLoadingStep] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overall");

  const steps = [
    "Preparing analysis engine...",
    "Fetching repository metadata...",
    "Analyzing commit history and PRs...",
    "Scanning file structure...",
    "Finalizing metrics..."
  ];

  useEffect(() => {
    let isMounted = true;
    let stepInterval: NodeJS.Timeout;

    const fetchData = async () => {
      try {
        setLoadingStep(1);
        stepInterval = setInterval(() => {
          setLoadingStep(prev => (prev < 4 ? prev + 1 : prev));
        }, 1500);

        const res = await fetch(`/api/analyze?owner=${owner}&repo=${repo}`);
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || "Failed to fetch repository data");
        }
        
        const json = await res.json();
        
        if (isMounted) {
          clearInterval(stepInterval);
          setLoadingStep(5);
          setTimeout(() => setData(json), 500);
        }
      } catch (err: any) {
        if (isMounted) {
          clearInterval(stepInterval);
          setError(err.message || "An unexpected error occurred");
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
      if (stepInterval) clearInterval(stepInterval);
    };
  }, [owner, repo]);

  if (error) {
    return (
      <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6 text-red-400">
          <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold mb-4">Analysis Failed</h2>
        <p className="text-gray-400 max-w-md mb-8">{error}</p>
        <Link href="/" className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-medium transition-colors inline-flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Try another repository
        </Link>
      </div>
    );
  }

  if (!data) {
    return <ReportLoading owner={owner} repo={repo} step={loadingStep} />;
  }

  const { metadata, commits, issues, fileTree, languages } = data;
  const maintScore = calculateMaintenanceScore(data);
  const contScore = calculateContributionScore(data);
  const prIntel = calculatePRIntelligence(data);

  return (
    <div className="flex w-full">
      <ReportSidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex-1 md:ml-64 p-6 lg:p-10 max-w-7xl mx-auto w-full animate-in fade-in zoom-in-95 duration-500">
        <header className="mb-10 space-y-6">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-on-surface-variant hover:text-white mb-2 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to search
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h1 className="text-4xl font-black tracking-tight text-on-surface">
                  {owner}<span className="text-primary-container font-light">/</span>{repo}
                </h1>
                <span className="bg-surface-variant px-3 py-1 rounded-full text-[10px] font-bold tracking-widest text-primary uppercase border border-outline-variant/20">
                  Public
                </span>
              </div>
              <p className="text-on-surface-variant max-w-2xl text-lg leading-relaxed font-light">
                {metadata.description || "No description provided. Repository analysis automatically generated via Gemini 2.0 AI."}
              </p>
            </div>
            
            <div className="flex flex-wrap gap-4 text-sm mt-4 md:mt-0">
              <div className="flex items-center gap-2 bg-surface-container-low px-4 py-2 rounded-xl text-primary font-bold">
                <Star className="w-5 h-5" /> {metadata.stars.toLocaleString()}
              </div>
              <div className="flex items-center gap-2 bg-surface-container-low px-4 py-2 rounded-xl text-primary font-bold">
                <GitFork className="w-5 h-5" /> {metadata.forks.toLocaleString()}
              </div>
              {metadata.license && (
                <div className="flex items-center gap-2 flex-wrap bg-surface-container-low px-4 py-2 rounded-xl border border-outline-variant/10 text-on-surface-variant font-medium text-xs font-mono">
                  ⚖️ {metadata.license}
                </div>
              )}
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 border-t border-outline-variant/10 pt-6">
            <span className="text-[10px] text-on-surface-variant uppercase tracking-widest font-black mr-2">Core Tech:</span>
            {languages && Object.entries(languages).slice(0, 3).map(([name]) => (
              <span key={name} className="px-3 py-1 bg-surface-container-highest rounded-full text-xs font-bold tracking-tight text-primary">
                {name}
              </span>
            ))}
            <a href={`https://github.com/${owner}/${repo}`} target="_blank" rel="noopener noreferrer" className="ml-auto flex items-center gap-2 text-xs text-on-surface-variant hover:text-white transition-colors">
              <ExternalLink className="w-3.5 h-3.5" /> View on GitHub
            </a>
          </div>
        </header>

        {/* Dynamic Content Based on activeTab */}
        {activeTab === "overall" && (
          <>
            {/* Score Cards Row */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <MaintenanceScore score={maintScore} />
              <ContributionScore score={contScore} />
              <PRIntelligence {...prIntel} />
            </section>

            {/* Main Layout Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* LEFT COLUMN */}
              <div className="lg:col-span-4 space-y-8">
                <FileStructureTree tree={fileTree} />

                {/* Activity Timeline */}
                <section className="bg-surface-container-low rounded-2xl p-6 border border-white/5">
                  <h2 className="text-xs font-black uppercase tracking-[0.2em] text-on-surface-variant flex items-center gap-2 mb-6">
                    <History className="text-primary w-5 h-5" />
                    Recent Activity
                  </h2>
                  <div className="space-y-6 relative">
                    <div className="absolute left-[9px] top-2 bottom-2 w-[2px] bg-surface-container-highest"></div>
                    {commits.slice(0, 5).map((commit, i) => (
                      <div key={commit.sha} className="relative pl-8">
                        <div className={`absolute left-0 top-1 w-5 h-5 rounded-full border-4 border-surface-container-low ${i === 0 ? 'bg-primary-container' : 'bg-surface-container-highest'}`}></div>
                        <p className="text-xs font-bold text-on-surface truncate pr-2">{commit.message}</p>
                        <p className="text-[11px] text-on-surface-variant mt-1">Commited by {commit.authorName}</p>
                        <span className={`text-[10px] font-medium ${i === 0 ? 'text-primary' : 'text-on-surface-variant'}`}>{new Date(commit.date).toLocaleDateString()}</span>
                      </div>
                    ))}
                    {commits.length === 0 && <p className="text-xs text-on-surface-variant">No recent commits found.</p>}
                  </div>
                </section>
              </div>

              {/* RIGHT COLUMN */}
              <div className="lg:col-span-8 space-y-8">
                <AISummary repoData={data} />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
          <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Activity Timeline Detailed */}
            <section className="bg-surface-container-low rounded-2xl p-6 border border-white/5">
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-on-surface-variant flex items-center gap-2 mb-6">
                <History className="text-primary w-5 h-5" />
                Recent Activity
              </h2>
              <div className="space-y-6 relative">
                <div className="absolute left-[9px] top-2 bottom-2 w-[2px] bg-surface-container-highest"></div>
                {commits.slice(0, 20).map((commit, i) => (
                  <div key={commit.sha} className="relative pl-8">
                    <div className={`absolute left-0 top-1 w-5 h-5 rounded-full border-4 border-surface-container-low ${i === 0 ? 'bg-primary-container' : 'bg-surface-container-highest'}`}></div>
                    <p className="text-sm font-bold text-on-surface pr-2">{commit.message}</p>
                    <p className="text-[11px] text-on-surface-variant mt-1">Commited by {commit.authorName} • {commit.sha.substring(0, 7)}</p>
                    <span className={`text-[10px] font-medium ${i === 0 ? 'text-primary' : 'text-on-surface-variant'}`}>{new Date(commit.date).toLocaleDateString()}</span>
                  </div>
                ))}
                {commits.length === 0 && <p className="text-xs text-on-surface-variant">No recent commits found.</p>}
              </div>
            </section>
          </div>
        )}

        {activeTab === "insights" && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <AISummary repoData={data} />
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
