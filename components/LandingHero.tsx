export function LandingHero() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-4">
      <div className="inline-flex items-center rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-sm font-medium text-blue-400 mb-8 backdrop-blur-sm">
        <span className="flex h-2 w-2 rounded-full bg-blue-500 mr-2 animate-pulse"></span>
        AI-Powered Codebase Analysis
      </div>
      <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
        Instant intelligence on <br className="hidden md:block" /> any GitHub repo
      </h1>
      <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
        Analyze code quality, maintenance health, and contribution friendliness instantly with Gemini 2.0. Drop a link below to get started.
      </p>
    </div>
  );
}
