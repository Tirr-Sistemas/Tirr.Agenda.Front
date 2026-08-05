import { useContext } from "react";

import { ConfirmContext, type ConfirmContextValue } from "@/presentation/providers/ConfirmContext";

/**
 * @description Solicita uma confirmação modal e aguarda a decisão do usuário.
 *
 * @returns Função que abre o diálogo acessível.
 * @throws Quando utilizado fora de `ConfirmProvider`.
 */
export const useConfirm = (): ConfirmContextValue => {
  const value = useContext(ConfirmContext);
  if (!value) throw new Error("useConfirm deve ser usado dentro de ConfirmProvider.");
  return value;
};
