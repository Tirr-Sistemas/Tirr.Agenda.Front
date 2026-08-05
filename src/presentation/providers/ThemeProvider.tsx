import { type ReactNode, useEffect, useMemo, useState } from "react";

import { ThemeContext, type Theme, type ThemeContextValue } from "./themeContext";

const STORAGE_KEY = "tirr-theme";
/**
 * @description Obtém o tema inicial persistido ou infere a preferência do sistema operacional.
 *
 * @returns Resultado produzido pela operação.
 */
const getInitialTheme = (): Theme => {
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

/**
 * @description Persiste e aplica o tema visual no elemento raiz do documento.
 *
 * @param props - Propriedades recebidas pelo componente.
 * @returns Elemento React renderizado pelo componente.
 */
export const ThemeProvider = ({ children }: { children: ReactNode; }) => {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    window.localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  /**
   * @description Compõe o valor memoizado disponibilizado pelo provider aos componentes descendentes.
   *
   * @returns Resultado produzido pela operação.
   */
  const value = useMemo<ThemeContextValue>(() => ({
    theme,
    setTheme,
    /**
     * @description Alterna entre os temas claro e escuro e persiste a preferência no navegador.
     */
    toggleTheme: () => setTheme((current) => current === "light" ? "dark" : "light"),
  }), [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
