import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Carrega e mantém dados assíncronos com estados de loading, erro e recarga.
 *
 * @param {Function} loader - Função assíncrona que busca os dados.
 * @param {string} dependencyKey - Chave que dispara nova consulta quando alterada.
 * @param {T} initial - Valor utilizado antes da primeira resposta.
 * @returns Estado dos dados e função para executar a consulta novamente.
 */
export const useApiData = <T,>(loader: () => Promise<T>, dependencyKey: string, initial: T) => {
  const [data, setData] = useState<T>(initial);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const loaderRef = useRef(loader);
  loaderRef.current = loader;

  const reload = useCallback(async () => {
    void dependencyKey;
    setLoading(true);
    setError("");
    try { setData(await loaderRef.current()); }
    catch (caught) { setError(caught instanceof Error ? caught.message : "Erro inesperado."); }
    finally { setLoading(false); }
  }, [dependencyKey]);

  useEffect(() => { void reload(); }, [reload]);
  return { data, setData, loading, error, reload };
};
