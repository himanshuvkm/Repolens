import { prisma } from "../infrastructure/db/prisma";

export class IssueRepository {
  async replaceRepositoryIssues(params: {
    repositoryId: string;
    issues: Array<{
      githubId: bigint;
      authorId?: string | null;
      number: number;
      title: string;
      state: "open" | "closed";
      isPullRequest: boolean;
      authorAssociation?: string | null;
      createdAt: Date;
      updatedAt: Date;
      closedAt?: Date | null;
      firstMaintainerResponseAt?: Date | null;
      labels: string[];
      comments: Array<{
        githubId: bigint;
        authorId?: string | null;
        authorAssociation?: string | null;
        body?: string | null;
        createdAt: Date;
        updatedAt: Date;
      }>;
    }>;
  }) {
    await prisma.issue.deleteMany({
      where: {
        repositoryId: params.repositoryId,
      },
    });

    for (const issue of params.issues) {
      await prisma.issue.create({
        data: {
          repositoryId: params.repositoryId,
          githubId: issue.githubId,
          authorId: issue.authorId ?? null,
          number: issue.number,
          title: issue.title,
          state: issue.state,
          isPullRequest: issue.isPullRequest,
          authorAssociation: issue.authorAssociation ?? null,
          createdAt: issue.createdAt,
          updatedAt: issue.updatedAt,
          closedAt: issue.closedAt ?? null,
          firstMaintainerResponseAt: issue.firstMaintainerResponseAt ?? null,
          labels: {
            create: issue.labels.map((label) => ({
              name: label,
            })),
          },
          comments: {
            create: issue.comments.map((comment) => ({
              githubId: comment.githubId,
              authorId: comment.authorId ?? null,
              authorAssociation: comment.authorAssociation ?? null,
              body: comment.body ?? null,
              createdAt: comment.createdAt,
              updatedAt: comment.updatedAt,
            })),
          },
        },
      });
    }
  }
}

export const issueRepository = new IssueRepository();
