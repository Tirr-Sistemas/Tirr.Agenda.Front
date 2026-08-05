import { useContext } from "react";
import { ApplicationContext } from "@/presentation/providers/ApplicationContext";
import type { ApplicationDependencies } from "@/core/applicationDependencies";

/**
 * @description Returns use cases; infrastructure adapters are deliberately not exposed to presentation.
 *
 * @returns Resultado produzido pela operação.
 * @throws Repassa a falha quando a regra ou dependência necessária não puder concluir a operação.
 */
export function useApplication(): ApplicationDependencies {
  const application = useContext(ApplicationContext);
  if (!application) throw new Error("useApplication deve ser utilizado dentro de ApplicationProvider.");
  return application;
}
