import { useCallback, useEffect, useRef, useState } from "react";

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
