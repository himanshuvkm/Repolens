import Bottleneck from "bottleneck";
import { env } from "../../config/env";

export const githubRateLimiter = new Bottleneck({
  maxConcurrent: 4,
  minTime: Math.ceil(60_000 / env.GITHUB_API_REQUESTS_PER_MINUTE),
});
