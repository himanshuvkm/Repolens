import { logger } from "../config/logger";

export class NotificationService {
  notifyAnalysisQueued(owner: string, repo: string, jobId: string) {
    logger.info({ owner, repo, jobId }, "Repository analysis queued");
  }

  notifyAnalysisCompleted(owner: string, repo: string, healthScore: number) {
    logger.info({ owner, repo, healthScore }, "Repository analysis completed");
  }

  notifyAnalysisFailed(owner: string, repo: string, error: string) {
    logger.error({ owner, repo, error }, "Repository analysis failed");
  }
}

export const notificationService = new NotificationService();
