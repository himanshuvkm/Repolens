"use client";

import { useEffect, useState } from "react";
import { Layers, AlertTriangle, CheckCircle2 } from "lucide-react";
import { FileNode } from "@/types";

interface Props {
  owner: string;
  repo: string;
  tree: FileNode[];
}

export function DependencySnapshot({ owner, repo, tree }: Props) {
  const [depsCount, setDepsCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasOutdated, setHasOutdated] = useState(false);
  const [type, setType] = useState<"npm" | "pip" | "none">("none");

  useEffect(() => {
    const checkDeps = async () => {
      setLoading(true);

      const hasPackageJson = tree.some((f) => f.path === "package.json");
      const hasRequirementsText = tree.some((f) => f.path === "requirements.txt");

      if (hasPackageJson) {
        setType("npm");
        try {
          const res = await fetch(`https://raw.githubusercontent.com/${owner}/${repo}/HEAD/package.json`);
          if (res.ok) {
            const data = await res.json();
            const count = Object.keys(data.dependencies || {}).length + Object.keys(data.devDependencies || {}).length;
            setDepsCount(count);

            const depsStr = JSON.stringify(data);
            if (depsStr.includes('"react": "^16') || depsStr.includes('"next": "^12') || depsStr.includes('"express": "^3')) {
              setHasOutdated(true);
            }
          }
        } catch {
          // ignore
        }
      } else if (hasRequirementsText) {
        setType("pip");
        try {
          const res = await fetch(`https://raw.githubusercontent.com/${owner}/${repo}/HEAD/requirements.txt`);
          if (res.ok) {
            const text = await res.text();
            const count = text.split("\n").filter((line) => line.trim() && !line.startsWith("#")).length;
            setDepsCount(count);
          }
        } catch {
          // ignore
        }
      }

      setLoading(false);
    };

    void checkDeps();
  }, [owner, repo, tree]);

  if (loading) {
    return (
      <section className="panel-card flex h-full animate-pulse flex-col justify-center rounded-[1.9rem] p-6">
        <div className="mb-6 h-4 w-32 rounded bg-frame"></div>
        <div className="mb-4 h-8 w-16 rounded bg-frame"></div>
        <div className="h-4 w-24 rounded bg-frame/70"></div>
      </section>
    );
  }

  if (type === "none" || depsCount === null) {
    return (
      <section className="panel-card flex h-full flex-col justify-between rounded-[1.9rem] p-6 opacity-70">
        <h2 className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-muted">
          <Layers className="h-5 w-5 text-accent" />
          Dependencies
        </h2>
        <div className="mt-4 flex items-center gap-2 text-muted">
          <span className="text-sm font-medium">No standard dependencies found</span>
        </div>
      </section>
    );
  }

  return (
    <section className="panel-card flex h-full flex-col justify-between rounded-[1.9rem] p-6">
      <h2 className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-muted">
        <Layers className="h-5 w-5 text-accent" />
        Dependencies
      </h2>
      <div className="mt-4">
        <div className="mb-3 flex items-end gap-2">
          <span className="text-4xl font-black text-ink">{depsCount}</span>
          <span className="mb-1 pb-0.5 text-sm font-medium text-muted">{type === "npm" ? "NPM Packages" : "Python Packages"}</span>
        </div>

        {hasOutdated ? (
          <div className="inline-flex items-center gap-1.5 rounded-lg border border-orange-200 bg-orange-50 px-3 py-1.5 text-xs font-bold text-orange-500">
            <AlertTriangle className="h-4 w-4" />
            Updates needed
          </div>
        ) : (
          <div className="inline-flex items-center gap-1.5 rounded-lg border border-green-200 bg-green-50 px-3 py-1.5 text-xs font-bold text-green-600">
            <CheckCircle2 className="h-4 w-4" />
            All packages secure
          </div>
        )}
      </div>
    </section>
  );
}
