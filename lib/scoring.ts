import { RepoAnalysisData } from "@/types";

export function calculateMaintenanceScore(data: RepoAnalysisData): number {
  let score = 100;

  // Days since last commit
  const lastCommitDate = data.metadata.lastPushedAt;
  const daysSinceLastCommit = lastCommitDate 
    ? (new Date().getTime() - new Date(lastCommitDate).getTime()) / (1000 * 3600 * 24)
    : 365;

  if (daysSinceLastCommit > 30) score -= 10;
  if (daysSinceLastCommit > 90) score -= 20;
  if (daysSinceLastCommit > 180) score -= 20;
  
  // PR merge rate (merged / total closed)
  const totalPRs = data.prs.length;
  if (totalPRs > 0) {
    const mergedPRs = data.prs.filter(pr => pr.mergedAt).length;
    const mergeRate = mergedPRs / totalPRs;
    if (mergeRate < 0.5) score -= 15;
    else if (mergeRate < 0.7) score -= 5;
  } else {
    // If no PRs found at all, might be inactive or tiny
    score -= 10;
  }

  // Issue close rate
  const totalIssues = data.issues.length;
  if (totalIssues > 0) {
    const closedIssues = data.issues.filter(issue => issue.state === 'closed').length;
    const closeRate = closedIssues / totalIssues;
    if (closeRate < 0.3) score -= 15;
    else if (closeRate < 0.6) score -= 5;
  }

  // Active contributors (rough proxy)
  if (data.contributorsCount < 2) score -= 10;

  return Math.max(0, Math.min(100, Math.round(score)));
}

export function calculateContributionScore(data: RepoAnalysisData): number {
  let score = 0;

  const filePaths = data.fileTree.map(f => f.path.toLowerCase());
  
  const hasFile = (pattern: string) => filePaths.some(p => p.includes(pattern));

  if (hasFile('contributing')) score += 20;
  if (hasFile('.github/issue_template') || hasFile('issue_template')) score += 15;
  if (hasFile('.github/pull_request_template') || hasFile('pull_request_template')) score += 15;
  if (hasFile('code_of_conduct')) score += 10;
  if (hasFile('.github/workflows') || hasFile('.travis.yml') || hasFile('circle.yml')) score += 15;
  if (hasFile('license')) score += 15;

  // Rough check for PR response (just a placeholder bonus if recent PRs exist and are reviewed/merged fast)
  const closedPrs = data.prs.filter(pr => pr.closedAt);
  if (closedPrs.length > 0) {
    let totalTime = 0;
    closedPrs.forEach(pr => {
      const openTime = new Date(pr.createdAt).getTime();
      const closeTime = new Date(pr.closedAt!).getTime();
      totalTime += (closeTime - openTime);
    });
    const avgTimeDays = (totalTime / closedPrs.length) / (1000 * 3600 * 24);
    if (avgTimeDays < 7) {
      score += 10;
    }
  }

  return Math.max(0, Math.min(100, Math.round(score)));
}

export function calculatePRIntelligence(data: RepoAnalysisData) {
  const prs = data.prs;
  if (prs.length === 0) {
    return { verdict: 'Abandoned', mergeRate: 0, avgMergeTimeDays: 0, avgFirstReviewTimeDays: 0 };
  }

  const externalPRs = prs.filter(pr => pr.authorType === 'contributor');
  const mergedExternalPRs = externalPRs.filter(pr => pr.mergedAt);
  const externalMergeRate = externalPRs.length > 0 ? mergedExternalPRs.length / externalPRs.length : 0;

  let totalMergeTime = 0;
  let mergedCount = 0;

  prs.forEach(pr => {
    if (pr.mergedAt) {
      totalMergeTime += (new Date(pr.mergedAt).getTime() - new Date(pr.createdAt).getTime());
      mergedCount++;
    }
  });

  const avgMergeTimeDays = mergedCount > 0 ? (totalMergeTime / mergedCount) / (1000 * 3600 * 24) : 0;
  
  // Note: first review time is hard to get precisely without comments API, using merge time as proxy
  const avgFirstReviewTimeDays = avgMergeTimeDays * 0.4;

  let verdict = 'Maintenance-only';
  
  if (externalPRs.length === 0 && mergedCount === 0) {
    verdict = 'Abandoned';
  } else if (externalPRs.length === 0) {
    verdict = 'Maintainer-only';
  } else if (externalMergeRate > 0.6) {
    verdict = 'Great for contributions';
  } else if (externalMergeRate > 0.3) {
    verdict = 'Selective';
  } else {
    verdict = 'Maintainer-only';
  }

  return {
    verdict,
    mergeRate: externalPRs.length > 0 ? externalMergeRate : (mergedCount / prs.length),
    avgMergeTimeDays,
    avgFirstReviewTimeDays
  };
}
