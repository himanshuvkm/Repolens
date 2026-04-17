"use client";

import { useEffect, useState } from "react";
import { Wand2 } from "lucide-react";

interface MaintenanceScoreProps {
  score: number;
}

export function MaintenanceScore({ score }: MaintenanceScoreProps) {
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setDisplayScore(score), 300);
    return () => clearTimeout(t);
  }, [score]);

  const statusTitle =
    score >= 80 ? "Excellent" : score >= 50 ? "Needs Attention" : "Poorly Maintained";
  const statusDesc =
    score >= 80
      ? "Frequent commits and high PR resolution rate."
      : score >= 50
        ? "Maintenance is stalling, but still active."
        : "Inactive repository with mounting unresolved issues.";

  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (displayScore / 100) * circumference;

  const scoreColor =
    score >= 80 ? "text-green-500" : score >= 50 ? "text-amber-500" : "text-red-500";
  const trackColor = score >= 80 ? "#2f9e44" : score >= 50 ? "#d97706" : "#dc2626";

  return (
    <div className="metric-card relative flex h-full flex-col overflow-hidden rounded-[1.75rem] p-6">
      <div className="pointer-events-none absolute -right-4 -top-4 h-24 w-24 rounded-full bg-accent/10 blur-3xl"></div>

      <div className="relative z-10 mb-5 flex items-start justify-between">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted">Maintenance Score</h3>
        <Wand2 className="h-4 w-4 text-accent" />
      </div>

      <div className="relative z-10 flex items-center gap-5">
        <div className="relative h-[80px] w-[80px] shrink-0">
          <svg className="h-full w-full -rotate-90" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r={radius} fill="transparent" stroke="currentColor" strokeWidth="6" className="text-frame" />
            <circle
              cx="40"
              cy="40"
              r={radius}
              fill="transparent"
              stroke={trackColor}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)" }}
            />
          </svg>
          <div className={`absolute inset-0 flex items-center justify-center text-lg font-black ${scoreColor}`}>{displayScore}</div>
        </div>

        <div className="min-w-0">
          <p className={`mb-1 text-xs font-bold uppercase tracking-widest ${scoreColor}`}>{statusTitle}</p>
          <p className="text-[11px] leading-snug text-muted">{statusDesc}</p>
        </div>
      </div>
    </div>
  );
}
