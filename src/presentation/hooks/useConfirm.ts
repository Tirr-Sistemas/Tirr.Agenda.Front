import { useContext } from "react";

import { ConfirmContext, type ConfirmContextValue } from "@/presentation/providers/ConfirmContext";

/**
 * Solicita uma confirmação modal e aguarda a decisão do usuário.
 *
 * @returns {ConfirmContextValue} Função que abre o diálogo acessível.
 * @throws {Error} Quando utilizado fora de `ConfirmProvider`.
 */
export const useConfirm = (): ConfirmContextValue => {
  const value = useContext(ConfirmContext);
  if (!value) throw new Error("useConfirm deve ser usado dentro de ConfirmProvider.");
  return value;
};
