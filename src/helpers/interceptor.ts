import axios, { type InternalAxiosRequestConfig } from "axios";

const BASE_URL = import.meta.env.VITE_APP_BACKEND_URL;
const AxiosInstance = axios.create({
  baseURL: BASE_URL,
});

AxiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const accessToken = localStorage.getItem("accessToken");

  if (accessToken) {
    config.headers.set("Authorization", `Bearer ${accessToken}`);
  }

  return config;
});

export default AxiosInstance;