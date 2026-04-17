import Fastify from "fastify";
import cors from "@fastify/cors";
import rateLimit from "@fastify/rate-limit";
import { env } from "./config/env";
import { logger } from "./config/logger";
import { registerErrorHandler } from "./plugins/error-handler";
import { insightRoutes } from "./routes/insights.routes";
import { repositoryRoutes } from "./routes/repository.routes";
import { webhookRoutes } from "./routes/webhook.routes";

export async function buildApp() {
  const app = Fastify({
    logger,
    bodyLimit: 1_048_576,
  });

  await app.register(cors, {
    origin: true,
  });

  await app.register(rateLimit, {
    max: 100,
    timeWindow: "1 minute",
  });

  app.addContentTypeParser(
    "application/json",
    { parseAs: "string" },
    (_request, body, done) => done(null, body),
  );

  app.addHook("preHandler", async (request) => {
    if (
      request.headers["content-type"]?.includes("application/json") &&
      typeof request.body === "string" &&
      !request.url.startsWith("/webhooks/")
    ) {
      request.body = JSON.parse(request.body);
    }
  });

  await app.register(repositoryRoutes);
  await app.register(insightRoutes);
  await app.register(webhookRoutes);
  await registerErrorHandler(app);

  app.get("/health", async () => ({
    status: "ok",
    environment: env.NODE_ENV,
  }));

  return app;
}
