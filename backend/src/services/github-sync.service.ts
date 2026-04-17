import { Contributor } from "@prisma/client";
import { githubApiClient } from "../infrastructure/github/github-api.client";
import {
  GitHubContributorResponse,
  GitHubIssueCommentResponse,
  GitHubIssueResponse,
  GitHubPullRequestResponse,
  GitHubPullRequestReviewResponse,
  GitHubRepositoryResponse,
} from "../domain/types/github";
import { contributorRepository } from "../repositories/contributor.repository";
import { issueRepository } from "../repositories/issue.repository";
import { pullRequestRepository } from "../repositories/pull-request.repository";
import { repositoryRepository } from "../repositories/repository.repository";

const MAINTAINER_ASSOCIATIONS = new Set(["OWNER", "MEMBER", "COLLABORATOR"]);

export class GitHubSyncService {
  async syncRepository(owner: string, repo: string, forceRefresh = false) {
    const repositoryData = await githubApiClient.get<GitHubRepositoryResponse>(
      `/repos/${owner}/${repo}`,
      { forceRefresh },
    );

    const repository = await repositoryRepository.upsertRepository({
      owner,
      name: repo,
      fullName: repositoryData.full_name,
      description: repositoryData.description,
      defaultBranch: repositoryData.default_branch,
      primaryLanguage: repositoryData.language,
      stars: repositoryData.stargazers_count,
      forks: repositoryData.forks_count,
      watchers: repositoryData.subscribers_count,
      openIssuesCount: repositoryData.open_issues_count,
      topics: repositoryData.topics,
      archived: repositoryData.archived,
      disabled: repositoryData.disabled,
      createdAt: new Date(repositoryData.created_at),
      updatedAt: new Date(repositoryData.updated_at),
      pushedAt: repositoryData.pushed_at ? new Date(repositoryData.pushed_at) : null,
      lastSyncedAt: new Date(),
      goodFirstIssueCount: 0,
    });

    const contributors = await githubApiClient.get<GitHubContributorResponse[]>(
      `/repos/${owner}/${repo}/contributors?per_page=100&anon=false`,
      { forceRefresh },
    );

    const persistedContributors = await Promise.all(
      contributors.map((contributor) =>
        contributorRepository.upsertContributor({
          githubId: BigInt(contributor.id),
          login: contributor.login,
          avatarUrl: contributor.avatar_url,
          type: contributor.type,
          siteAdmin: contributor.site_admin,
        }),
      ),
    );

    const contributorLookup = new Map<string, Contributor>();
    persistedContributors.forEach((contributor) => {
      contributorLookup.set(contributor.login, contributor);
    });

    await contributorRepository.replaceRepositoryContributors({
      repositoryId: repository.id,
      contributors: contributors.map((contributor) => ({
        contributorId: contributorLookup.get(contributor.login)!.id,
        contributions: contributor.contributions,
        isMaintainer: contributor.type === "User" && contributor.contributions >= 5,
      })),
    });

    const issueResponses = await githubApiClient.get<GitHubIssueResponse[]>(
      `/repos/${owner}/${repo}/issues?state=all&sort=updated&direction=desc&per_page=100`,
      { forceRefresh },
    );

    const filteredIssues = issueResponses.filter((issue) => !issue.pull_request);

    const issuesWithComments = await Promise.all(
      filteredIssues.map(async (issue) => {
        const author = issue.user
          ? await contributorRepository.upsertContributor({
              githubId: BigInt(issue.user.id),
              login: issue.user.login,
              avatarUrl: issue.user.avatar_url,
              type: issue.user.type,
              siteAdmin: issue.user.site_admin,
            })
          : null;

        const comments =
          issue.comments > 0
            ? await githubApiClient.get<GitHubIssueCommentResponse[]>(
                `/repos/${owner}/${repo}/issues/${issue.number}/comments?per_page=100`,
                { forceRefresh },
              )
            : [];

        const resolvedComments = await Promise.all(
          comments.map(async (comment) => {
            const commentAuthor = comment.user
              ? await contributorRepository.upsertContributor({
                  githubId: BigInt(comment.user.id),
                  login: comment.user.login,
                  avatarUrl: comment.user.avatar_url,
                  type: comment.user.type,
                  siteAdmin: comment.user.site_admin,
                })
              : null;

            return {
              githubId: BigInt(comment.id),
              authorId: commentAuthor?.id,
              authorAssociation: comment.author_association,
              body: comment.body,
              createdAt: new Date(comment.created_at),
              updatedAt: new Date(comment.updated_at),
            };
          }),
        );

        const firstMaintainerResponse = resolvedComments
          .filter((comment) => MAINTAINER_ASSOCIATIONS.has((comment.authorAssociation ?? "").toUpperCase()))
          .sort((left, right) => left.createdAt.getTime() - right.createdAt.getTime())[0];

        return {
          githubId: BigInt(issue.id),
          authorId: author?.id,
          number: issue.number,
          title: issue.title,
          state: issue.state,
          isPullRequest: false,
          authorAssociation: issue.author_association,
          createdAt: new Date(issue.created_at),
          updatedAt: new Date(issue.updated_at),
          closedAt: issue.closed_at ? new Date(issue.closed_at) : null,
          firstMaintainerResponseAt: firstMaintainerResponse?.createdAt ?? null,
          labels: issue.labels.map((label) => label.name),
          comments: resolvedComments,
        };
      }),
    );

    await issueRepository.replaceRepositoryIssues({
      repositoryId: repository.id,
      issues: issuesWithComments,
    });

    const pullRequestList = await githubApiClient.get<GitHubPullRequestResponse[]>(
      `/repos/${owner}/${repo}/pulls?state=all&sort=updated&direction=desc&per_page=100`,
      { forceRefresh },
    );

    const pullRequests = await Promise.all(
      pullRequestList.map(async (pullRequest) => {
        const author = pullRequest.user
          ? await contributorRepository.upsertContributor({
              githubId: BigInt(pullRequest.user.id),
              login: pullRequest.user.login,
              avatarUrl: pullRequest.user.avatar_url,
              type: pullRequest.user.type,
              siteAdmin: pullRequest.user.site_admin,
            })
          : null;

        const reviews = await githubApiClient.get<GitHubPullRequestReviewResponse[]>(
          `/repos/${owner}/${repo}/pulls/${pullRequest.number}/reviews?per_page=100`,
          { forceRefresh },
        );

        const resolvedReviews = await Promise.all(
          reviews.map(async (review) => {
            const reviewer = review.user
              ? await contributorRepository.upsertContributor({
                  githubId: BigInt(review.user.id),
                  login: review.user.login,
                  avatarUrl: review.user.avatar_url,
                  type: review.user.type,
                  siteAdmin: review.user.site_admin,
                })
              : null;

            return {
              githubId: BigInt(review.id),
              reviewerId: reviewer?.id,
              state: review.state,
              submittedAt: review.submitted_at ? new Date(review.submitted_at) : null,
            };
          }),
        );

        return {
          githubId: BigInt(pullRequest.id),
          authorId: author?.id,
          number: pullRequest.number,
          title: pullRequest.title,
          state: pullRequest.state,
          draft: pullRequest.draft,
          authorAssociation: pullRequest.author_association,
          additions: pullRequest.additions,
          deletions: pullRequest.deletions,
          changedFiles: pullRequest.changed_files,
          commits: pullRequest.commits,
          createdAt: new Date(pullRequest.created_at),
          updatedAt: new Date(pullRequest.updated_at),
          closedAt: pullRequest.closed_at ? new Date(pullRequest.closed_at) : null,
          mergedAt: pullRequest.merged_at ? new Date(pullRequest.merged_at) : null,
          labels: pullRequest.labels.map((label) => label.name),
          reviews: resolvedReviews,
        };
      }),
    );

    await pullRequestRepository.replaceRepositoryPullRequests({
      repositoryId: repository.id,
      pullRequests,
    });

    const goodFirstIssueCount = issuesWithComments.filter((issue) =>
      issue.labels.some((label) => label.toLowerCase().includes("good first issue")),
    ).length;

    return repositoryRepository.upsertRepository({
      ...repository,
      lastSyncedAt: new Date(),
      goodFirstIssueCount,
    });
  }
}

export const githubSyncService = new GitHubSyncService();
