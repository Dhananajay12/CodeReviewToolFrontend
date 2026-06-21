import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult,
} from "@tanstack/react-query";
import { AxiosError, type AxiosResponse } from "axios";
import {
  loginApi,
  registerApi,
  logoutApi,
  meApi,
  updateProfileApi,
  changePasswordApi,
} from "../apiCall/authApi";
import type { ApiResponse } from "../types/api";
import type {
  AuthUser,
  CurrentUser,
  Credentials,
  UpdateProfileInput,
  ChangePasswordInput,
} from "../types/auth";

export const AUTH_QUERY_KEY = ["auth", "me"] as const;

export const useAuth = (): UseQueryResult<CurrentUser | null, Error> => {
  return useQuery<CurrentUser | null, Error>({
    queryKey: AUTH_QUERY_KEY,
    queryFn: async (): Promise<CurrentUser | null> => {
      try {
        const res = await meApi();
        return res.data.data;
      } catch (err) {
        if (err instanceof AxiosError && err.response?.status === 401) {
          return null;
        }
        throw err;
      }
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
};

type AuthResponse = AxiosResponse<ApiResponse<AuthUser>>;
type NullResponse = AxiosResponse<ApiResponse<null>>;

export const useLogin = (): UseMutationResult<
  AuthResponse,
  Error,
  Credentials
> => {
  const queryClient = useQueryClient();
  return useMutation<AuthResponse, Error, Credentials>({
    mutationFn: loginApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEY });
    },
  });
};

export const useRegister = (): UseMutationResult<
  AuthResponse,
  Error,
  Credentials
> => {
  const queryClient = useQueryClient();
  return useMutation<AuthResponse, Error, Credentials>({
    mutationFn: registerApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEY });
    },
  });
};

export const useLogout = (): UseMutationResult<NullResponse, Error, void> => {
  const queryClient = useQueryClient();
  return useMutation<NullResponse, Error, void>({
    mutationFn: logoutApi,
    onSuccess: () => {
      queryClient.setQueryData(AUTH_QUERY_KEY, null);
    },
  });
};

export const useUpdateProfile = (): UseMutationResult<
  AuthResponse,
  Error,
  UpdateProfileInput
> => {
  const queryClient = useQueryClient();
  return useMutation<AuthResponse, Error, UpdateProfileInput>({
    mutationFn: updateProfileApi,
    onSuccess: (res) => {
      queryClient.setQueryData<CurrentUser | null>(AUTH_QUERY_KEY, (prev) =>
        prev ? { ...prev, ...res.data.data } : prev,
      );
    },
  });
};

export const useChangePassword = (): UseMutationResult<
  NullResponse,
  Error,
  ChangePasswordInput
> => {
  return useMutation<NullResponse, Error, ChangePasswordInput>({
    mutationFn: changePasswordApi,
  });
};
