// ─────────────────────────────────────────────
// PRIntelligence.tsx
// ─────────────────────────────────────────────
import { Verified, Rocket, TrendingUp, Clock } from "lucide-react";
 
interface PRIntelligenceProps {
  verdict: string;
  mergeRate: number;
  avgMergeTimeDays: number;
  avgFirstReviewTimeDays: number;
}
 
export function PRIntelligence({
  verdict,
  mergeRate,
  avgMergeTimeDays,
  avgFirstReviewTimeDays,
}: PRIntelligenceProps) {
  const formattedMergeRate = (mergeRate * 100).toFixed(0);
  const formattedMergeTime =
    avgMergeTimeDays === 0
      ? "N/A"
      : avgMergeTimeDays < 1
      ? "< 24h"
      : `${avgMergeTimeDays.toFixed(1)}d`;
 
  const verdictMap: Record<string, string> = {
    Abandoned: "High Risk",
    "Great for contributions": "Welcoming",
    "Maintainer-only": "Closed",
  };
  const verdictShort = verdictMap[verdict] ?? "Optimized";
 
  const verdictColor =
    verdictShort === "High Risk"
      ? "text-red-400 bg-red-500/10 border-red-500/20"
      : verdictShort === "Welcoming"
      ? "text-green-400 bg-green-500/10 border-green-500/20"
      : "text-primary bg-primary/10 border-primary/20";
 
  return (
    <div className="glass p-6 rounded-2xl border border-outline-variant/5 bg-gradient-to-br from-primary/8 to-transparent flex flex-col justify-between h-full relative">
      <div className="flex justify-between items-start mb-5">
        <h3 className="text-[10px] font-black tracking-[0.2em] uppercase text-on-surface-variant">
          PR Intelligence
        </h3>
        <Verified className="w-4 h-4 text-primary shrink-0" />
      </div>
 
      {/* Verdict badge */}
      <div className={`self-start inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[11px] font-bold mb-5 ${verdictColor}`}>
        <Rocket className="w-3.5 h-3.5" />
        {verdictShort}
      </div>
 
      {/* Stats row */}
      <div className="grid grid-cols-2 gap-3 mt-auto">
        <div className="bg-surface-container-highest/60 rounded-xl p-3">
          <div className="flex items-center gap-1 text-on-surface-variant mb-1">
            <TrendingUp className="w-3 h-3" />
            <span className="text-[10px] uppercase tracking-wider font-semibold">Merge rate</span>
          </div>
          <span className="text-xl font-black text-on-surface">{formattedMergeRate}%</span>
        </div>
        <div className="bg-surface-container-highest/60 rounded-xl p-3">
          <div className="flex items-center gap-1 text-on-surface-variant mb-1">
            <Clock className="w-3 h-3" />
            <span className="text-[10px] uppercase tracking-wider font-semibold">Avg time</span>
          </div>
          <span className="text-xl font-black text-on-surface">{formattedMergeTime}</span>
        </div>
      </div>
    </div>
  );
}
 