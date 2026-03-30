// ─────────────────────────────────────────────
// FeatureSpotlight.tsx
// ─────────────────────────────────────────────
export function FeatureSpotlight() {
  return (
    <section className="max-w-7xl mx-auto px-6 mt-36">
      <div className="flex flex-col md:flex-row items-center gap-16">
        {/* Copy */}
        <div className="flex-1 space-y-7">
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-on-surface leading-tight">
            Deep context.{" "}
            <span className="text-on-surface-variant/35">Zero setup.</span>
          </h2>
          <p className="text-base text-on-surface-variant leading-relaxed font-light max-w-md">
            RepoLens clones your repository in a secure ephemeral environment, runs an exhaustive
            suite of static analyzers, and surfaces everything into a human-readable executive
            report.
          </p>
          <div className="grid grid-cols-2 gap-8 pt-2">
            <div>
              <span className="text-4xl font-black text-primary tracking-tighter leading-none block mb-1">
                0s
              </span>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-outline">
                Configuration needed
              </p>
            </div>
            <div>
              <span className="text-4xl font-black text-primary tracking-tighter leading-none block mb-1">
                150+
              </span>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-outline">
                Metrics tracked
              </p>
            </div>
          </div>
        </div>

        {/* Code preview */}
        <div className="flex-1 relative w-full max-w-lg">
          <div className="relative z-10 p-7 backdrop-blur-md bg-surface-container-low/80 rounded-2xl border border-white/[0.08] shadow-[0_40px_80px_rgba(0,0,0,0.5)]">
            {/* Window chrome */}
            <div className="flex items-center gap-1.5 mb-5 pb-4 border-b border-white/[0.06]">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/50"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-green-500/50"></span>
              <span className="ml-4 text-[11px] font-mono text-on-surface-variant/50">
                analysis_report.json
              </span>
            </div>
            <div className="space-y-3 font-mono text-xs">
              {[
                { line: "01", color: "text-blue-400", text: '"complexity_score": 0.82,' },
                { line: "02", color: "text-green-400", text: '"maintainability": "High",' },
                { line: "03", color: "text-blue-400", text: '"stale_branches": 14,' },
                { line: "04", color: "text-red-400", text: '"security_hotspots": [3],' },
                { line: "05", color: "text-blue-400", text: '"onboarding_difficulty": 2,' },
              ].map(({ line, color, text }) => (
                <div key={line} className="flex gap-4 items-start">
                  <span className="text-on-surface-variant/30 select-none w-4 shrink-0 text-right">
                    {line}
                  </span>
                  <span className={color}>{text}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Glow */}
          <div className="absolute -top-10 -right-10 w-56 h-56 bg-primary/15 rounded-full blur-[80px] pointer-events-none -z-10"></div>
        </div>
      </div>
    </section>
  );
}