/**
 * @description Resultado explícito de sucesso ou falha para operações sem exceção.
 */
export type Result<TValue, TError extends Error = Error> =
  | { readonly ok: true; readonly value: TValue; }
  | { readonly ok: false; readonly error: TError; };

/**
 * @description Cria um resultado bem-sucedido.
 *
 * @param value - Valor produzido pela operação.
 * @returns Resultado marcado como sucesso.
 */
export const success = <TValue>(value: TValue): Result<TValue, never> => ({ ok: true, value });
/**
 * @description Cria um resultado de falha.
 *
 * @param error - Erro que descreve a falha.
 * @returns Resultado marcado como falha.
 */
export const failure = <TError extends Error>(error: TError): Result<never, TError> => ({ ok: false, error });
