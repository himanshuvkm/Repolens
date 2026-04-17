import { AnalysisStatus, Prisma } from "@prisma/client";
import { prisma } from "../infrastructure/db/prisma";

export class RepositoryRepository {
  findByOwnerAndName(owner: string, name: string) {
    return prisma.repository.findFirst({
      where: {
        owner,
        name,
      },
    });
  }

  upsertRepository(data: Prisma.RepositoryUncheckedCreateInput) {
    return prisma.repository.upsert({
      where: {
        fullName: data.fullName,
      },
      update: data,
      create: data,
    });
  }

  getRepositoryGraph(repositoryId: string) {
    return prisma.repository.findUniqueOrThrow({
      where: { id: repositoryId },
      include: {
        contributors: true,
        issues: {
          include: {
            labels: true,
          },
        },
        pullRequests: {
          include: {
            reviews: true,
          },
        },
        metricSnapshots: {
          orderBy: {
            generatedAt: "desc",
          },
          take: 1,
        },
      },
    });
  }

  getLatestMetricSnapshot(repositoryId: string) {
    return prisma.repositoryMetricSnapshot.findFirst({
      where: { repositoryId },
      orderBy: {
        generatedAt: "desc",
      },
    });
  }

  getLatestInsightSnapshot(repositoryId: string) {
    return prisma.insightSnapshot.findFirst({
      where: { repositoryId },
      orderBy: {
        generatedAt: "desc",
      },
    });
  }

  createAnalysisRun(repositoryId: string, trigger: string) {
    return prisma.analysisRun.create({
      data: {
        repositoryId,
        status: AnalysisStatus.queued,
        trigger,
      },
    });
  }

  updateAnalysisRun(
    runId: string,
    data: {
      status: AnalysisStatus;
      errorMessage?: string | null;
      startedAt?: Date | null;
      completedAt?: Date | null;
      metricSnapshotId?: string | null;
      insightSnapshotId?: string | null;
    },
  ) {
    return prisma.analysisRun.update({
      where: { id: runId },
      data,
    });
  }
}

export const repositoryRepository = new RepositoryRepository();
