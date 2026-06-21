import type { AxiosResponse } from "axios";
import AxiosInstance from "../helpers/interceptor";
import type { ApiResponse } from "../types/api";
import type {
  AuthUser,
  CurrentUser,
  Credentials,
  UpdateProfileInput,
  ChangePasswordInput,
} from "../types/auth";

export const registerApi = (
  body: Credentials,
): Promise<AxiosResponse<ApiResponse<AuthUser>>> => {
  return AxiosInstance.post<ApiResponse<AuthUser>>("/auth/register", body);
};

export const loginApi = (
  body: Credentials,
): Promise<AxiosResponse<ApiResponse<AuthUser>>> => {
  return AxiosInstance.post<ApiResponse<AuthUser>>("/auth/login", body);
};

export const logoutApi = (): Promise<AxiosResponse<ApiResponse<null>>> => {
  return AxiosInstance.post<ApiResponse<null>>("/auth/logout");
};

export const meApi = (): Promise<AxiosResponse<ApiResponse<CurrentUser>>> => {
  return AxiosInstance.get<ApiResponse<CurrentUser>>("/auth/me");
};

export const updateProfileApi = (
  body: UpdateProfileInput,
): Promise<AxiosResponse<ApiResponse<AuthUser>>> => {
  return AxiosInstance.patch<ApiResponse<AuthUser>>("/auth/me", body);
};

export const changePasswordApi = (
  body: ChangePasswordInput,
): Promise<AxiosResponse<ApiResponse<null>>> => {
  return AxiosInstance.post<ApiResponse<null>>("/auth/change-password", body);
};
