import { FastifyInstance } from "fastify";
import { insightsController } from "../controllers/insights.controller";

export async function insightRoutes(app: FastifyInstance) {
  app.get("/insights/:repo", insightsController.getInsight.bind(insightsController));
}
