export interface RepoMetadata {
  name: string;
  description: string;
  stars: number;
  forks: number;
  watchers: number;
  openIssues: number;
  topics: string[];
  license: string | null;
  homepage: string | null;
  createdAt: string;
  lastPushedAt: string;
  language: string;
}

export interface Commit {
  sha: string;
  message: string;
  authorName: string;
  date: string;
}

export interface PullRequest {
  title: string;
  state: 'open' | 'closed';
  createdAt: string;
  closedAt: string | null;
  mergedAt: string | null;
  authorType: 'maintainer' | 'contributor';
}

export interface Issue {
  title: string;
  state: string;
  createdAt: string;
  closedAt: string | null;
}

export interface FileNode {
  path: string;
  type: 'tree' | 'blob';
  size?: number;
}

export interface RepoAnalysisData {
  owner: string;
  repo: string;
  metadata: RepoMetadata;
  commits: Commit[];
  prs: PullRequest[];
  issues: Issue[];
  fileTree: FileNode[];
  languages: Record<string, number>;
  contributorsCount: number;
}

// Re-export specific enums/types if needed
