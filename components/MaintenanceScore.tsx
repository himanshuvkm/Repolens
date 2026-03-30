// ─────────────────────────────────────────────
// MaintenanceScore.tsx
// ─────────────────────────────────────────────
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
      : "Inactive — mounting unresolved issues.";
 
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (displayScore / 100) * circumference;
 
  const scoreColor =
    score >= 80 ? "text-green-400" : score >= 50 ? "text-yellow-400" : "text-red-400";
  const trackColor =
    score >= 80 ? "#4ade80" : score >= 50 ? "#facc15" : "#f87171";
 
  return (
    <div className="glass p-6 rounded-2xl border border-outline-variant/5 flex flex-col h-full relative overflow-hidden group">
      <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/5 rounded-full blur-3xl transition-all group-hover:bg-primary/10 pointer-events-none"></div>
 
      <div className="flex justify-between items-start mb-5 relative z-10">
        <h3 className="text-[10px] font-black tracking-[0.2em] uppercase text-on-surface-variant">
          Maintenance Score
        </h3>
        <Wand2 className="w-4 h-4 text-primary" />
      </div>
 
      <div className="flex items-center gap-5 relative z-10">
        {/* Ring */}
        <div className="relative w-[80px] h-[80px] shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
            <circle
              cx="40" cy="40" r={radius} fill="transparent"
              stroke="currentColor" strokeWidth="6"
              className="text-surface-container-highest"
            />
            <circle
              cx="40" cy="40" r={radius} fill="transparent"
              stroke={trackColor} strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)" }}
            />
          </svg>
          <div className={`absolute inset-0 flex items-center justify-center text-lg font-black ${scoreColor}`}>
            {displayScore}
          </div>
        </div>
 
        <div className="min-w-0">
          <p className={`text-xs font-bold uppercase tracking-widest mb-1 ${scoreColor}`}>
            {statusTitle}
          </p>
          <p className="text-[11px] text-on-surface-variant leading-snug">{statusDesc}</p>
        </div>
      </div>
    </div>
  );
}
 