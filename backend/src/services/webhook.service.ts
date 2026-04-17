import crypto from "node:crypto";
import { repositoryAnalysisService } from "./repository-analysis.service";
import { webhookRepository } from "../repositories/webhook.repository";
import { repositoryRepository } from "../repositories/repository.repository";
import { env } from "../config/env";

interface GitHubWebhookPayload {
  action?: string;
  repository?: {
    owner?: {
      login?: string;
    };
    name?: string;
  };
}

export class WebhookService {
  verifySignature(signature: string | undefined, rawBody: string) {
    if (!env.GITHUB_WEBHOOK_SECRET) {
      return true;
    }

    if (!signature) {
      return false;
    }

    const expected = `sha256=${crypto
      .createHmac("sha256", env.GITHUB_WEBHOOK_SECRET)
      .update(rawBody)
      .digest("hex")}`;

    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  }

  async handleEvent(params: {
    event: string;
    deliveryId: string;
    signature?: string;
    rawBody: string;
    payload: GitHubWebhookPayload;
  }) {
    const owner = params.payload.repository?.owner?.login;
    const repo = params.payload.repository?.name;

    let repositoryId: string | undefined;
    if (owner && repo) {
      const repository = await repositoryRepository.findByOwnerAndName(owner, repo);
      repositoryId = repository?.id;
    }

    await webhookRepository.recordDelivery({
      repositoryId,
      deliveryId: params.deliveryId,
      event: params.event,
      signature: params.signature,
      payload: params.payload,
    });

    const shouldQueueAnalysis = ["issues", "pull_request", "push"].includes(params.event);
    if (shouldQueueAnalysis && owner && repo) {
      await repositoryAnalysisService.enqueueAnalysis(owner, repo, "webhook", true);
    }
  }
}

export const webhookService = new WebhookService();
