// ─────────────────────────────────────────────
// LanguageBar.tsx
// ─────────────────────────────────────────────
import { Code2 } from "lucide-react";
 
interface LanguageBarProps {
  languages: Record<string, number>;
}
 
const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  Java: "#b07219",
  Go: "#00ADD8",
  Rust: "#dea584",
  C: "#555555",
  "C++": "#f34b7d",
  "C#": "#178600",
  Ruby: "#701516",
  PHP: "#4F5D95",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Shell: "#89e051",
  Vue: "#41b883",
  Svelte: "#ff3e00",
  Dockerfile: "#384d54",
  Swift: "#F05138",
  Kotlin: "#A97BFF",
  Dart: "#00B4AB",
};
 
const getColor = (lang: string) => LANGUAGE_COLORS[lang] ?? "#8b949e";
 
export function LanguageBar({ languages }: LanguageBarProps) {
  if (!languages || Object.keys(languages).length === 0) {
    return (
      <div className="text-on-surface-variant/50 italic text-sm p-6">
        No languages detected
      </div>
    );
  }
 
  const entries = Object.entries(languages);
  const total = entries.reduce((acc, [, b]) => acc + b, 0);
  const sorted = entries
    .map(([lang, bytes]) => ({ lang, pct: (bytes / total) * 100 }))
    .sort((a, b) => b.pct - a.pct);
 
  const top5 = sorted.slice(0, 5);
  const otherPct = sorted.slice(5).reduce((acc, c) => acc + c.pct, 0);
 
  return (
    <section className="bg-surface-container-low rounded-2xl p-6 h-full border border-white/5">
      <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant flex items-center gap-2 mb-5">
        <Code2 className="text-primary w-4 h-4" />
        Language Distribution
      </h2>
 
      {/* Color bar */}
      <div className="flex h-1.5 rounded-full overflow-hidden mb-5 gap-px">
        {top5.map(({ lang, pct }) => (
          <div
            key={lang}
            className="rounded-full"
            style={{ width: `${pct}%`, backgroundColor: getColor(lang) }}
            title={`${lang}: ${pct.toFixed(1)}%`}
          />
        ))}
        {otherPct > 0 && (
          <div
            className="rounded-full flex-1 bg-surface-variant"
            title={`Other: ${otherPct.toFixed(1)}%`}
          />
        )}
      </div>
 
      <div className="space-y-3">
        {top5.map(({ lang, pct }) => (
          <div key={lang} className="flex items-center justify-between text-sm group">
            <div className="flex items-center gap-2 min-w-0">
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: getColor(lang) }}
              />
              <span className="text-on-surface font-medium group-hover:text-primary transition-colors truncate">
                {lang}
              </span>
            </div>
            <span className="text-xs text-primary font-bold shrink-0 ml-2">
              {pct.toFixed(1)}%
            </span>
          </div>
        ))}
        {otherPct > 0 && (
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-surface-variant shrink-0" />
              <span className="text-on-surface-variant font-medium">Other</span>
            </div>
            <span className="text-xs text-on-surface-variant font-bold ml-2">
              {otherPct.toFixed(1)}%
            </span>
          </div>
        )}
      </div>
    </section>
  );
}