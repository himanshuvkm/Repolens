import { prisma } from "../infrastructure/db/prisma";

export class PullRequestRepository {
  async replaceRepositoryPullRequests(params: {
    repositoryId: string;
    pullRequests: Array<{
      githubId: bigint;
      authorId?: string | null;
      number: number;
      title: string;
      state: "open" | "closed";
      draft: boolean;
      authorAssociation?: string | null;
      additions: number;
      deletions: number;
      changedFiles: number;
      commits: number;
      createdAt: Date;
      updatedAt: Date;
      closedAt?: Date | null;
      mergedAt?: Date | null;
      labels: string[];
      reviews: Array<{
        githubId: bigint;
        reviewerId?: string | null;
        state?: string | null;
        submittedAt?: Date | null;
      }>;
    }>;
  }) {
    await prisma.pullRequest.deleteMany({
      where: {
        repositoryId: params.repositoryId,
      },
    });

    for (const pullRequest of params.pullRequests) {
      await prisma.pullRequest.create({
        data: {
          repositoryId: params.repositoryId,
          githubId: pullRequest.githubId,
          authorId: pullRequest.authorId ?? null,
          number: pullRequest.number,
          title: pullRequest.title,
          state: pullRequest.state,
          draft: pullRequest.draft,
          authorAssociation: pullRequest.authorAssociation ?? null,
          additions: pullRequest.additions,
          deletions: pullRequest.deletions,
          changedFiles: pullRequest.changedFiles,
          commits: pullRequest.commits,
          createdAt: pullRequest.createdAt,
          updatedAt: pullRequest.updatedAt,
          closedAt: pullRequest.closedAt ?? null,
          mergedAt: pullRequest.mergedAt ?? null,
          labels: {
            create: pullRequest.labels.map((label) => ({
              name: label,
            })),
          },
          reviews: {
            create: pullRequest.reviews.map((review) => ({
              githubId: review.githubId,
              reviewerId: review.reviewerId ?? null,
              state: review.state ?? null,
              submittedAt: review.submittedAt ?? null,
            })),
          },
        },
      });
    }
  }
}

export const pullRequestRepository = new PullRequestRepository();
