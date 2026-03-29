"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { ArrowLeft, Star, GitFork, Eye, ExternalLink } from "lucide-react";
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

export default function ReportPage({ params }: { params: Promise<{ owner: string; repo: string }> }) {
  // Use React.use to unfold params Promise (Next.js 15+ convention for dynamic params on client)
  const resolvedParams = use(params);
  const { owner, repo } = resolvedParams;

  const [data, setData] = useState<RepoAnalysisData | null>(null);
  const [loadingStep, setLoadingStep] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

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
    return (
      <div className="container mx-auto px-4 py-32 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-24 h-24 mb-8 relative">
          <div className="absolute inset-0 rounded-full border-t-2 border-blue-500 animate-spin"></div>
          <div className="absolute inset-2 rounded-full border-r-2 border-indigo-400 animate-spin animation-delay-150"></div>
          <div className="absolute inset-4 rounded-full border-b-2 border-purple-400 animate-spin animation-delay-300"></div>
          <Github className="absolute inset-0 m-auto w-8 h-8 text-gray-500 animate-pulse" />
        </div>
        <div className="h-8 flex items-center justify-center">
          <p className="text-lg text-blue-400 font-medium animate-pulse">
            {steps[Math.min(loadingStep, steps.length - 1)]}
          </p>
        </div>
        <div className="w-64 h-1.5 bg-gray-800 rounded-full mt-6 overflow-hidden">
          <div 
            className="h-full bg-blue-500 transition-all duration-500 ease-out"
            style={{ width: `${(Math.min(loadingStep + 1, steps.length) / steps.length) * 100}%` }}
          ></div>
        </div>
      </div>
    );
  }

  const { metadata, commits, issues, fileTree, languages } = data;
  const maintScore = calculateMaintenanceScore(data);
  const contScore = calculateContributionScore(data);
  const prIntel = calculatePRIntelligence(data);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-700">
      <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to search
      </Link>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-10 pb-10 border-b border-gray-800">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Github className="w-8 h-8 text-gray-100" />
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white flex items-center gap-4">
              {owner} <span className="text-gray-600 font-light">/</span> {repo}
            </h1>
          </div>
          <p className="text-lg text-gray-400 mt-4 max-w-3xl leading-relaxed">
            {metadata.description || "No description provided."}
          </p>
          <div className="flex flex-wrap items-center gap-4 mt-6 text-sm">
            <div className="flex items-center gap-1.5 text-yellow-400 bg-yellow-400/10 px-3 py-1.5 rounded-full border border-yellow-400/20">
              <Star className="w-4 h-4 fill-current" /> {metadata.stars.toLocaleString()}
            </div>
            <div className="flex items-center gap-1.5 text-gray-300 bg-gray-800 px-3 py-1.5 rounded-full border border-gray-700">
              <GitFork className="w-4 h-4" /> {metadata.forks.toLocaleString()}
            </div>
            <div className="flex items-center gap-1.5 text-gray-300 bg-gray-800 px-3 py-1.5 rounded-full border border-gray-700">
              <Eye className="w-4 h-4" /> {metadata.watchers.toLocaleString()}
            </div>
            {metadata.license && (
              <div className="text-gray-300 bg-gray-800 px-3 py-1.5 rounded-full border border-gray-700 font-mono text-xs">
                ⚖️ {metadata.license}
              </div>
            )}
            <a href={`https://github.com/${owner}/${repo}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-blue-400 hover:text-blue-300 ml-auto md:ml-4 transition-colors">
              View on GitHub <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column - Main Insights */}
        <div className="lg:col-span-2 space-y-8 flex flex-col">
          {/* Scores Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <MaintenanceScore score={maintScore} />
            <ContributionScore score={contScore} />
            <PRIntelligence {...prIntel} />
          </div>

          {/* AI Summary - Flex grow to take up space nicely */}
          <div className="flex-grow min-h-[400px]">
            <AISummary repoData={data} />
          </div>
        </div>

        {/* Right Column - Secondary Data */}
        <div className="space-y-8">
          
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Languages</h3>
            <LanguageBar languages={languages} />
          </div>

          <DependencySnapshot owner={owner} repo={repo} tree={fileTree} />

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Recent Commits</h3>
            <div className="space-y-4">
              {commits.slice(0, 5).map((commit, i) => (
                <div key={commit.sha} className="flex flex-col border-l-2 border-gray-800 pl-4 py-1">
                  <span className="text-sm font-medium text-gray-200 truncate" title={commit.message}>
                    {commit.message}
                  </span>
                  <div className="flex items-center justify-between mt-1 text-xs text-gray-500">
                    <span>{commit.authorName}</span>
                    <span>{new Date(commit.date).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
              {commits.length === 0 && <p className="text-sm text-gray-500">No recent commits found.</p>}
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">File Structure (Top)</h3>
            <FileStructureTree tree={fileTree} />
          </div>

        </div>
      </div>
    </div>
  );
}
