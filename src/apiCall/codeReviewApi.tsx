import type { AxiosResponse } from "axios";
import AxiosInstance from "../helpers/interceptor";
import type { ApiResponse } from "../types/api";

export const getCodeReview = async (
  code: string,
): Promise<AxiosResponse<ApiResponse<string>>> => {
  const response = await AxiosInstance.post<ApiResponse<string>>(
    "/api/ai/get-review",
    { code },
  );

  return response;
};
