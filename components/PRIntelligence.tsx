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
  void avgFirstReviewTimeDays;
  const formattedMergeRate = (mergeRate * 100).toFixed(0);
  const formattedMergeTime =
    avgMergeTimeDays === 0 ? "N/A" : avgMergeTimeDays < 1 ? "< 24h" : `${avgMergeTimeDays.toFixed(1)}d`;

  const verdictMap: Record<string, string> = {
    Abandoned: "High Risk",
    "Great for contributions": "Welcoming",
    "Maintainer-only": "Closed",
  };
  const verdictShort = verdictMap[verdict] ?? "Optimized";

  const verdictColor =
    verdictShort === "High Risk"
      ? "border-red-200 bg-red-50 text-red-600"
      : verdictShort === "Welcoming"
        ? "border-green-200 bg-green-50 text-green-600"
        : "border-accent/30 bg-accent/10 text-accent";

  return (
    <div className="metric-card relative flex h-full flex-col justify-between rounded-[1.75rem] p-6">
      <div className="mb-5 flex items-start justify-between">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted">PR Intelligence</h3>
        <Verified className="h-4 w-4 shrink-0 text-accent" />
      </div>

      <div className={`mb-5 inline-flex self-start items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[11px] font-bold ${verdictColor}`}>
        <Rocket className="h-3.5 w-3.5" />
        {verdictShort}
      </div>

      <div className="mt-auto grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-frame bg-panel p-3">
          <div className="mb-1 flex items-center gap-1 text-muted">
            <TrendingUp className="h-3 w-3" />
            <span className="text-[10px] font-semibold uppercase tracking-wider">Merge rate</span>
          </div>
          <span className="text-xl font-black text-ink">{formattedMergeRate}%</span>
        </div>
        <div className="rounded-xl border border-frame bg-panel p-3">
          <div className="mb-1 flex items-center gap-1 text-muted">
            <Clock className="h-3 w-3" />
            <span className="text-[10px] font-semibold uppercase tracking-wider">Avg time</span>
          </div>
          <span className="text-xl font-black text-ink">{formattedMergeTime}</span>
        </div>
      </div>
    </div>
  );
}
