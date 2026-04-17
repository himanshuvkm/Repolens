import { GoogleGenAI } from "@google/genai";
import { RepositoryAnalytics } from "../domain/types/analytics";
import { repositoryRepository } from "../repositories/repository.repository";
import { snapshotRepository } from "../repositories/snapshot.repository";
import { env } from "../config/env";

export class InsightsService {
  private client = env.GEMINI_API_KEY
    ? new GoogleGenAI({
        apiKey: env.GEMINI_API_KEY,
      })
    : null;

  async generateAndStoreInsight(repositoryId: string, fullName: string, analytics: RepositoryAnalytics) {
    if (!this.client) {
      return null;
    }

    const prompt = [
      "You are explaining repository analytics to an engineering manager.",
      "Use 3 short paragraphs and keep the wording concrete.",
      "Do not invent data. Focus only on the provided analytics.",
      `Repository: ${fullName}`,
      `Analytics JSON: ${JSON.stringify(analytics)}`,
    ].join("\n");

    const response = await this.client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const content = response.text?.trim();
    if (!content) {
      return null;
    }

    return snapshotRepository.createInsightSnapshot(repositoryId, "gemini-2.5-flash", content);
  }

  async getInsight(owner: string, repo: string) {
    const repository = await repositoryRepository.findByOwnerAndName(owner, repo);
    if (!repository) {
      return null;
    }

    return repositoryRepository.getLatestInsightSnapshot(repository.id);
  }
}

export const insightsService = new InsightsService();
