import IORedis from "ioredis";
import { env } from "../../config/env";

declare global {
  var __repolensRedis: IORedis | undefined;
}

export const redis =
  global.__repolensRedis ??
  new IORedis(env.REDIS_URL, {
    maxRetriesPerRequest: null,
    enableReadyCheck: true,
    lazyConnect: false,
  });

if (process.env.NODE_ENV !== "production") {
  global.__repolensRedis = redis;
}
