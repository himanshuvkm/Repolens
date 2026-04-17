import { JobsOptions, Queue } from "bullmq";
import { env } from "../../config/env";
import { redis } from "../cache/redis";

export const analyzeRepositoryQueue = new Queue(env.ANALYZE_QUEUE_NAME, {
  connection: redis,
  defaultJobOptions: {
    attempts: 4,
    backoff: {
      type: "exponential",
      delay: 5_000,
    },
    removeOnComplete: 250,
    removeOnFail: 500,
  } satisfies JobsOptions,
});
