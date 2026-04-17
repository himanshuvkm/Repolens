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
      sublabel: step >= 4 ? "Analysis complete" : "Scanning commits and PRs",
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
    <div className="mx-auto min-h-screen w-full max-w-[1440px] px-5 pb-20 pt-10 md:px-8">
      <header className="mb-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent"></span>
              </span>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Live Analysis</span>
            </div>
            <h1 className="font-display text-4xl tracking-tight text-ink md:text-6xl">
              Analyzing <span className="text-accent">{owner}/{repo}</span>
            </h1>
            <p className="mt-2 text-base text-muted">
              Mapping contributor activity, maintainership patterns, and project structure...
            </p>
          </div>
        </div>
      </header>

      <div className="mb-10 grid grid-cols-1 gap-3 md:grid-cols-3">
        {steps.map((s, idx) => {
          const [activeStart, activeEnd] = s.activeRange;
          const isDone = step >= s.doneAt;
          const isActive = step >= activeStart && step <= activeEnd;
          const isPending = step < activeStart;

          return (
            <div
              key={idx}
              className={`flex items-center gap-4 rounded-2xl border p-5 transition-all duration-500 ${
                isDone ? "border-frame bg-panel" : isActive ? "border-accent/50 bg-canvas ring-1 ring-accent/10" : "border-frame bg-panel/60 opacity-50"
              }`}
            >
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all duration-500 ${
                  isDone ? "bg-accent/10 text-accent" : isActive ? "bg-ink text-paper shadow-lg shadow-ink/20" : "bg-frame text-muted"
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : isActive ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : idx === 2 ? (
                  <Brain className="h-5 w-5" />
                ) : (
                  <Zap className="h-4 w-4 opacity-40" />
                )}
              </div>
              <div className="min-w-0">
                <p className={`truncate text-sm font-bold ${isPending ? "text-muted" : "text-ink"}`}>{s.label}</p>
                <p className={`mt-0.5 truncate text-xs ${isActive ? "text-accent" : "text-muted/70"}`}>{s.sublabel}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-12 gap-5 animate-pulse">
        <div className="panel-card col-span-12 relative flex h-[380px] flex-col justify-between overflow-hidden rounded-[2rem] p-8 lg:col-span-8">
          <div className="space-y-3">
            <div className="h-7 w-44 rounded-lg bg-frame"></div>
            <div className="h-3.5 w-64 rounded-lg bg-frame/70"></div>
          </div>
          <div className="mt-auto flex h-44 items-end gap-2 opacity-40">
            {[60, 80, 100, 72, 90, 110, 80, 42].map((h, i) => (
              <div key={i} className="flex-1 rounded-t-md bg-frame" style={{ height: `${h}px` }}></div>
            ))}
          </div>
        </div>

        <div className="col-span-12 flex flex-col gap-5 lg:col-span-4">
          <div className="panel-card flex-1 rounded-[2rem] p-7">
            <div className="mb-5 h-5 w-28 rounded-lg bg-frame"></div>
            <div className="mb-6 flex items-center gap-4">
              <div className="h-14 w-14 rounded-full bg-frame/70"></div>
              <div className="space-y-2">
                <div className="h-4 w-20 rounded-lg bg-frame/80"></div>
                <div className="h-3 w-14 rounded-lg bg-frame/60"></div>
              </div>
            </div>
            <div className="space-y-2.5">
              <div className="h-2.5 w-full rounded-lg bg-frame/50"></div>
              <div className="h-2.5 w-5/6 rounded-lg bg-frame/50"></div>
              <div className="h-2.5 w-3/4 rounded-lg bg-frame/50"></div>
            </div>
          </div>

          <div className="relative flex-1 overflow-hidden rounded-[2rem] border border-accent/20 bg-accent/8 p-7">
            <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-accent/20 blur-[50px]"></div>
            <div className="mb-5 h-5 w-36 rounded-lg bg-frame"></div>
            <div className="mb-3 h-10 w-20 rounded-lg bg-frame/70"></div>
            <div className="h-3 w-28 rounded-lg bg-frame/50"></div>
          </div>
        </div>

        {["col-span-12 md:col-span-4", "col-span-12 md:col-span-4", "col-span-12 md:col-span-4"].map((span, i) => (
          <div key={i} className={`${span} panel-card rounded-[2rem] p-6`}>
            <div className="mb-5 flex items-start justify-between">
              <div className="h-5 w-24 rounded-lg bg-frame"></div>
              <div className="h-7 w-7 rounded-lg bg-frame/70"></div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 shrink-0 rounded-full bg-frame/70"></div>
                <div className="h-3.5 w-28 rounded-lg bg-frame/60"></div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 shrink-0 rounded-full bg-frame/70"></div>
                <div className="h-3.5 w-24 rounded-lg bg-frame/60"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
