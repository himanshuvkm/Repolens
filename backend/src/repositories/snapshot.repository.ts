import { prisma } from "../infrastructure/db/prisma";
import { RepositoryAnalytics } from "../domain/types/analytics";

export class SnapshotRepository {
  createMetricSnapshot(repositoryId: string, analytics: RepositoryAnalytics) {
    return prisma.repositoryMetricSnapshot.create({
      data: {
        repositoryId,
        averageIssueResponseHours: analytics.averageIssueResponseHours,
        pullRequestMergeRate: analytics.pullRequestMergeRate,
        maintainerActivityScore: analytics.maintainerActivityScore,
        beginnerFriendlinessScore: analytics.beginnerFriendlinessScore,
        healthScore: analytics.healthScore,
        healthSummary: analytics.healthSummary,
        prSuccessProbability: analytics.prSuccessProbability,
        openIssueCount: analytics.totals.openIssueCount,
        closedIssueCount: analytics.totals.closedIssueCount,
        openPullRequestCount: analytics.totals.openPullRequestCount,
        mergedPullRequestCount: analytics.totals.mergedPullRequestCount,
        activeMaintainerCount: analytics.totals.activeMaintainerCount,
        totalContributorCount: analytics.totals.totalContributorCount,
        goodFirstIssueCount: analytics.totals.goodFirstIssueCount,
        scoreBreakdown: analytics.scoreBreakdown,
      },
    });
  }

  createInsightSnapshot(repositoryId: string, provider: string, content: string) {
    return prisma.insightSnapshot.create({
      data: {
        repositoryId,
        provider,
        promptVersion: "v1",
        content,
      },
    });
  }
}

export const snapshotRepository = new SnapshotRepository();
