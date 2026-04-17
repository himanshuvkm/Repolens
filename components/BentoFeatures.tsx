import { GitBranchPlus, NotebookTabs, Radar, ScanSearch } from "lucide-react";

const sideCards = [
  {
    icon: NotebookTabs,
    title: "Context, not raw logs",
    desc: "See maintainership and issue hygiene organized into readable editorial blocks instead of noisy API dumps.",
  },
  {
    icon: GitBranchPlus,
    title: "Contribution posture",
    desc: "Spot whether external pull requests are likely to land before a new contributor wastes effort.",
  },
  {
    icon: Radar,
    title: "Repository pulse",
    desc: "Track response time, merge rate, maintainer attention, and beginner-friendly labels in one place.",
  },
];

export function BentoFeatures() {
  return (
    <section className="relative z-10 mx-auto mt-24 grid max-w-7xl grid-cols-1 gap-5 px-5 md:px-8 lg:grid-cols-12">
      <div className="panel-card relative overflow-hidden rounded-[2rem] lg:col-span-8">
        <div className="flex items-center justify-between border-b border-frame px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-ink text-paper">
              <ScanSearch className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.24em] text-muted">What the dashboard reads</p>
              <p className="text-sm font-semibold text-ink">Repository signals at a glance</p>
            </div>
          </div>
          <div className="flex gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-accent" />
            <div className="h-2.5 w-2.5 rounded-full bg-teal" />
            <div className="h-2.5 w-2.5 rounded-full bg-ink" />
          </div>
        </div>

        <div className="grid gap-5 p-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[1.7rem] border border-frame bg-canvas p-6">
            <div className="mb-6 flex items-end justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-[0.24em] text-muted">Editor&apos;s Summary</p>
                <h3 className="mt-2 font-display text-4xl leading-none text-ink">Healthy, selective, actively maintained.</h3>
              </div>
              <span className="rounded-full bg-accent px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-accent-foreground">
                Score 84
              </span>
            </div>
            <p className="max-w-xl text-sm leading-7 text-muted">
              Review how a project responds to the outside world: whether maintainers answer issues, merge work, and keep obvious contributor on-ramps open.
            </p>
            <div className="mt-8 grid grid-cols-3 gap-3">
              {[
                ["Response time", "18h"],
                ["Merge rate", "71%"],
                ["Good first issues", "9"],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-frame bg-panel p-4">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-muted">{label}</p>
                  <p className="mt-3 font-display text-3xl text-ink">{value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-[1.7rem] border border-frame bg-panel p-5">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-[11px] uppercase tracking-[0.22em] text-muted">Signal balance</p>
                <span className="text-sm font-semibold text-teal">Live</span>
              </div>
              <div className="space-y-3">
                {[
                  ["Maintainer activity", "92%"],
                  ["Newcomer readiness", "63%"],
                  ["Review consistency", "78%"],
                ].map(([label, pct]) => (
                  <div key={label}>
                    <div className="mb-1 flex justify-between text-sm text-ink">
                      <span>{label}</span>
                      <span className="font-semibold">{pct}</span>
                    </div>
                    <div className="h-2 rounded-full bg-frame/50">
                      <div className="h-full rounded-full bg-ink" style={{ width: pct }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[1.7rem] border border-frame bg-[linear-gradient(135deg,rgba(28,169,201,0.12),rgba(221,131,48,0.16))] p-5">
              <p className="text-[11px] uppercase tracking-[0.22em] text-muted">Why teams use this</p>
              <p className="mt-3 text-lg font-semibold leading-8 text-ink">
                Compare repositories before integrating them, contributing to them, or betting your roadmap on them.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 lg:col-span-4">
        {sideCards.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="metric-card flex-1 rounded-[1.75rem] p-5 transition-transform hover:-translate-y-1">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-ink text-paper">
                <Icon className="h-4 w-4" />
              </div>
              <h3 className="text-lg font-semibold text-ink">{title}</h3>
            </div>
            <p className="text-sm leading-7 text-muted">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
