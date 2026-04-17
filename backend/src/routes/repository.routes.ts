import { FastifyInstance } from "fastify";
import { repositoryController } from "../controllers/repository.controller";

export async function repositoryRoutes(app: FastifyInstance) {
  app.get("/repo/:owner/:repo", repositoryController.getRepositoryAnalytics.bind(repositoryController));
  app.post("/analyze", repositoryController.analyzeRepository.bind(repositoryController));
}
