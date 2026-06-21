export interface Repo {
  id: string;
  fullName: string;
  isPrivate: boolean;
  githubRepoId: string;
}

export interface GithubConnection {
  installationId: string;
  githubLogin: string;
  accountType: string;
  manageUrl: string;
}

export interface Pull {
  number: number;
  title: string;
  author: string | null;
  headBranch: string;
  baseBranch: string;
  createdAt: string;
  htmlUrl: string;
}

export type IssueSeverity = "critical" | "warning" | "suggestion";
export type IssueCategory =
  | "security"
  | "performance"
  | "correctness"
  | "style"
  | "accessibility";

export interface ReviewIssue {
  id: string;
  file: string;
  line: number | null;
  severity: IssueSeverity;
  category: IssueCategory;
  message: string;
  suggestedFix: string | null;
  included: boolean;
  posted: boolean;
}

export interface PostReviewResult {
  posted: number;
  inline: number;
  summary: number;
}

export interface Review {
  id: string;
  status: string;
  prNumber: number;
  prTitle: string | null;
  summary: string | null;
  error: string | null;
  createdAt: string;
  completedAt: string | null;
  issues: ReviewIssue[];
}

export interface CreateReviewInput {
  repoId: string;
  prNumber: number;
}
