import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";

type ApiProblem = {
  readonly title?: string;
  readonly detail?: string;
  readonly errors?: Record<string, string[]>;
};

type RetriableRequest = InternalAxiosRequestConfig & { _retried?: boolean };

const baseURL = import.meta.env.VITE_API_BASE_URL ?? "/api/v1";
let accessToken: string | null = null;
let refreshHandler: (() => Promise<string | null>) | null = null;
let refreshPromise: Promise<string | null> | null = null;

export class ApiError extends Error {
  public constructor(
    message: string,
    public readonly status = 0,
    public readonly fields: Record<string, string[]> = {},
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export const setApiAccessToken = (token: string | null): void => { accessToken = token; };
export const setApiRefreshHandler = (handler: () => Promise<string | null>): void => { refreshHandler = handler; };

export const publicHttp = axios.create({ baseURL, timeout: 20_000 });
export const apiHttp = axios.create({ baseURL, timeout: 20_000 });

const normalizeError = (error: AxiosError<ApiProblem>): ApiError => {
  const problem = error.response?.data;
  return new ApiError(
    problem?.detail ?? problem?.title ?? (error.response ? "Nao foi possivel concluir a operacao." : "Nao foi possivel conectar a API."),
    error.response?.status ?? 0,
    problem?.errors ?? {},
  );
};

publicHttp.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiProblem>) => Promise.reject(normalizeError(error)),
);

apiHttp.interceptors.request.use((config) => {
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

apiHttp.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiProblem>) => {
    const request = error.config as RetriableRequest | undefined;
    if (error.response?.status === 401 && request && !request._retried && refreshHandler) {
      request._retried = true;
      refreshPromise ??= refreshHandler().finally(() => { refreshPromise = null; });
      const token = await refreshPromise;
      if (token) {
        request.headers.Authorization = `Bearer ${token}`;
        return apiHttp.request(request);
      }
    }

    throw normalizeError(error);
  },
);
