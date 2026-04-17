import { AnalysisStatus } from "@prisma/client";
import { calculateRepositoryAnalytics } from "../domain/analytics/repository-analytics";
import { RepositoryAnalyticsResponse } from "../domain/types/analytics";
import { analyzeRepositoryQueue } from "../infrastructure/queue/queues";
import { repositoryRepository } from "../repositories/repository.repository";
import { snapshotRepository } from "../repositories/snapshot.repository";
import { githubSyncService } from "./github-sync.service";
import { notificationService } from "./notification.service";
import { insightsService } from "./insights.service";

export class RepositoryAnalysisService {
  async enqueueAnalysis(owner: string, repo: string, trigger: "manual" | "webhook" | "scheduled" | "api-read", forceRefresh = false) {
    const repository = await githubSyncService.syncRepository(owner, repo, forceRefresh);
    const analysisRun = await repositoryRepository.createAnalysisRun(repository.id, trigger);
    const jobId = `${owner}/${repo}`;

    await analyzeRepositoryQueue.add(
      "analyze-repository",
      {
        owner,
        repo,
        forceRefresh,
        trigger,
      },
      {
        jobId,
      },
    );

    notificationService.notifyAnalysisQueued(owner, repo, jobId);

    return {
      analysisRunId: analysisRun.id,
      jobId,
      status: "queued" as const,
    };
  }

  async analyzeNow(owner: string, repo: string, trigger: "manual" | "webhook" | "scheduled" | "api-read", forceRefresh = false) {
    const repository = await githubSyncService.syncRepository(owner, repo, forceRefresh);
    const analysisRun = await repositoryRepository.createAnalysisRun(repository.id, trigger);

    await repositoryRepository.updateAnalysisRun(analysisRun.id, {
      status: AnalysisStatus.processing,
      startedAt: new Date(),
    });

    try {
      const repositoryGraph = await repositoryRepository.getRepositoryGraph(repository.id);
      const analytics = calculateRepositoryAnalytics({
        repository: repositoryGraph,
        issues: repositoryGraph.issues,
        pullRequests: repositoryGraph.pullRequests,
        contributors: repositoryGraph.contributors,
      });

      const metricSnapshot = await snapshotRepository.createMetricSnapshot(repository.id, analytics);
      const insightSnapshot = await insightsService.generateAndStoreInsight(repository.id, repository.fullName, analytics);

      await repositoryRepository.updateAnalysisRun(analysisRun.id, {
        status: AnalysisStatus.completed,
        completedAt: new Date(),
        metricSnapshotId: metricSnapshot.id,
        insightSnapshotId: insightSnapshot?.id ?? null,
      });

      notificationService.notifyAnalysisCompleted(owner, repo, analytics.healthScore);
      return { repository, analytics, metricSnapshot, insightSnapshot };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown analysis error";
      await repositoryRepository.updateAnalysisRun(analysisRun.id, {
        status: AnalysisStatus.failed,
        completedAt: new Date(),
        errorMessage: message,
      });
      notificationService.notifyAnalysisFailed(owner, repo, message);
      throw error;
    }
  }

  async getRepositoryAnalytics(owner: string, repo: string): Promise<RepositoryAnalyticsResponse> {
    let repository = await repositoryRepository.findByOwnerAndName(owner, repo);
    let snapshot = repository ? await repositoryRepository.getLatestMetricSnapshot(repository.id) : null;

    const isStale =
      !snapshot || (Date.now() - snapshot.generatedAt.getTime()) / (1000 * 60) > 30;

    if (!repository || isStale) {
      const result = await this.analyzeNow(owner, repo, "api-read");
      repository = result.repository;
      snapshot = result.metricSnapshot;
    }

    if (!repository || !snapshot) {
      throw new Error(`Analytics snapshot unavailable for ${owner}/${repo}`);
    }

    return {
      repository: {
        owner: repository.owner,
        repo: repository.name,
        fullName: repository.fullName,
        description: repository.description,
        defaultBranch: repository.defaultBranch,
        primaryLanguage: repository.primaryLanguage,
        stars: repository.stars,
        forks: repository.forks,
        watchers: repository.watchers,
        topics: repository.topics,
        archived: repository.archived,
        lastSyncedAt: repository.lastSyncedAt?.toISOString() ?? null,
      },
      analytics: {
        averageIssueResponseHours: snapshot.averageIssueResponseHours,
        pullRequestMergeRate: snapshot.pullRequestMergeRate,
        maintainerActivityScore: snapshot.maintainerActivityScore,
        beginnerFriendlinessScore: snapshot.beginnerFriendlinessScore,
        healthScore: snapshot.healthScore,
        healthSummary: snapshot.healthSummary,
        prSuccessProbability: snapshot.prSuccessProbability ?? 0,
        scoreBreakdown: snapshot.scoreBreakdown as Record<string, number | string>,
        totals: {
          openIssueCount: snapshot.openIssueCount,
          closedIssueCount: snapshot.closedIssueCount,
          openPullRequestCount: snapshot.openPullRequestCount,
          mergedPullRequestCount: snapshot.mergedPullRequestCount,
          activeMaintainerCount: snapshot.activeMaintainerCount,
          totalContributorCount: snapshot.totalContributorCount,
          goodFirstIssueCount: snapshot.goodFirstIssueCount,
        },
      },
      generatedAt: snapshot.generatedAt.toISOString(),
    };
  }
}

export const repositoryAnalysisService = new RepositoryAnalysisService();
