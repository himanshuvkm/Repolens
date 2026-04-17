import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  HOST: z.string().default("0.0.0.0"),
  LOG_LEVEL: z.string().default("info"),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  REDIS_URL: z.string().min(1, "REDIS_URL is required"),
  GITHUB_TOKEN: z.string().optional(),
  GITHUB_API_BASE_URL: z.string().url().default("https://api.github.com"),
  GITHUB_API_REQUESTS_PER_MINUTE: z.coerce.number().int().positive().default(60),
  GITHUB_CACHE_TTL_SECONDS: z.coerce.number().int().positive().default(600),
  GITHUB_SYNC_LOOKBACK_DAYS: z.coerce.number().int().positive().default(90),
  GITHUB_WEBHOOK_SECRET: z.string().optional(),
  ANALYZE_QUEUE_NAME: z.string().default("repo-analysis"),
  ANALYZE_WORKER_CONCURRENCY: z.coerce.number().int().positive().default(5),
  ANALYSIS_RESULT_TTL_MINUTES: z.coerce.number().int().positive().default(30),
  GEMINI_API_KEY: z.string().optional(),
});

export type AppEnv = z.infer<typeof envSchema>;

export const env = envSchema.parse(process.env);
