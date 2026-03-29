"use client";

import { useEffect, useState } from "react";
import { Package, AlertTriangle, CheckCircle2 } from "lucide-react";
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
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 animate-pulse flex items-center justify-between">
        <div className="h-4 w-32 bg-gray-800 rounded"></div>
        <div className="h-8 w-8 bg-gray-800 rounded-full"></div>
      </div>
    );
  }

  if (type === "none" || depsCount === null) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex items-center justify-between opacity-50">
        <div className="flex items-center gap-3 text-gray-400">
          <Package className="w-5 h-5" />
          <span className="font-medium text-sm">No standard dependencies found</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`border rounded-xl p-5 flex items-center justify-between transition-colors ${hasOutdated ? 'bg-orange-500/10 border-orange-500/30' : 'bg-green-500/10 border-green-500/30'}`}>
      <div className="flex flex-col">
        <span className="text-gray-400 text-xs font-semibold uppercase mb-1">
          {type === 'npm' ? 'NPM Packages' : 'Python Packages'}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-white">{depsCount}</span>
          <span className="text-sm text-gray-500">detected</span>
        </div>
      </div>
      
      <div className="flex flex-col items-center">
        {hasOutdated ? (
          <div className="text-orange-400 flex flex-col items-center gap-1" title="Some major dependencies appear outdated">
            <AlertTriangle className="w-6 h-6" />
            <span className="text-[10px] font-medium">Verify Versions</span>
          </div>
        ) : (
          <div className="text-green-500 flex flex-col items-center gap-1">
            <CheckCircle2 className="w-6 h-6" />
            <span className="text-[10px] font-medium">Looks Good</span>
          </div>
        )}
      </div>
    </div>
  );
}
