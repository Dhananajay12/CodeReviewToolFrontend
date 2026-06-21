import { useMutation, type UseMutationResult } from "@tanstack/react-query";
import type { AxiosResponse } from "axios";
import { getCodeReview } from "../apiCall/codeReviewApi";
import type { ApiResponse } from "../types/api";

export const useCodeReview = (): UseMutationResult<
  AxiosResponse<ApiResponse<string>>,
  Error,
  string
> => {
  return useMutation({
    mutationFn: getCodeReview,
  });
};
