import { FastifyReply, FastifyRequest } from "fastify";
import { webhookService } from "../services/webhook.service";

export class WebhookController {
  async handleGitHubWebhook(request: FastifyRequest, reply: FastifyReply) {
    const rawBody = request.body as string;
    const signature = request.headers["x-hub-signature-256"] as string | undefined;
    const deliveryId = request.headers["x-github-delivery"] as string | undefined;
    const event = request.headers["x-github-event"] as string | undefined;

    if (!deliveryId || !event) {
      return reply.status(400).send({
        message: "Missing GitHub webhook headers.",
      });
    }

    const isValid = webhookService.verifySignature(signature, rawBody);
    if (!isValid) {
      return reply.status(401).send({
        message: "Invalid webhook signature.",
      });
    }

    const payload = JSON.parse(rawBody) as Record<string, unknown>;
    await webhookService.handleEvent({
      event,
      deliveryId,
      signature,
      rawBody,
      payload,
    });

    return reply.status(202).send({
      status: "accepted",
      deliveryId,
      event,
    });
  }
}

export const webhookController = new WebhookController();
