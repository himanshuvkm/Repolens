import { Job, Worker } from "bullmq";
import { env } from "../config/env";
import { logger } from "../config/logger";
import { AnalyzeRepositoryJobPayload } from "../infrastructure/queue/job-types";
import { redis } from "../infrastructure/cache/redis";
import { repositoryAnalysisService } from "../services/repository-analysis.service";

const worker = new Worker<AnalyzeRepositoryJobPayload>(
  env.ANALYZE_QUEUE_NAME,
  async (job: Job<AnalyzeRepositoryJobPayload>) => {
    const { owner, repo, forceRefresh, trigger } = job.data;
    await repositoryAnalysisService.analyzeNow(owner, repo, trigger, forceRefresh);
  },
  {
    connection: redis,
    concurrency: env.ANALYZE_WORKER_CONCURRENCY,
  },
);

worker.on("completed", (job) => {
  logger.info({ jobId: job.id, data: job.data }, "Analysis worker completed job");
});

worker.on("failed", (job, error) => {
  logger.error({ jobId: job?.id, data: job?.data, error }, "Analysis worker failed job");
});

process.on("SIGTERM", async () => {
  await worker.close();
});

process.on("SIGINT", async () => {
  await worker.close();
});
