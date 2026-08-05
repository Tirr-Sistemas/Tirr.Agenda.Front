import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";

import type { ApiProblem } from "./types";

const baseURL = import.meta.env.VITE_API_BASE_URL ?? "/api/v1";

export class ApiError extends Error {
  status: number;
  fields: Record<string, string[]>;

  constructor(message: string, status = 0, fields: Record<string, string[]> = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.fields = fields;
  }
}

type RetriableRequest = InternalAxiosRequestConfig & { _retried?: boolean };
let accessToken: string | null = null;
let refreshHandler: (() => Promise<string | null>) | null = null;
let refreshPromise: Promise<string | null> | null = null;

export const setApiAccessToken = (token: string | null) => { accessToken = token; };
export const setApiRefreshHandler = (handler: () => Promise<string | null>) => { refreshHandler = handler; };
export const rawHttp = axios.create({ baseURL, timeout: 20_000 });
export const http = axios.create({ baseURL, timeout: 20_000 });

const normalizeError = (error: AxiosError<ApiProblem>) => {
  const problem = error.response?.data;
  return new ApiError(
    problem?.detail ?? problem?.title ?? (error.response ? "Nao foi possivel concluir a operacao." : "Nao foi possivel conectar a API."),
    error.response?.status ?? 0,
    problem?.errors ?? {},
  );
};

rawHttp.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiProblem>) => Promise.reject(normalizeError(error)),
);

http.interceptors.request.use((config) => {
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

http.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiProblem>) => {
    const request = error.config as RetriableRequest | undefined;
    if (error.response?.status === 401 && request && !request._retried && refreshHandler) {
      request._retried = true;
      refreshPromise ??= refreshHandler().finally(() => { refreshPromise = null; });
      const token = await refreshPromise;
      if (token) {
        request.headers.Authorization = `Bearer ${token}`;
        return http.request(request);
      }
    }

    throw normalizeError(error);
  },
);
