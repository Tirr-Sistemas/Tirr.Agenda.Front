import { createContext, useContext } from "react";

/** Temas de cor suportados pelo produto. */
export type Theme = "light" | "dark";
/** Estado e comandos disponibilizados pelo provider de tema. */
export type ThemeContextValue = { theme: Theme; setTheme: (theme: Theme) => void; toggleTheme: () => void };

/** Contexto React que compartilha a preferência visual atual. */
export const ThemeContext = createContext<ThemeContextValue | null>(null);

/**
 * Obtém o tema atual e seus comandos.
 *
 * @returns {ThemeContextValue} Estado e operações de tema.
 * @throws {Error} Quando utilizado fora de `ThemeProvider`.
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme deve ser usado dentro de ThemeProvider.");
  return context;
};
