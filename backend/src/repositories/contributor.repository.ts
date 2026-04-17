import { prisma } from "../infrastructure/db/prisma";

interface UpsertContributorInput {
  githubId: bigint;
  login: string;
  avatarUrl?: string | null;
  type?: string | null;
  siteAdmin?: boolean;
}

export class ContributorRepository {
  upsertContributor(input: UpsertContributorInput) {
    return prisma.contributor.upsert({
      where: {
        githubId: input.githubId,
      },
      update: {
        login: input.login,
        avatarUrl: input.avatarUrl ?? null,
        type: input.type ?? null,
        siteAdmin: input.siteAdmin ?? false,
      },
      create: {
        githubId: input.githubId,
        login: input.login,
        avatarUrl: input.avatarUrl ?? null,
        type: input.type ?? null,
        siteAdmin: input.siteAdmin ?? false,
      },
    });
  }

  async replaceRepositoryContributors(params: {
    repositoryId: string;
    contributors: Array<{
      contributorId: string;
      contributions: number;
      isMaintainer: boolean;
    }>;
  }) {
    await prisma.repositoryContributor.deleteMany({
      where: {
        repositoryId: params.repositoryId,
      },
    });

    if (params.contributors.length === 0) {
      return;
    }

    await prisma.repositoryContributor.createMany({
      data: params.contributors.map((contributor) => ({
        repositoryId: params.repositoryId,
        contributorId: contributor.contributorId,
        contributions: contributor.contributions,
        isMaintainer: contributor.isMaintainer,
      })),
      skipDuplicates: true,
    });
  }
}

export const contributorRepository = new ContributorRepository();
