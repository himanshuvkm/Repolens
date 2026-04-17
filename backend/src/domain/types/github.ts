export interface GitHubRepositoryResponse {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  default_branch: string;
  stargazers_count: number;
  forks_count: number;
  subscribers_count: number;
  open_issues_count: number;
  language: string | null;
  topics: string[];
  archived: boolean;
  disabled: boolean;
  created_at: string;
  updated_at: string;
  pushed_at: string | null;
}

export interface GitHubContributorResponse {
  id: number;
  login: string;
  avatar_url: string;
  type: string;
  site_admin: boolean;
  contributions: number;
}

export interface GitHubLabel {
  name: string;
}

export interface GitHubIssueResponse {
  id: number;
  number: number;
  title: string;
  state: "open" | "closed";
  created_at: string;
  updated_at: string;
  closed_at: string | null;
  author_association: string;
  labels: GitHubLabel[];
  user: {
    id: number;
    login: string;
    avatar_url: string;
    type: string;
    site_admin: boolean;
  } | null;
  comments: number;
  pull_request?: {
    url: string;
  };
}

export interface GitHubIssueCommentResponse {
  id: number;
  body: string | null;
  created_at: string;
  updated_at: string;
  author_association: string;
  user: {
    id: number;
    login: string;
    avatar_url: string;
    type: string;
    site_admin: boolean;
  } | null;
}

export interface GitHubPullRequestResponse {
  id: number;
  number: number;
  title: string;
  state: "open" | "closed";
  draft: boolean;
  created_at: string;
  updated_at: string;
  closed_at: string | null;
  merged_at: string | null;
  additions: number;
  deletions: number;
  changed_files: number;
  commits: number;
  author_association: string;
  labels: GitHubLabel[];
  user: {
    id: number;
    login: string;
    avatar_url: string;
    type: string;
    site_admin: boolean;
  } | null;
}

export interface GitHubPullRequestReviewResponse {
  id: number;
  state: string;
  submitted_at: string | null;
  user: {
    id: number;
    login: string;
    avatar_url: string;
    type: string;
    site_admin: boolean;
  } | null;
}
