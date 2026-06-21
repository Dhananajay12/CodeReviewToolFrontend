import {
  useMutation,
  useQuery,
  type UseMutationResult,
  type UseQueryResult,
} from "@tanstack/react-query";
import {
  getConnectionApi,
  getReposApi,
  getPullsApi,
  createReviewApi,
  toggleIssueApi,
  postReviewApi,
} from "../apiCall/githubApi";
import type {
  Repo,
  Pull,
  Review,
  ReviewIssue,
  PostReviewResult,
  GithubConnection,
  CreateReviewInput,
} from "../types/github";

export const useGithubConnection = (): UseQueryResult<
  GithubConnection[],
  Error
> => {
  return useQuery<GithubConnection[], Error>({
    queryKey: ["github", "connection"],
    queryFn: async (): Promise<GithubConnection[]> => {
      const res = await getConnectionApi();
      return res.data.data ?? [];
    },
    retry: false,
    staleTime: 60 * 1000,
  });
};

export interface ReposState {
  connected: boolean;
  repos: Repo[];
}

export const useRepos = (): UseQueryResult<ReposState, Error> => {
  return useQuery<ReposState, Error>({
    queryKey: ["github", "repos"],
    queryFn: async (): Promise<ReposState> => {
      const res = await getReposApi();
      if (res.data.status === true) {
        return { connected: true, repos: res.data.data ?? [] };
      }
      return { connected: false, repos: [] };
    },
    retry: false,
    staleTime: 60 * 1000,
  });
};

export const usePulls = (
  repoId: string | null,
): UseQueryResult<Pull[], Error> => {
  return useQuery<Pull[], Error>({
    queryKey: ["github", "pulls", repoId],
    enabled: Boolean(repoId),
    queryFn: async (): Promise<Pull[]> => {
      const res = await getPullsApi(repoId as string);
      return res.data.data ?? [];
    },
    retry: false,
  });
};

export const useCreateReview = (): UseMutationResult<
  Review,
  Error,
  CreateReviewInput
> => {
  return useMutation<Review, Error, CreateReviewInput>({
    mutationFn: async (input: CreateReviewInput): Promise<Review> => {
      const res = await createReviewApi(input);
      return res.data.data;
    },
  });
};

export interface ToggleIssueInput {
  reviewId: string;
  issueId: string;
  included: boolean;
}

export const useToggleIssue = (): UseMutationResult<
  ReviewIssue,
  Error,
  ToggleIssueInput
> => {
  return useMutation<ReviewIssue, Error, ToggleIssueInput>({
    mutationFn: async ({
      reviewId,
      issueId,
      included,
    }: ToggleIssueInput): Promise<ReviewIssue> => {
      const res = await toggleIssueApi(reviewId, issueId, included);
      return res.data.data;
    },
  });
};

export const usePostReview = (): UseMutationResult<
  PostReviewResult,
  Error,
  string
> => {
  return useMutation<PostReviewResult, Error, string>({
    mutationFn: async (reviewId: string): Promise<PostReviewResult> => {
      const res = await postReviewApi(reviewId);
      return res.data.data;
    },
  });
};
