import { Loader2, CheckCircle2, Brain, Zap } from "lucide-react";

export function ReportLoading({ owner, repo, step }: { owner: string; repo: string; step: number }) {
  const steps = [
    {
      label: "Fetching repo metadata",
      sublabel: step >= 2 ? "Data established" : "Initializing clone",
      activeRange: [1, 1],
      doneAt: 2,
    },
    {
      label: "Analyzing activity",
      sublabel: step >= 4 ? "Analysis complete" : "Scanning commits & PRs",
      activeRange: [2, 3],
      doneAt: 4,
    },
    {
      label: "Generating AI insights",
      sublabel: step >= 5 ? "Synthesis complete" : "Queued for processing",
      activeRange: [4, 4],
      doneAt: 5,
    },
  ];

  return (
    <div className="pt-10 pb-20 px-6 max-w-[1440px] mx-auto min-h-screen w-full">
      {/* Status Header */}
      <header className="mb-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
              </span>
              <span className="text-xs font-semibold text-primary uppercase tracking-[0.2em]">Live Analysis</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-on-surface mb-2 leading-tight">
              Analyzing{" "}
              <span className="text-primary underline underline-offset-4 decoration-primary/30">
                {owner}/{repo}
              </span>
            </h1>
            <p className="text-on-surface-variant text-base font-light mt-2">
              Mapping dependency graphs and contributor activity…
            </p>
          </div>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-10">
        {steps.map((s, idx) => {
          const [activeStart, activeEnd] = s.activeRange;
          const isDone = step >= s.doneAt;
          const isActive = step >= activeStart && step <= activeEnd;
          const isPending = step < activeStart;

          return (
            <div
              key={idx}
              className={`p-5 rounded-2xl border flex items-center gap-4 transition-all duration-500
                ${isDone
                  ? "bg-surface-container-low border-primary/20"
                  : isActive
                  ? "bg-surface-container-high border-primary/40 shadow-lg shadow-primary/5 ring-1 ring-primary/10"
                  : "bg-surface-container-lowest opacity-40 border-white/5"
                }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all duration-500
                  ${isDone
                    ? "bg-primary/10 text-primary"
                    : isActive
                    ? "bg-primary text-on-primary shadow-lg shadow-primary/30"
                    : "bg-surface-variant text-on-surface-variant"
                  }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : isActive ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : idx === 2 ? (
                  <Brain className="w-5 h-5" />
                ) : (
                  <Zap className="w-4 h-4 opacity-40" />
                )}
              </div>
              <div className="min-w-0">
                <p className={`text-sm font-bold truncate ${isPending ? "text-on-surface-variant" : "text-white"}`}>
                  {s.label}
                </p>
                <p className={`text-xs truncate mt-0.5 ${isActive ? "text-primary" : "text-on-surface-variant/60"}`}>
                  {s.sublabel}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Skeleton Bento Grid */}
      <div className="grid grid-cols-12 gap-5 animate-pulse">
        {/* Large Activity Chart */}
        <div className="col-span-12 lg:col-span-8 bg-surface-container-low p-8 rounded-[2rem] h-[380px] flex flex-col justify-between overflow-hidden relative">
          <div className="space-y-3">
            <div className="h-7 w-44 bg-surface-variant/60 rounded-lg"></div>
            <div className="h-3.5 w-64 bg-surface-variant/30 rounded-lg"></div>
          </div>
          <div className="flex items-end gap-2 h-44 mt-auto opacity-40">
            {[60, 80, 100, 72, 90, 110, 80, 42].map((h, i) => (
              <div
                key={i}
                className="flex-1 bg-surface-container-highest rounded-t-md"
                style={{ height: `${h}px` }}
              ></div>
            ))}
          </div>
        </div>

        {/* Side stat cards */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-5">
          <div className="bg-surface-container-high p-7 rounded-[2rem] flex-1">
            <div className="h-5 w-28 bg-surface-variant/60 rounded-lg mb-5"></div>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-full bg-surface-variant/40"></div>
              <div className="space-y-2">
                <div className="h-4 w-20 bg-surface-variant/50 rounded-lg"></div>
                <div className="h-3 w-14 bg-surface-variant/30 rounded-lg"></div>
              </div>
            </div>
            <div className="space-y-2.5">
              <div className="h-2.5 w-full bg-surface-variant/20 rounded-lg"></div>
              <div className="h-2.5 w-5/6 bg-surface-variant/20 rounded-lg"></div>
              <div className="h-2.5 w-3/4 bg-surface-variant/20 rounded-lg"></div>
            </div>
          </div>

          <div className="bg-primary/5 p-7 rounded-[2rem] border border-primary/10 flex-1 relative overflow-hidden">
            <div className="absolute -right-8 -top-8 w-28 h-28 bg-primary/15 blur-[50px] rounded-full pointer-events-none"></div>
            <div className="h-5 w-36 bg-surface-variant/60 rounded-lg mb-5"></div>
            <div className="h-10 w-20 bg-surface-variant/40 rounded-lg mb-3"></div>
            <div className="h-3 w-28 bg-surface-variant/30 rounded-lg"></div>
          </div>
        </div>

        {/* Bottom row */}
        {[
          { span: "col-span-12 md:col-span-4" },
          { span: "col-span-12 md:col-span-4" },
          { span: "col-span-12 md:col-span-4" },
        ].map((card, i) => (
          <div key={i} className={`${card.span} bg-surface-container-low p-6 rounded-[2rem]`}>
            <div className="flex justify-between items-start mb-5">
              <div className="h-5 w-24 bg-surface-variant/60 rounded-lg"></div>
              <div className="w-7 h-7 bg-surface-variant/40 rounded-lg"></div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-surface-variant/40 rounded-full shrink-0"></div>
                <div className="h-3.5 w-28 bg-surface-variant/30 rounded-lg"></div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-surface-variant/40 rounded-full shrink-0"></div>
                <div className="h-3.5 w-24 bg-surface-variant/30 rounded-lg"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}