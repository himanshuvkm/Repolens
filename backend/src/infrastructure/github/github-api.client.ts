import { setTimeout as sleep } from "node:timers/promises";
import { env } from "../../config/env";
import { logger } from "../../config/logger";
import { redis } from "../cache/redis";
import { githubRateLimiter } from "./github-rate-limiter";

interface GitHubClientOptions {
  forceRefresh?: boolean;
}

export class GitHubApiClient {
  private readonly baseHeaders: Record<string, string>;

  constructor() {
    this.baseHeaders = {
      Accept: "application/vnd.github+json",
      "User-Agent": "repolens-backend",
      ...(env.GITHUB_TOKEN ? { Authorization: `Bearer ${env.GITHUB_TOKEN}` } : {}),
    };
  }

  async get<T>(path: string, options: GitHubClientOptions = {}): Promise<T> {
    const cacheKey = `github:${path}`;
    if (!options.forceRefresh) {
      const cachedValue = await redis.get(cacheKey);
      if (cachedValue) {
        return JSON.parse(cachedValue) as T;
      }
    }

    const result = await githubRateLimiter.schedule(() => this.requestWithRetry<T>(path));
    await redis.set(cacheKey, JSON.stringify(result), "EX", env.GITHUB_CACHE_TTL_SECONDS);
    return result;
  }

  private async requestWithRetry<T>(path: string): Promise<T> {
    const maxAttempts = 4;

    for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
      const response = await fetch(`${env.GITHUB_API_BASE_URL}${path}`, {
        headers: this.baseHeaders,
      });

      if (response.ok) {
        return (await response.json()) as T;
      }

      const isRetriable =
        response.status === 403 ||
        response.status === 429 ||
        response.status >= 500;

      if (!isRetriable || attempt === maxAttempts) {
        const errorBody = await response.text();
        throw new Error(
          `GitHub API request failed for ${path} with status ${response.status}: ${errorBody}`,
        );
      }

      const retryDelayMs = 1_000 * 2 ** (attempt - 1);
      logger.warn(
        { path, attempt, retryDelayMs, status: response.status },
        "Retrying GitHub API request",
      );
      await sleep(retryDelayMs);
    }

    throw new Error(`GitHub API request failed for ${path}`);
  }
}

export const githubApiClient = new GitHubApiClient();
