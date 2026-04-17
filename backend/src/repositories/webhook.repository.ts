import { prisma } from "../infrastructure/db/prisma";

export class WebhookRepository {
  recordDelivery(params: {
    repositoryId?: string;
    deliveryId: string;
    event: string;
    signature?: string;
    payload: unknown;
  }) {
    return prisma.webhookDelivery.upsert({
      where: {
        deliveryId: params.deliveryId,
      },
      update: {
        processedAt: new Date(),
      },
      create: {
        repositoryId: params.repositoryId,
        deliveryId: params.deliveryId,
        event: params.event,
        signature: params.signature,
        payload: params.payload as never,
        processedAt: new Date(),
      },
    });
  }
}

export const webhookRepository = new WebhookRepository();
