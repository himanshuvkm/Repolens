import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { repositoryAnalysisService } from "../services/repository-analysis.service";

const repoParamsSchema = z.object({
  owner: z.string().min(1),
  repo: z.string().min(1),
});

const analyzeBodySchema = z.object({
  owner: z.string().min(1),
  repo: z.string().min(1),
  forceRefresh: z.boolean().optional().default(false),
});

export class RepositoryController {
  async getRepositoryAnalytics(request: FastifyRequest, reply: FastifyReply) {
    const { owner, repo } = repoParamsSchema.parse(request.params);
    const result = await repositoryAnalysisService.getRepositoryAnalytics(owner, repo);
    return reply.send(result);
  }

  async analyzeRepository(request: FastifyRequest, reply: FastifyReply) {
    const body = analyzeBodySchema.parse(request.body);
    const result = await repositoryAnalysisService.enqueueAnalysis(
      body.owner,
      body.repo,
      "manual",
      body.forceRefresh,
    );
    return reply.status(202).send(result);
  }
}

export const repositoryController = new RepositoryController();
