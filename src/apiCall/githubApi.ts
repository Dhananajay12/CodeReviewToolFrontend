import type { AxiosResponse } from "axios";
import AxiosInstance from "../helpers/interceptor";
import type { ApiResponse } from "../types/api";
import type {
  Repo,
  Pull,
  Review,
  ReviewIssue,
  PostReviewResult,
  GithubConnection,
  CreateReviewInput,
} from "../types/github";

export const getConnectionApi = (): Promise<
  AxiosResponse<ApiResponse<GithubConnection[]>>
> => {
  return AxiosInstance.get<ApiResponse<GithubConnection[]>>(
    "/github/connection",
  );
};

export const getReposApi = (): Promise<
  AxiosResponse<ApiResponse<Repo[] | null>>
> => {
  return AxiosInstance.get<ApiResponse<Repo[] | null>>("/github/repos");
};

export const getPullsApi = (
  repoId: string,
): Promise<AxiosResponse<ApiResponse<Pull[]>>> => {
  return AxiosInstance.get<ApiResponse<Pull[]>>(
    `/github/repos/${repoId}/pulls`,
  );
};

export const createReviewApi = (
  body: CreateReviewInput,
): Promise<AxiosResponse<ApiResponse<Review>>> => {
  return AxiosInstance.post<ApiResponse<Review>>("/reviews", body);
};

export const toggleIssueApi = (
  reviewId: string,
  issueId: string,
  included: boolean,
): Promise<AxiosResponse<ApiResponse<ReviewIssue>>> => {
  return AxiosInstance.patch<ApiResponse<ReviewIssue>>(
    `/reviews/${reviewId}/issues/${issueId}`,
    { included },
  );
};

export const postReviewApi = (
  reviewId: string,
): Promise<AxiosResponse<ApiResponse<PostReviewResult>>> => {
  return AxiosInstance.post<ApiResponse<PostReviewResult>>(
    `/reviews/${reviewId}/post`,
  );
};
