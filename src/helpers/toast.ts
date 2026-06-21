import { toast, type Id, type ToastOptions } from "react-toastify";
import { AxiosError } from "axios";

export const defaultToastOptions: ToastOptions = {
  position: "bottom-right",
  autoClose: 4000,
  pauseOnHover: true,
  closeOnClick: true,
  draggable: true,
  theme: "dark",
};

export const notify = {
  success: (message: string, options?: ToastOptions): Id =>
    toast.success(message, { ...defaultToastOptions, ...options }),
  error: (message: string, options?: ToastOptions): Id =>
    toast.error(message, { ...defaultToastOptions, ...options }),
  info: (message: string, options?: ToastOptions): Id =>
    toast.info(message, { ...defaultToastOptions, ...options }),
  warning: (message: string, options?: ToastOptions): Id =>
    toast.warning(message, { ...defaultToastOptions, ...options }),
  loading: (message: string, options?: ToastOptions): Id =>
    toast.loading(message, { ...defaultToastOptions, ...options }),
  dismiss: toast.dismiss,
};

export function getErrorMessage(
  err: unknown,
  fallback = "Something went wrong. Please try again.",
): string {
  if (err instanceof AxiosError) {
    return err.response?.data?.message ?? err.message ?? fallback;
  }
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  return fallback;
}
