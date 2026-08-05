import { type PropsWithChildren } from "react";
import type { ApplicationDependencies } from "@/core/applicationDependencies";
import { ApplicationContext } from "./ApplicationContext";

/**
 * @description Disponibiliza o grafo de casos de uso para toda a árvore de apresentação.
 *
 * @param props - Propriedades recebidas pelo componente.
 * @returns Elemento React renderizado pelo componente.
 */
export function ApplicationProvider({ application, children }: PropsWithChildren<{ readonly application: ApplicationDependencies; }>): React.JSX.Element {
  return <ApplicationContext.Provider value={application}>{children}</ApplicationContext.Provider>;
}
