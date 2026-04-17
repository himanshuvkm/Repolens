export function LandingHero() {
  return (
    <section className="mx-auto grid max-w-7xl grid-cols-1 gap-14 px-5 pb-8 pt-10 md:px-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:pt-18">
      <div className="relative">
        <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-frame bg-panel px-4 py-2 shadow-[0_12px_28px_rgba(53,45,31,0.08)]">
          <span className="h-2.5 w-2.5 rounded-full bg-teal" />
          <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-muted">
            Open Source Field Notes
          </span>
        </div>
        <h1 className="max-w-4xl font-display text-6xl leading-[0.95] tracking-[-0.04em] text-ink md:text-8xl">
          Read a GitHub repository like an investment memo.
        </h1>
        <p className="mt-8 max-w-2xl text-base leading-8 text-muted md:text-lg">
          RepoLens turns issues, pull requests, maintainer behavior, and contribution signals into a crisp editorial dashboard for engineers, founders, and developer-relations teams.
        </p>
        <div className="mt-10 flex flex-wrap gap-8">
          <div>
            <p className="font-display text-4xl text-ink">3 views</p>
            <p className="mt-1 text-[11px] uppercase tracking-[0.24em] text-muted">Health, activity, contribution</p>
          </div>
          <div>
            <p className="font-display text-4xl text-ink">Rule-based</p>
            <p className="mt-1 text-[11px] uppercase tracking-[0.24em] text-muted">No black-box scoring</p>
          </div>
          <div>
            <p className="font-display text-4xl text-ink">Real repos</p>
            <p className="mt-1 text-[11px] uppercase tracking-[0.24em] text-muted">Live GitHub analysis</p>
          </div>
        </div>
      </div>

      <div className="panel-card grid-paper relative overflow-hidden rounded-[2rem] p-6 md:p-8">
        <div className="absolute right-6 top-6 rounded-full border border-frame bg-paper px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">
          Sample Board
        </div>
        <div className="space-y-5">
          <div className="rounded-[1.5rem] border border-frame bg-canvas/70 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-[0.24em] text-muted">Repository Health</p>
                <p className="mt-2 font-display text-5xl text-ink">82</p>
              </div>
              <div className="rounded-2xl bg-accent px-4 py-3 text-accent-foreground shadow-[0_14px_28px_rgba(221,131,48,0.28)]">
                <p className="text-[10px] uppercase tracking-[0.2em]">Verdict</p>
                <p className="mt-1 text-lg font-semibold">Active</p>
              </div>
            </div>
            <div className="mt-5 h-3 overflow-hidden rounded-full bg-frame/60">
              <div className="h-full w-[82%] rounded-full bg-teal" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-[1.4rem] border border-frame bg-panel p-5">
              <p className="text-[11px] uppercase tracking-[0.22em] text-muted">Issue Response</p>
              <p className="mt-3 font-display text-3xl text-ink">17h</p>
            </div>
            <div className="rounded-[1.4rem] border border-frame bg-panel p-5">
              <p className="text-[11px] uppercase tracking-[0.22em] text-muted">Merge Rate</p>
              <p className="mt-3 font-display text-3xl text-ink">68%</p>
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-frame bg-panel p-5">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-[11px] uppercase tracking-[0.24em] text-muted">Contributor Signals</p>
              <p className="text-sm font-semibold text-teal">Welcoming</p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-2xl bg-canvas px-4 py-3">
                <span className="text-sm text-ink">Good first issues</span>
                <span className="font-semibold text-ink">12</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-canvas px-4 py-3">
                <span className="text-sm text-ink">Maintainer activity</span>
                <span className="font-semibold text-ink">High</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
