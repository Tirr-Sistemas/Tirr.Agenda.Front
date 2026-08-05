/** Resultado explícito de sucesso ou falha para operações sem exceção. */
export type Result<TValue, TError extends Error = Error> =
  | { readonly ok: true; readonly value: TValue }
  | { readonly ok: false; readonly error: TError };

/**
 * Cria um resultado bem-sucedido.
 *
 * @param {TValue} value - Valor produzido pela operação.
 * @returns {Result<TValue, never>} Resultado marcado como sucesso.
 */
export const success = <TValue>(value: TValue): Result<TValue, never> => ({ ok: true, value });
/**
 * Cria um resultado de falha.
 *
 * @param {TError} error - Erro que descreve a falha.
 * @returns {Result<never, TError>} Resultado marcado como falha.
 */
export const failure = <TError extends Error>(error: TError): Result<never, TError> => ({ ok: false, error });
