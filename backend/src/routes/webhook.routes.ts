import { FastifyInstance } from "fastify";
import { webhookController } from "../controllers/webhook.controller";

export async function webhookRoutes(app: FastifyInstance) {
  app.post("/webhooks/github", webhookController.handleGitHubWebhook.bind(webhookController));
}
