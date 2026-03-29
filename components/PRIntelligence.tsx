import { GitMerge, Clock, AlertCircle } from "lucide-react";

interface Props {
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
}: Props) {

  let badgeColor = "bg-blue-500/20 text-blue-400 border-blue-500/30";
  if (verdict === "Abandoned") badgeColor = "bg-red-500/20 text-red-400 border-red-500/30";
  else if (verdict === "Great for contributions") badgeColor = "bg-green-500/20 text-green-400 border-green-500/30";
  else if (verdict === "Maintainer-only") badgeColor = "bg-gray-800 text-gray-400 border-gray-700";

  return (
    <div className="flex flex-col h-full bg-gray-900 border border-gray-800 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-gray-300 font-medium flex items-center gap-2">
          <GitMerge className="w-5 h-5 text-indigo-400" /> Pull Request Intelligence
        </h3>
        <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${badgeColor} uppercase tracking-wide`}>
          {verdict}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 flex-grow">
        <div className="bg-gray-950 rounded-xl p-4 flex flex-col justify-center border border-gray-800/50">
          <p className="text-gray-500 text-xs font-medium uppercase mb-1 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" /> Avg Merge Time
          </p>
          <p className="text-2xl font-bold text-gray-100">
            {avgMergeTimeDays === 0 ? "N/A" : avgMergeTimeDays < 1 ? "< 24h" : `${avgMergeTimeDays.toFixed(1)} days`}
          </p>
        </div>

        <div className="bg-gray-950 rounded-xl p-4 flex flex-col justify-center border border-gray-800/50">
          <p className="text-gray-500 text-xs font-medium uppercase mb-1 flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5" /> First Review
          </p>
          <p className="text-2xl font-bold text-gray-100">
            {avgFirstReviewTimeDays === 0 ? "N/A" : avgFirstReviewTimeDays < 1 ? "< 24h" : `${avgFirstReviewTimeDays.toFixed(1)} days`}
          </p>
        </div>

        <div className="col-span-2 bg-gray-950 rounded-xl p-4 flex flex-col justify-center border border-gray-800/50">
          <div className="flex justify-between items-end mb-2">
            <p className="text-gray-500 text-xs font-medium uppercase flex items-center gap-1.5">
              <GitMerge className="w-3.5 h-3.5" /> PR Merge Rate
            </p>
            <span className="text-xl font-bold text-gray-200">{(mergeRate * 100).toFixed(0)}%</span>
          </div>

          <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500 rounded-full transition-all duration-1000"
              style={{ width: `${mergeRate * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
