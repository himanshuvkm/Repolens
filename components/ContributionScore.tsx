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
      ? "Clear CONTRIBUTING.md and active discussions."
      : score >= 40
      ? "Basic docs, but PR turnover may be slow."
      : "Lacks documentation or rigid contribution patterns.";
  const healthLabel = score >= 70 ? "High" : score >= 40 ? "Medium" : "Low";

  const barColor =
    score >= 70
      ? "bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.4)]"
      : score >= 40
      ? "bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.4)]"
      : "bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.4)]";

  const scoreColor =
    score >= 70 ? "text-green-400" : score >= 40 ? "text-yellow-400" : "text-red-400";

  const heartColor = score >= 70 ? "text-primary fill-primary/20" : "text-on-surface-variant";

  return (
    <div className="glass p-6 rounded-2xl border border-outline-variant/5 flex flex-col justify-between h-full relative">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-[10px] font-black tracking-[0.2em] uppercase text-on-surface-variant">
          Contribution Ease
        </h3>
        <Heart className={`w-4 h-4 shrink-0 ${heartColor}`} />
      </div>

      {/* Score number + label */}
      <div className="flex items-baseline gap-2 mb-4">
        <span className={`text-4xl font-black tabular-nums leading-none ${scoreColor}`}>
          {displayScore}
        </span>
        <span className="text-on-surface-variant/50 text-sm font-medium">/100</span>
        <span className={`ml-1 text-[11px] font-bold uppercase tracking-wider ${scoreColor}`}>
          {statusText}
        </span>
      </div>

      {/* Bar + labels */}
      <div className="space-y-2.5 mt-auto">
        <div className="flex justify-between text-[11px]">
          <span className="font-semibold text-on-surface-variant">Onboarding Health</span>
          <span className="text-primary font-bold">{healthLabel}</span>
        </div>
        <div className="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-1000 ease-out ${barColor}`}
            style={{ width: `${displayScore}%` }}
          />
        </div>
        <p className="text-[11px] text-on-surface-variant/70 leading-snug">{statusDesc}</p>
      </div>
    </div>
  );
}