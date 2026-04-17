import { Issue, PullRequest, Repository, RepositoryContributor } from "@prisma/client";
import { RepositoryAnalytics } from "../types/analytics";

type IssueWithLabels = Issue & { labels: { name: string }[] };
type PullRequestWithReviews = PullRequest & { reviews: { submittedAt: Date | null }[] };

export function calculateRepositoryAnalytics(params: {
  repository: Repository;
  issues: IssueWithLabels[];
  pullRequests: PullRequestWithReviews[];
  contributors: RepositoryContributor[];
}): RepositoryAnalytics {
  const { repository, issues, pullRequests, contributors } = params;

  const issueResponseDurations = issues
    .filter((issue) => issue.firstMaintainerResponseAt)
    .map(
      (issue) =>
        (issue.firstMaintainerResponseAt!.getTime() - issue.createdAt.getTime()) /
        (1000 * 60 * 60),
    );

  const averageIssueResponseHours =
    issueResponseDurations.length > 0
      ? Number(
          (
            issueResponseDurations.reduce((sum, value) => sum + value, 0) /
            issueResponseDurations.length
          ).toFixed(2),
        )
      : 0;

  const closedPullRequests = pullRequests.filter((pr) => pr.state === "closed");
  const mergedPullRequests = pullRequests.filter((pr) => pr.mergedAt);
  const pullRequestMergeRate =
    closedPullRequests.length > 0
      ? Number((mergedPullRequests.length / closedPullRequests.length).toFixed(4))
      : 0;

  const maintainers = contributors.filter((contributor) => contributor.isMaintainer);
  const activeMaintainers = maintainers.filter((contributor) => contributor.contributions > 0);
  const maintainerActivityScore = Math.min(
    100,
    Number(
      (
        activeMaintainers.length * 18 +
        mergedPullRequests.length * 1.2 +
        issues.filter((issue) => issue.firstMaintainerResponseAt).length * 1.5
      ).toFixed(2),
    ),
  );

  const goodFirstIssueCount = issues.filter((issue) =>
    issue.labels.some((label) => normalizeLabel(label.name).includes("good first issue")),
  ).length;
  const helpWantedCount = issues.filter((issue) =>
    issue.labels.some((label) => normalizeLabel(label.name).includes("help wanted")),
  ).length;
  const beginnerFriendlinessScore = Math.min(
    100,
    Number((goodFirstIssueCount * 20 + helpWantedCount * 10 + (repository.topics.includes("hacktoberfest") ? 10 : 0)).toFixed(2)),
  );

  const healthComponents = {
    freshness: repository.pushedAt ? freshnessScore(repository.pushedAt) : 20,
    mergeRate: pullRequestMergeRate * 100,
    responsiveness: responseScore(averageIssueResponseHours),
    maintainerActivity: maintainerActivityScore,
    beginnerSupport: beginnerFriendlinessScore,
  };

  const healthScore = Math.round(
    healthComponents.freshness * 0.25 +
      healthComponents.mergeRate * 0.25 +
      healthComponents.responsiveness * 0.2 +
      healthComponents.maintainerActivity * 0.2 +
      healthComponents.beginnerSupport * 0.1,
  );

  const prSuccessProbability = Number(
    Math.min(
      0.98,
      Math.max(
        0.05,
        pullRequestMergeRate * 0.45 +
          (maintainerActivityScore / 100) * 0.25 +
          (beginnerFriendlinessScore / 100) * 0.15 +
          (responseScore(averageIssueResponseHours) / 100) * 0.15,
      ),
    ).toFixed(4),
  );

  const healthSummary = buildHealthSummary({
    healthScore,
    averageIssueResponseHours,
    pullRequestMergeRate,
    beginnerFriendlinessScore,
    activeMaintainers: activeMaintainers.length,
  });

  return {
    averageIssueResponseHours,
    pullRequestMergeRate,
    maintainerActivityScore,
    beginnerFriendlinessScore,
    healthScore,
    healthSummary,
    prSuccessProbability,
    scoreBreakdown: {
      ...healthComponents,
      goodFirstIssueCount,
      helpWantedCount,
    },
    totals: {
      openIssueCount: issues.filter((issue) => issue.state === "open").length,
      closedIssueCount: issues.filter((issue) => issue.state === "closed").length,
      openPullRequestCount: pullRequests.filter((pr) => pr.state === "open").length,
      mergedPullRequestCount: mergedPullRequests.length,
      activeMaintainerCount: activeMaintainers.length,
      totalContributorCount: contributors.length,
      goodFirstIssueCount,
    },
  };
}

function freshnessScore(lastPush: Date): number {
  const daysSincePush = (Date.now() - lastPush.getTime()) / (1000 * 60 * 60 * 24);
  if (daysSincePush <= 7) return 100;
  if (daysSincePush <= 30) return 85;
  if (daysSincePush <= 90) return 65;
  if (daysSincePush <= 180) return 40;
  return 15;
}

function responseScore(hours: number): number {
  if (hours === 0) return 35;
  if (hours <= 24) return 100;
  if (hours <= 72) return 75;
  if (hours <= 168) return 50;
  return 20;
}

function normalizeLabel(value: string): string {
  return value.trim().toLowerCase();
}

function buildHealthSummary(params: {
  healthScore: number;
  averageIssueResponseHours: number;
  pullRequestMergeRate: number;
  beginnerFriendlinessScore: number;
  activeMaintainers: number;
}): string {
  const { healthScore, averageIssueResponseHours, pullRequestMergeRate, beginnerFriendlinessScore, activeMaintainers } = params;

  if (healthScore >= 80) {
    return `Healthy repository with ${activeMaintainers} active maintainers, ${Math.round(
      pullRequestMergeRate * 100,
    )}% PR merge rate, and strong contributor support.`;
  }

  if (healthScore >= 60) {
    return `Moderately healthy repository with acceptable maintainer coverage. Average issue response time is ${averageIssueResponseHours} hours and beginner-friendliness score is ${beginnerFriendlinessScore}.`;
  }

  return `Repository needs attention: slower response patterns, lower merge efficiency, or limited maintainer bandwidth are pulling health below target.`;
}
