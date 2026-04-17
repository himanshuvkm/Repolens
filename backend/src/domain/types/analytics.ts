export interface RepositoryAnalytics {
  averageIssueResponseHours: number;
  pullRequestMergeRate: number;
  maintainerActivityScore: number;
  beginnerFriendlinessScore: number;
  healthScore: number;
  healthSummary: string;
  prSuccessProbability: number;
  scoreBreakdown: Record<string, number | string>;
  totals: {
    openIssueCount: number;
    closedIssueCount: number;
    openPullRequestCount: number;
    mergedPullRequestCount: number;
    activeMaintainerCount: number;
    totalContributorCount: number;
    goodFirstIssueCount: number;
  };
}

export interface RepositoryAnalyticsResponse {
  repository: {
    owner: string;
    repo: string;
    fullName: string;
    description: string | null;
    defaultBranch: string | null;
    primaryLanguage: string | null;
    stars: number;
    forks: number;
    watchers: number;
    topics: string[];
    archived: boolean;
    lastSyncedAt: string | null;
  };
  analytics: RepositoryAnalytics;
  generatedAt: string;
}
