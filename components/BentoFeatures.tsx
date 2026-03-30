// ─────────────────────────────────────────────
// BentoFeatures.tsx
// ─────────────────────────────────────────────
import { Terminal, Brain, GitCommit, MessageCircle, Activity, Zap } from "lucide-react";

const sideCards = [
  {
    icon: Brain,
    title: "Code Quality AI",
    desc: "Detect architectural smells, circular dependencies, and security vulnerabilities automatically.",
  },
  {
    icon: GitCommit,
    title: "Contributor Velocity",
    desc: "Visualize PR turnaround and bus-factor risks across the entire commit history.",
  },
  {
    icon: MessageCircle,
    title: "Community Pulse",
    desc: "Sentiment analysis of issues and discussions to gauge project longevity.",
  },
];

export function BentoFeatures() {
  return (
    <section className="max-w-7xl mx-auto px-6 mt-28 grid grid-cols-1 md:grid-cols-12 gap-5 relative z-10">
      {/* Main visual card */}
      <div className="md:col-span-8 bg-surface-container-low/40 rounded-2xl border border-outline-variant/5 overflow-hidden group">
        {/* Card header bar */}
        <div className="px-5 py-3.5 border-b border-outline-variant/5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-surface-container-highest flex items-center justify-center">
              <Terminal className="text-primary w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-bold tracking-tight text-white">Main Repository Insights</span>
          </div>
          {/* Traffic lights */}
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/40"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/40"></div>
          </div>
        </div>

        {/* Image area */}
        <div className="p-6 relative aspect-video">
          <img
            className="w-full h-full object-cover rounded-xl opacity-75 group-hover:opacity-95 transition-opacity duration-700 mix-blend-screen"
            alt="Source code"
            src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface-container-low via-transparent to-transparent pointer-events-none"></div>

          {/* Floating health card */}
          <div className="absolute bottom-8 left-8 p-4 backdrop-blur-md bg-black/40 rounded-2xl border border-white/8 shadow-2xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                <Activity className="text-primary w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Health Score</p>
                <p className="text-lg font-black text-primary leading-tight">94 / 100</p>
              </div>
            </div>
            <div className="w-48 bg-white/10 rounded-full h-1 overflow-hidden">
              <div className="bg-primary h-full rounded-full" style={{ width: "94%" }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Side metric cards */}
      <div className="md:col-span-4 flex flex-col gap-4">
        {sideCards.map(({ icon: Icon, title, desc }) => (
          <div
            key={title}
            className="flex-1 bg-surface-container-low/40 rounded-2xl p-5 border border-outline-variant/5 group hover:border-primary/15 transition-colors"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                <Icon className="text-primary w-3.5 h-3.5" />
              </div>
              <h3 className="text-sm font-bold text-white">{title}</h3>
            </div>
            <p className="text-[13px] text-on-surface-variant leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}


