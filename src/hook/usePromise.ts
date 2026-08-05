import { useCallback, useRef, useState } from "react";

/**
 * =========================================================
 * USE PROMISE
 * =========================================================
 * @description
 * Hook genérico responsável por controlar a execução
 * de operações assíncronas.
 *
 * Responsabilidades:
 * - Controlar estado de loading
 * - Controlar estado de erro
 * - Armazenar resultado da Promise
 * - Executar funções assíncronas tipadas
 *
 * Ideal para:
 * - Requisições HTTP
 * - Casos de uso (Use Cases)
 * - Integrações externas
 * - Operações assíncronas em geral
 *
 * @template TResult
 * Tipo retornado pela Promise.
 *
 * @template TArgs
 * Tupla contendo os parâmetros aceitos pela função.
 *
 * Exemplo:
 * const { execute } = usePromise(
 *   async (id: number, active: boolean) => {},
 *   null
 * );
 */
const usePromise = <
  TResult,
  TArgs extends unknown[] = []
>(
  action: (...args: TArgs) => Promise<TResult>,
  defaultValue: TResult
) => {
  const actionRef = useRef(action);
  const defaultValueRef = useRef(defaultValue);
  actionRef.current = action;
  defaultValueRef.current = defaultValue;

  /**
   * =====================================================
   * STATES
   * =====================================================
   */
  const [isLoading, setIsLoading] =
    useState<boolean>(false);

  const [hasError, setHasError] =
    useState<boolean>(false);

  const [result, setResult] =
    useState<TResult>(defaultValue);

  /**
   * =====================================================
   * EXECUTE
   * =====================================================
   * @description
   * Executa a função assíncrona fornecida ao hook,
   * controlando automaticamente os estados internos.
   *
   * @param args
   * Parâmetros da função assíncrona.
   *
   * @returns
   * Resultado retornado pela Promise.
   */
  const execute = useCallback(
    async (...args: TArgs): Promise<TResult> => {

      try {

        setResult(defaultValueRef.current);

        setIsLoading(true);

        setHasError(false);

        const response = await actionRef.current(...args);

        setResult(response);

        return response;

      } catch {

        setHasError(true);

        setResult(defaultValueRef.current);

        return defaultValueRef.current;

      } finally {

        setIsLoading(false);

      }

    },
    []
  );

  /**
   * =====================================================
   * RETURN
   * =====================================================
   */
  return {
    isLoading,
    hasError,
    result,
    execute
  } as const;

};

export default usePromise;
