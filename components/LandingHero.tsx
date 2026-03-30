export function LandingHero() {
  return (
    <section className="max-w-7xl mx-auto px-6 text-center pt-10">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-highest/50 border border-outline-variant/20 mb-8 animate-in fade-in slide-in-from-bottom-2 duration-1000">
        <span className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(172,199,255,0.8)]"></span>
        <span className="text-xs font-medium uppercase tracking-widest text-on-surface-variant">v2.0 Now with Deep Insight AI</span>
      </div>
      <h1 className="text-5xl md:text-7xl font-black tracking-tight text-on-surface mb-6 max-w-4xl mx-auto leading-[1.1]">
        Instant Intelligence on <br className="hidden md:block" /><span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-container to-primary">Any GitHub Repo</span>
      </h1>
      <p className="text-lg md:text-xl text-on-surface-variant max-w-2xl mx-auto mb-12">
        Analyze code quality, contribution friendliness, and project health in seconds using AI.
      </p>
    </section>
  );
}
