import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { insightsService } from "../services/insights.service";
import { repositoryAnalysisService } from "../services/repository-analysis.service";

const paramsSchema = z.object({
  repo: z.string().min(1),
});

const querySchema = z.object({
  owner: z.string().min(1),
});

export class InsightsController {
  async getInsight(request: FastifyRequest, reply: FastifyReply) {
    const { repo } = paramsSchema.parse(request.params);
    const { owner } = querySchema.parse(request.query);

    let insight = await insightsService.getInsight(owner, repo);
    if (!insight) {
      await repositoryAnalysisService.analyzeNow(owner, repo, "api-read");
      insight = await insightsService.getInsight(owner, repo);
    }

    if (!insight) {
      return reply.status(404).send({
        message: "No insight is available for this repository. Configure GEMINI_API_KEY and analyze the repo first.",
      });
    }

    return reply.send({
      owner,
      repo,
      provider: insight.provider,
      generatedAt: insight.generatedAt.toISOString(),
      content: insight.content,
    });
  }
}

export const insightsController = new InsightsController();
