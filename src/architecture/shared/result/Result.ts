export type Result<TValue, TError extends Error = Error> =
  | { readonly ok: true; readonly value: TValue }
  | { readonly ok: false; readonly error: TError };

export const success = <TValue>(value: TValue): Result<TValue, never> => ({ ok: true, value });
export const failure = <TError extends Error>(error: TError): Result<never, TError> => ({ ok: false, error });
