export interface AnalyzeRepositoryJobPayload {
  owner: string;
  repo: string;
  forceRefresh?: boolean;
  trigger: "manual" | "webhook" | "scheduled" | "api-read";
}
