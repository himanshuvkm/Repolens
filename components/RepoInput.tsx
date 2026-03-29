"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowRight } from "lucide-react";
import { GithubIcon as Github } from "@/components/GithubIcon";

export function RepoInput() {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!url.trim()) {
      setError("Please enter a GitHub repository URL");
      return;
    }

    try {
      // Basic URL parsing to extract owner and repo
      const parsedUrl = new URL(url.trim());
      if (parsedUrl.hostname !== "github.com") {
        throw new Error("Invalid GitHub Domain");
      }
      
      const pathParts = parsedUrl.pathname.split("/").filter(Boolean);
      if (pathParts.length < 2) {
        throw new Error("Invalid repository format");
      }

      const owner = pathParts[0];
      const repo = pathParts[1];

      router.push(`/report/${owner}/${repo}`);
    } catch (err) {
      setError("Please enter a valid GitHub URL (e.g., https://github.com/vercel/next.js)");
    }
  };

  const handleChipClick = (exampleRepo: string) => {
    setUrl(`https://github.com/${exampleRepo}`);
    const [owner, repo] = exampleRepo.split("/");
    router.push(`/report/${owner}/${repo}`);
  }

  const exampleRepos = ["vercel/next.js", "facebook/react", "shadcn-ui/ui"];

  return (
    <div className="w-full max-w-3xl mx-auto px-4">
      <form onSubmit={handleAnalyze} className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
        <div className="relative flex items-center bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">
          <div className="pl-6 text-gray-400">
            <Github className="w-6 h-6" />
          </div>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://github.com/owner/repo"
            className="w-full bg-transparent text-white px-6 py-5 text-lg outline-none placeholder:text-gray-500"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-5 font-semibold transition-colors flex items-center gap-2 m-1 rounded-xl"
          >
            Analyze <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </form>
      
      {error && (
        <p className="text-red-400 mt-3 text-center animate-in fade-in slide-in-from-top-2">
          {error}
        </p>
      )}

      <div className="mt-8 flex flex-col items-center">
        <p className="text-sm text-gray-500 mb-4">Or try one of these examples:</p>
        <div className="flex flex-wrap justify-center gap-3">
          {exampleRepos.map((repo) => (
            <button
              key={repo}
              onClick={() => handleChipClick(repo)}
              className="px-4 py-2 rounded-full border border-gray-800 bg-gray-900/50 text-gray-300 hover:text-white hover:border-blue-500/50 hover:bg-blue-500/10 transition-all text-sm flex items-center gap-2"
            >
              <Github className="w-4 h-4" />
              {repo}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
