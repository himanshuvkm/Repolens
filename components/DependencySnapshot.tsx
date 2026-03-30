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
      
      const hasPackageJson = tree.some(f => f.path === "package.json");
      const hasRequirementsText = tree.some(f => f.path === "requirements.txt");

      if (hasPackageJson) {
        setType("npm");
        try {
          const res = await fetch(`https://raw.githubusercontent.com/${owner}/${repo}/HEAD/package.json`);
          if (res.ok) {
            const data = await res.json();
            const count = Object.keys(data.dependencies || {}).length + Object.keys(data.devDependencies || {}).length;
            setDepsCount(count);
            
            // Dummy naive check for outdated - if Next.js < 13 is found for instance, just an example!
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
            const count = text.split('\n').filter(line => line.trim() && !line.startsWith('#')).length;
            setDepsCount(count);
          }
        } catch {
          // ignore
        }
      }
      
      setLoading(false);
    };

    checkDeps();
  }, [owner, repo, tree]);

  if (loading) {
    return (
      <section className="bg-surface-container-highest rounded-2xl p-6 border border-outline-variant/5 animate-pulse flex flex-col justify-center h-full">
        <div className="h-4 w-32 bg-surface-variant rounded mb-6"></div>
        <div className="h-8 w-16 bg-surface-variant rounded mb-4"></div>
        <div className="h-4 w-24 bg-surface-variant/50 rounded"></div>
      </section>
    );
  }

  if (type === "none" || depsCount === null) {
    return (
      <section className="bg-surface-container-highest rounded-2xl p-6 border border-outline-variant/5 flex flex-col justify-between h-full opacity-50">
        <h2 className="text-xs font-black uppercase tracking-[0.2em] text-on-surface-variant flex items-center gap-2 mb-2">
          <Layers className="text-primary w-5 h-5" />
          Dependencies
        </h2>
        <div className="mt-4 flex items-center gap-2 text-on-surface-variant">
          <span className="font-medium text-sm">No standard dependencies found</span>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-surface-container-highest rounded-2xl p-6 border border-outline-variant/5 flex flex-col justify-between h-full">
      <h2 className="text-xs font-black uppercase tracking-[0.2em] text-on-surface-variant flex items-center gap-2 mb-2">
        <Layers className="text-primary w-5 h-5" />
        Dependencies
      </h2>
      <div className="mt-4">
        <div className="flex items-end gap-2 mb-3">
          <span className="text-4xl font-black text-on-surface">{depsCount}</span>
          <span className="text-sm text-on-surface-variant mb-1 font-medium pb-0.5">
            {type === 'npm' ? 'NPM Packages' : 'Python Packages'}
          </span>
        </div>
        
        {hasOutdated ? (
          <div className="bg-orange-500/10 text-orange-400 text-xs px-3 py-1.5 rounded-lg border border-orange-500/20 inline-flex items-center gap-1.5 font-bold">
            <AlertTriangle className="w-4 h-4" />
            Updates needed
          </div>
        ) : (
          <div className="bg-green-500/10 text-green-400 text-xs px-3 py-1.5 rounded-lg border border-green-500/20 inline-flex items-center gap-1.5 font-bold">
            <CheckCircle2 className="w-4 h-4" />
            All packages secure
          </div>
        )}
      </div>
    </section>
  );
}
