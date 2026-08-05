/** Resposta HTTP independente de biblioteca, contendo status e corpo tipado. */
export interface HttpResponse<T> { readonly status: number; readonly data: T; }
/** Contrato mínimo de cliente HTTP para adaptadores que não dependem do Axios. */
export interface HttpClient {
  get(path: string, options?: { readonly query?: Readonly<Record<string, unknown>> }): Promise<HttpResponse<unknown>>;
  post(path: string, body?: unknown): Promise<HttpResponse<unknown>>;
  put(path: string, body?: unknown): Promise<HttpResponse<unknown>>;
  patch(path: string, body?: unknown): Promise<HttpResponse<unknown>>;
  delete(path: string): Promise<HttpResponse<unknown>>;
}
