"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";

interface ContributionScoreProps {
  score: number;
}

export function ContributionScore({ score }: ContributionScoreProps) {
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setDisplayScore(score), 400);
    return () => clearTimeout(t);
  }, [score]);

  const statusText =
    score >= 70 ? "Very Welcoming" : score >= 40 ? "Moderate" : "Hard to Contribute";
  const statusDesc =
    score >= 70
      ? "Clear CONTRIBUTING docs and visible contributor pathways."
      : score >= 40
        ? "Basic docs exist, but PR turnover may be slow."
        : "Lacks documentation or has rigid contribution patterns.";
  const healthLabel = score >= 70 ? "High" : score >= 40 ? "Medium" : "Low";

  const barColor =
    score >= 70
      ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.25)]"
      : score >= 40
        ? "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.25)]"
        : "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.25)]";

  const scoreColor =
    score >= 70 ? "text-green-500" : score >= 40 ? "text-amber-500" : "text-red-500";

  const heartColor = score >= 70 ? "text-accent fill-accent/20" : "text-muted";

  return (
    <div className="metric-card relative flex h-full flex-col justify-between rounded-[1.75rem] p-6">
      <div className="mb-4 flex items-start justify-between">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted">Contribution Ease</h3>
        <Heart className={`h-4 w-4 shrink-0 ${heartColor}`} />
      </div>

      <div className="mb-4 flex items-baseline gap-2">
        <span className={`text-4xl font-black leading-none tabular-nums ${scoreColor}`}>{displayScore}</span>
        <span className="text-sm font-medium text-muted/70">/100</span>
        <span className={`ml-1 text-[11px] font-bold uppercase tracking-wider ${scoreColor}`}>{statusText}</span>
      </div>

      <div className="mt-auto space-y-2.5">
        <div className="flex justify-between text-[11px]">
          <span className="font-semibold text-muted">Onboarding Health</span>
          <span className="font-bold text-accent">{healthLabel}</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-frame">
          <div className={`h-full rounded-full transition-all duration-1000 ease-out ${barColor}`} style={{ width: `${displayScore}%` }} />
        </div>
        <p className="text-[11px] leading-snug text-muted">{statusDesc}</p>
      </div>
    </div>
  );
}
