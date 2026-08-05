import { useContext } from "react";

import { ConfirmContext, type ConfirmContextValue } from "@/presentation/providers/ConfirmContext";

export const useConfirm = (): ConfirmContextValue => {
  const value = useContext(ConfirmContext);
  if (!value) throw new Error("useConfirm deve ser usado dentro de ConfirmProvider.");
  return value;
};
