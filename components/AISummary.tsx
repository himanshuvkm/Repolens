"use client";

import { useEffect, useState, useRef } from "react";
import {
  Brain,
  RefreshCw,
  AlertCircle,
  Sparkles,
  Users,
  Layers,
  HeartPulse,
  GitPullRequest,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Activity,
  FileText,
  FlaskConical,
  Archive,
  Zap,
} from "lucide-react";

interface Props {
  repoData: any;
}

// ── Types ────────────────────────────────────────────────────────────────────

interface AISummaryData {
  overview: {
    title: string;
    tagline: string;
    description: string;
  };
  audience: {
    primary: string;
    useCases: string[];
  };
  techStack: {
    languages: string[];
    frameworks: string[];
    tooling: string[];
    highlights: string;
  };
  health: {
    status: "active" | "experimental" | "stale" | "archived";
    statusReason: string;
    activityScore: number;
    activityNote: string;
    hasTests: boolean;
    hasDocs: boolean;
    hasCI: boolean;
  };
  contribution: {
    verdict: "YES" | "MAYBE" | "NO";
    reasoning: string;
    entryPoints: { label: string; detail: string }[];
  };
  risks: string[];
  tldr: string;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function buildPayload(repoData: any) {
  if (!repoData) return {};
  return {
    owner: repoData.owner,
    repo: repoData.repo,
    metadata: repoData.metadata,
    languages: repoData.languages,
    contributorsCount: repoData.contributorsCount,
    commits: (repoData.commits ?? []).slice(0, 10).map((c: any) => ({
      message: c.message,
      authorName: c.authorName,
      date: c.date,
    })),
    prs: (repoData.prs ?? []).slice(0, 10).map((p: any) => ({
      title: p.title,
      state: p.state,
      mergedAt: p.mergedAt,
    })),
    issues: (repoData.issues ?? []).slice(0, 10).map((i: any) => ({
      title: i.title,
      state: i.state,
    })),
    fileTree: (repoData.fileTree ?? []).slice(0, 40).map((f: any) => f.path),
  };
}

function tryParseJSON(raw: string): AISummaryData | null {
  try {
    // Strip possible markdown code fences if model misbehaves
    const cleaned = raw.replace(/^```json\s*/i, "").replace(/```\s*$/, "").trim();
    return JSON.parse(cleaned);
  } catch {
    return null;
  }
}

// ── Sub-components ───────────────────────────────────────────────────────────

function Badge({ label, color = "default" }: { label: string; color?: string }) {
  const colors: Record<string, string> = {
    default: "bg-surface-container-highest text-on-surface-variant",
    primary: "bg-primary/20 text-primary",
    green: "bg-emerald-500/15 text-emerald-400",
    yellow: "bg-amber-500/15 text-amber-400",
    red: "bg-red-500/15 text-red-400",
    blue: "bg-sky-500/15 text-sky-400",
  };
  return (
    <span className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full ${colors[color] ?? colors.default}`}>
      {label}
    </span>
  );
}

function SectionHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <span className="text-primary/70">{icon}</span>
      <h3 className="text-[11px] font-black uppercase tracking-[0.18em] text-on-surface-variant/70">{title}</h3>
    </div>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl bg-surface-container/50 border border-outline-variant/10 p-4 ${className}`}>
      {children}
    </div>
  );
}

function ActivityBar({ score }: { score: number }) {
  const clamped = Math.max(1, Math.min(10, score));
  const color =
    clamped >= 7 ? "bg-emerald-400" : clamped >= 4 ? "bg-amber-400" : "bg-red-400";
  return (
    <div className="flex items-center gap-2 mt-1">
      <div className="flex-1 h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full transition-all duration-700`}
          style={{ width: `${clamped * 10}%` }}
        />
      </div>
      <span className="text-xs font-bold text-on-surface-variant">{clamped}/10</span>
    </div>
  );
}

function HealthBadge({ ok, label }: { ok: boolean; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      {ok ? (
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
      ) : (
        <XCircle className="w-3.5 h-3.5 text-red-400/60" />
      )}
      <span className={`text-xs ${ok ? "text-on-surface" : "text-on-surface-variant/50 line-through"}`}>
        {label}
      </span>
    </div>
  );
}

function StatusIcon({ status }: { status: AISummaryData["health"]["status"] }) {
  const map = {
    active: { icon: <Activity className="w-4 h-4" />, color: "text-emerald-400", label: "Active" },
    experimental: { icon: <FlaskConical className="w-4 h-4" />, color: "text-amber-400", label: "Experimental" },
    stale: { icon: <HeartPulse className="w-4 h-4" />, color: "text-orange-400", label: "Stale" },
    archived: { icon: <Archive className="w-4 h-4" />, color: "text-red-400", label: "Archived" },
  };
  const { icon, color, label } = map[status] ?? map.stale;
  return (
    <span className={`flex items-center gap-1 font-semibold text-sm ${color}`}>
      {icon} {label}
    </span>
  );
}

function VerdictIcon({ verdict }: { verdict: "YES" | "MAYBE" | "NO" }) {
  if (verdict === "YES") return <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
  if (verdict === "MAYBE") return <HelpCircle className="w-5 h-5 text-amber-400" />;
  return <XCircle className="w-5 h-5 text-red-400" />;
}

// ── Main Component ────────────────────────────────────────────────────────────

export function AISummary({ repoData }: Props) {
  const [raw, setRaw] = useState("");
  const [parsed, setParsed] = useState<AISummaryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const fetchSummary = async () => {
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);
    setRaw("");
    setParsed(null);

    try {
      const payload = buildPayload(repoData);
      const res = await fetch("/api/ai-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoDataJSON: payload }),
        signal: controller.signal,
      });

      if (!res.ok) {
        let errMsg = `Request failed with status ${res.status}`;
        try {
          const errData = await res.json();
          errMsg = errData.error || errMsg;
        } catch {}
        throw new Error(errMsg);
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) throw new Error("No readable stream returned");

      let accumulated = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        accumulated += chunk;
        setRaw(accumulated);
        // Try to parse incrementally — only show when complete JSON arrives
        const attempt = tryParseJSON(accumulated);
        if (attempt) setParsed(attempt);
      }

      // Final parse attempt
      const final = tryParseJSON(accumulated);
      if (final) {
        setParsed(final);
      } else if (!final && accumulated && !accumulated.includes("__STREAM_ERROR__")) {
        setError("AI returned unexpected format. Try regenerating.");
      }
    } catch (err: any) {
      if (err?.name === "AbortError") return;
      console.error("AISummary error:", err);
      setError(err?.message || "Failed to generate AI analysis.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (repoData) fetchSummary();
    return () => abortRef.current?.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [repoData]);

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <section className="glass rounded-2xl p-6 lg:p-8 border border-outline-variant/5 flex flex-col min-h-[520px]">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 border-b border-outline-variant/10 pb-5 relative">
        <div className="bg-primary/20 p-2 rounded-lg text-primary">
          <Brain className="shrink-0 w-6 h-6" />
        </div>
        <div>
          <h2 className="text-sm font-black uppercase tracking-[0.2em] text-on-surface">AI Strategic Summary</h2>
          <p className="text-xs text-on-surface-variant">Gemini 2.0 Architectural Synthesis</p>
        </div>

        {(error || (!loading && parsed)) && (
          <button
            onClick={fetchSummary}
            className="absolute top-0 right-0 text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-highest hover:bg-surface-container-high transition-colors text-primary font-bold"
            title="Regenerate"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            {error ? "Retry" : "Regen"}
          </button>
        )}
      </div>

      {/* Body */}
      <div className="overflow-y-auto custom-scrollbar flex-grow">
        {/* Loading state */}
        {loading && !parsed && (
          <div className="flex flex-col items-center justify-center h-48 text-on-surface-variant/50">
            <Sparkles className="w-8 h-8 mb-3 text-primary/50 animate-pulse" />
            <p className="animate-pulse text-sm">Generating insights…</p>
          </div>
        )}

        {/* Error state */}
        {error && !parsed && (
          <div className="flex flex-col items-center justify-center h-48">
            <AlertCircle className="w-8 h-8 mb-3 text-red-500/50" />
            <p className="text-sm text-center text-red-400/70 max-w-xs">{error}</p>
          </div>
        )}

        {/* Structured output */}
        {parsed && (
          <div className="space-y-4">
            {/* TL;DR Banner */}
            <div className="flex items-start gap-3 rounded-xl bg-primary/10 border border-primary/20 px-4 py-3">
              <Zap className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <p className="text-sm font-semibold text-primary leading-snug">{parsed.tldr}</p>
            </div>

            {/* Overview */}
            <Card>
              <SectionHeader icon={<FileText className="w-4 h-4" />} title="Overview" />
              <p className="text-xs text-on-surface-variant/80 leading-relaxed">{parsed.overview.description}</p>
            </Card>

            {/* 2-col grid: Audience + Tech Stack */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Audience */}
              <Card>
                <SectionHeader icon={<Users className="w-4 h-4" />} title="Built For" />
                <p className="text-xs font-semibold text-on-surface mb-2">{parsed.audience.primary}</p>
                <ul className="space-y-1">
                  {parsed.audience.useCases.map((uc, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-xs text-on-surface-variant/80">
                      <span className="text-primary/50 mt-0.5">›</span>
                      {uc}
                    </li>
                  ))}
                </ul>
              </Card>

              {/* Tech Stack */}
              <Card>
                <SectionHeader icon={<Layers className="w-4 h-4" />} title="Tech Stack" />
                <div className="flex flex-wrap gap-1 mb-2">
                  {[...parsed.techStack.languages, ...parsed.techStack.frameworks, ...parsed.techStack.tooling].map(
                    (t, i) => (
                      <Badge key={i} label={t} color="primary" />
                    )
                  )}
                </div>
                <p className="text-[11px] text-on-surface-variant/60 italic leading-snug">{parsed.techStack.highlights}</p>
              </Card>
            </div>

            {/* Health */}
            <Card>
              <SectionHeader icon={<HeartPulse className="w-4 h-4" />} title="Repository Health" />
              <div className="flex items-center justify-between mb-2">
                <StatusIcon status={parsed.health.status} />
                <div className="flex gap-3">
                  <HealthBadge ok={parsed.health.hasTests} label="Tests" />
                  <HealthBadge ok={parsed.health.hasDocs} label="Docs" />
                  <HealthBadge ok={parsed.health.hasCI} label="CI" />
                </div>
              </div>
              <p className="text-xs text-on-surface-variant/70 mb-2 leading-snug">{parsed.health.statusReason}</p>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] uppercase tracking-wider text-on-surface-variant/50">Activity</span>
                </div>
                <ActivityBar score={parsed.health.activityScore} />
                <p className="text-[11px] text-on-surface-variant/50 mt-1">{parsed.health.activityNote}</p>
              </div>
            </Card>

            {/* Contribution */}
            <Card>
              <SectionHeader icon={<GitPullRequest className="w-4 h-4" />} title="Should I Contribute?" />
              <div className="flex items-center gap-2 mb-2">
                <VerdictIcon verdict={parsed.contribution.verdict} />
                <span
                  className={`font-black text-sm ${
                    parsed.contribution.verdict === "YES"
                      ? "text-emerald-400"
                      : parsed.contribution.verdict === "MAYBE"
                      ? "text-amber-400"
                      : "text-red-400"
                  }`}
                >
                  {parsed.contribution.verdict}
                </span>
              </div>
              <p className="text-xs text-on-surface-variant/80 mb-3 leading-relaxed">{parsed.contribution.reasoning}</p>
              <div className="space-y-2">
                {parsed.contribution.entryPoints.map((ep, i) => (
                  <div key={i} className="flex items-start gap-2 rounded-lg bg-surface-container-highest/50 px-3 py-2">
                    <span className="text-[11px] font-black text-primary/80 mt-0.5 shrink-0">#{i + 1}</span>
                    <div>
                      <p className="text-xs font-semibold text-on-surface">{ep.label}</p>
                      <p className="text-[11px] text-on-surface-variant/60">{ep.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Risks */}
            {parsed.risks?.length > 0 && (
              <Card>
                <SectionHeader icon={<ShieldAlert className="w-4 h-4" />} title="Risks & Caveats" />
                <ul className="space-y-1.5">
                  {parsed.risks.map((risk, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-on-surface-variant/80">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-400/70 shrink-0 mt-0.5" />
                      {risk}
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {/* Still streaming indicator */}
            {loading && (
              <div className="flex items-center gap-2 text-xs text-on-surface-variant/40 px-1">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                Refining analysis…
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}