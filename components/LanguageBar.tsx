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
    return <div className="p-6 text-sm italic text-muted">No languages detected</div>;
  }

  const entries = Object.entries(languages);
  const total = entries.reduce((acc, [, b]) => acc + b, 0);
  const sorted = entries
    .map(([lang, bytes]) => ({ lang, pct: (bytes / total) * 100 }))
    .sort((a, b) => b.pct - a.pct);

  const top5 = sorted.slice(0, 5);
  const otherPct = sorted.slice(5).reduce((acc, c) => acc + c.pct, 0);

  return (
    <section className="panel-card h-full rounded-[1.9rem] p-6">
      <h2 className="mb-5 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted">
        <Code2 className="h-4 w-4 text-accent" />
        Language Distribution
      </h2>

      <div className="mb-5 flex h-1.5 gap-px overflow-hidden rounded-full">
        {top5.map(({ lang, pct }) => (
          <div key={lang} className="rounded-full" style={{ width: `${pct}%`, backgroundColor: getColor(lang) }} title={`${lang}: ${pct.toFixed(1)}%`} />
        ))}
        {otherPct > 0 && <div className="flex-1 rounded-full bg-surface-variant" title={`Other: ${otherPct.toFixed(1)}%`} />}
      </div>

      <div className="space-y-3">
        {top5.map(({ lang, pct }) => (
          <div key={lang} className="group flex items-center justify-between text-sm">
            <div className="flex min-w-0 items-center gap-2">
              <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: getColor(lang) }} />
              <span className="truncate font-medium text-ink transition-colors group-hover:text-accent">{lang}</span>
            </div>
            <span className="ml-2 shrink-0 text-xs font-bold text-accent">{pct.toFixed(1)}%</span>
          </div>
        ))}
        {otherPct > 0 && (
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 shrink-0 rounded-full bg-surface-variant" />
              <span className="font-medium text-muted">Other</span>
            </div>
            <span className="ml-2 text-xs font-bold text-muted">{otherPct.toFixed(1)}%</span>
          </div>
        )}
      </div>
    </section>
  );
}
