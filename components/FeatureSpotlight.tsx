export function FeatureSpotlight() {
  return (
    <section className="mx-auto mt-32 max-w-7xl px-5 md:px-8">
      <div className="grid items-center gap-12 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-7">
          <div className="inline-flex rounded-full border border-frame bg-panel px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-muted">
            Designed for decisions
          </div>
          <h2 className="max-w-2xl font-display text-5xl leading-[0.98] tracking-[-0.04em] text-ink md:text-7xl">
            Deep repository context without the dashboard clutter.
          </h2>
          <p className="max-w-xl text-base leading-8 text-muted">
            Instead of flooding you with graphs, RepoLens organizes GitHub data into a reading experience that helps you answer practical questions quickly: Is this repo alive, welcoming, and worth depending on?
          </p>
          <div className="grid grid-cols-2 gap-8 pt-2">
            <div>
              <span className="block font-display text-4xl leading-none text-ink">1 report</span>
              <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-muted">One concise view</p>
            </div>
            <div>
              <span className="block font-display text-4xl leading-none text-ink">4 signals</span>
              <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-muted">
                Health, PRs, maintainers, onboarding
              </p>
            </div>
          </div>
        </div>

        <div className="panel-card relative overflow-hidden rounded-[2rem] p-6 md:p-8">
          <div className="grid gap-4 md:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-[1.6rem] border border-frame bg-ink p-6 text-paper">
              <p className="text-[11px] uppercase tracking-[0.24em] text-paper/60">Repository memo</p>
              <p className="mt-5 font-display text-4xl leading-tight">A cleaner answer to should we trust this project?</p>
              <p className="mt-5 text-sm leading-7 text-paper/70">
                Every section is written to support a real engineering decision, not just to show off metrics.
              </p>
            </div>
            <div className="rounded-[1.6rem] border border-frame bg-canvas p-6">
              <div className="mb-5 flex items-center gap-2 border-b border-frame pb-4">
                <span className="h-2.5 w-2.5 rounded-full bg-accent"></span>
                <span className="h-2.5 w-2.5 rounded-full bg-teal"></span>
                <span className="h-2.5 w-2.5 rounded-full bg-ink"></span>
                <span className="ml-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">
                  repository-notes.json
                </span>
              </div>
              <div className="space-y-3 font-mono text-xs">
                {[
                  { line: "01", color: "text-[#8a5a44]", text: '"issue_response_hours": 17.4,' },
                  { line: "02", color: "text-[#1ca9c9]", text: '"merge_rate": 0.71,' },
                  { line: "03", color: "text-[#1f231c]", text: '"maintainer_activity": "high",' },
                  { line: "04", color: "text-[#b84c3e]", text: '"good_first_issue_count": 9,' },
                  { line: "05", color: "text-[#8a5a44]", text: '"health_summary": "active but selective"' },
                ].map(({ line, color, text }) => (
                  <div key={line} className="flex items-start gap-4">
                    <span className="w-4 shrink-0 select-none text-right text-muted/50">{line}</span>
                    <span className={color}>{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
