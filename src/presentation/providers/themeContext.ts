import { createContext, useContext } from "react";

/**
 * @description Temas de cor suportados pelo produto.
 */
export type Theme = "light" | "dark";
/**
 * @description Estado e comandos disponibilizados pelo provider de tema.
 */
export type ThemeContextValue = { theme: Theme; setTheme: (theme: Theme) => void; toggleTheme: () => void; };

/**
 * @description Contexto React que compartilha a preferência visual atual.
 */
export const ThemeContext = createContext<ThemeContextValue | null>(null);

/**
 * @description Obtém o tema atual e seus comandos.
 *
 * @returns Estado e operações de tema.
 * @throws Quando utilizado fora de `ThemeProvider`.
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme deve ser usado dentro de ThemeProvider.");
  return context;
};
