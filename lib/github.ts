import { RepoMetadata, Commit, PullRequest, Issue, FileNode, RepoAnalysisData } from "@/types";

const GITHUB_API_URL = "https://api.github.com";

async function fetchFromGitHub(endpoint: string, options: RequestInit = {}) {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
  };
  
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const response = await fetch(`${GITHUB_API_URL}${endpoint}`, {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
    next: { revalidate: 3600 } // Cache for 1 hour to prevent rate limits
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("Repository not found");
    }
    if (response.status === 403 || response.status === 429) {
      throw new Error("GitHub API rate limit exceeded. Please configure a personal access token.");
    }
    throw new Error(`GitHub API error: ${response.statusText}`);
  }

  return response.json();
}

export async function getRepoMetadata(owner: string, repo: string): Promise<RepoMetadata> {
  const data = await fetchFromGitHub(`/repos/${owner}/${repo}`);
  return {
    name: data.name,
    description: data.description,
    stars: data.stargazers_count,
    forks: data.forks_count,
    watchers: data.subscribers_count,
    openIssues: data.open_issues_count,
    topics: data.topics || [],
    license: data.license?.name || null,
    homepage: data.homepage || null,
    createdAt: data.created_at,
    lastPushedAt: data.pushed_at,
    language: data.language,
  };
}

export async function getRecentCommits(owner: string, repo: string): Promise<Commit[]> {
  const data = await fetchFromGitHub(`/repos/${owner}/${repo}/commits?per_page=30`);
  return data.map((item: any) => ({
    sha: item.sha,
    message: item.commit.message,
    authorName: item.commit.author?.name || 'Unknown',
    date: item.commit.author?.date,
  }));
}

export async function getRecentPRs(owner: string, repo: string): Promise<PullRequest[]> {
  const data = await fetchFromGitHub(`/repos/${owner}/${repo}/pulls?state=all&per_page=20`);
  return data.map((item: any) => ({
    title: item.title,
    state: item.state,
    createdAt: item.created_at,
    closedAt: item.closed_at,
    mergedAt: item.merged_at,
    authorType: item.author_association === 'MEMBER' || item.author_association === 'OWNER' ? 'maintainer' : 'contributor',
  }));
}

export async function getRecentIssues(owner: string, repo: string): Promise<Issue[]> {
  // Exclude PRs which are also treated as issues by GitHub API
  const data = await fetchFromGitHub(`/repos/${owner}/${repo}/issues?state=all&per_page=30`);
  const filtered = data.filter((item: any) => !item.pull_request).slice(0, 20);
  return filtered.map((item: any) => ({
    title: item.title,
    state: item.state,
    createdAt: item.created_at,
    closedAt: item.closed_at,
  }));
}

export async function getContributorsCount(owner: string, repo: string): Promise<number> {
  try {
    const data = await fetchFromGitHub(`/repos/${owner}/${repo}/contributors?per_page=1&anon=true`);
    // Ideally we would parse the Link header for exact count, but fetching length is fine for small repos or simply using >0 heuristic
    // For simplicity, we just fetch a handful to see if it's active
    const fullData = await fetchFromGitHub(`/repos/${owner}/${repo}/contributors?per_page=100`);
    return fullData.length;
  } catch {
    return 1;
  }
}

export async function getLanguages(owner: string, repo: string): Promise<Record<string, number>> {
  return await fetchFromGitHub(`/repos/${owner}/${repo}/languages`);
}

export async function getFileTree(owner: string, repo: string, defaultBranch: string = 'main'): Promise<FileNode[]> {
  try {
    const data = await fetchFromGitHub(`/repos/${owner}/${repo}/git/trees/${defaultBranch}?recursive=1`);
    if (data.truncated) {
      console.warn("Tree is truncated, repo might be too large");
    }
    // Limit to 2 levels deep heuristically or just parse the paths
    return data.tree
      .filter((item: any) => item.path.split('/').length <= 2)
      .map((item: any) => ({
        path: item.path,
        type: item.type,
        size: item.size
      }));
  } catch {
    return [];
  }
}

export async function analyzeRepo(owner: string, repo: string): Promise<RepoAnalysisData> {
  const metadata = await getRepoMetadata(owner, repo);
  const defaultBranch = metadata.name ? 'master' : 'main'; // Approximation, ideally fetch default_branch from metadata
  
  // Need the actual default branch for accurate tree
  const rawMeta = await fetchFromGitHub(`/repos/${owner}/${repo}`);
  const actualBranch = rawMeta.default_branch || 'main';

  const [
    commits, prs, issues, languages, contributorsCount, fileTree
  ] = await Promise.all([
    getRecentCommits(owner, repo),
    getRecentPRs(owner, repo),
    getRecentIssues(owner, repo),
    getLanguages(owner, repo),
    getContributorsCount(owner, repo),
    getFileTree(owner, repo, actualBranch)
  ]);

  return {
    owner,
    repo,
    metadata,
    commits,
    prs,
    issues,
    languages,
    contributorsCount,
    fileTree
  };
}
