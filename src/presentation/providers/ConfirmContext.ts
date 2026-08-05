import { createContext } from "react";

/** Conteúdo e aparência de uma confirmação solicitada pela interface. */
export type ConfirmOptions = {
  readonly title: string;
  readonly description: string;
  readonly confirmLabel?: string;
  readonly tone?: "primary" | "danger";
};

/** Função assíncrona que resolve conforme a decisão do usuário. */
export type ConfirmContextValue = (options: ConfirmOptions) => Promise<boolean>;

/** Contexto compartilhado para confirmações acessíveis. */
export const ConfirmContext = createContext<ConfirmContextValue | null>(null);
