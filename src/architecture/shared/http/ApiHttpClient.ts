import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";

type ApiProblem = {
  readonly title?: string;
  readonly detail?: string;
  readonly errors?: Record<string, string[]>;
};

type RetriableRequest = InternalAxiosRequestConfig & { _retried?: boolean; };

const baseURL = import.meta.env.VITE_API_BASE_URL ?? "/api/v1";
let accessToken: string | null = null;
let refreshHandler: (() => Promise<string | null>) | null = null;
let refreshPromise: Promise<string | null> | null = null;

/**
 * @description Erro HTTP normalizado para consumo uniforme pelos casos de uso e pela UI.
 */
export class ApiError extends Error {
  /**
   * @description Cria um erro HTTP normalizado com status e falhas por campo.
   *
   * @param message - Valor de message utilizado pela operação.
   * @param status - Novo status solicitado para o agendamento.
   * @param fields - Erros de validação agrupados pelo campo de entrada.
   */
  public constructor(
    message: string,
    public readonly status = 0,
    public readonly fields: Record<string, string[]> = {},
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * @description Atualiza o token enviado nas requisições autenticadas.
 *
 * @param token - Token atual ou `null` para remover a autenticação.
 * @returns Sem valor de retorno.
 */
export const setApiAccessToken = (token: string | null): void => { accessToken = token; };
/**
 * @description Registra a função responsável por renovar uma sessão expirada.
 *
 * @param handler - Função que devolve o novo token ou `null`.
 * @returns Sem valor de retorno.
 */
export const setApiRefreshHandler = (handler: () => Promise<string | null>): void => { refreshHandler = handler; };

/**
 * @description Cliente HTTP para endpoints que não exigem autenticação.
 */
export const publicHttp = axios.create({ baseURL, timeout: 20_000 });
/**
 * @description Cliente HTTP autenticado com renovação única e automática após resposta 401.
 */
export const apiHttp = axios.create({ baseURL, timeout: 20_000 });

/**
 * @description Converte erros do Axios e respostas Problem Details em um erro da aplicação.
 *
 * @param error - Falha capturada durante o processamento.
 * @returns Resultado produzido pela operação.
 */
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
