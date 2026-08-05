import { type PropsWithChildren } from "react";
import type { ApplicationDependencies } from "@/core/applicationDependencies";
import { ApplicationContext } from "./ApplicationContext";

/** Disponibiliza o grafo de casos de uso para toda a árvore de apresentação. */
export function ApplicationProvider({ application, children }: PropsWithChildren<{ readonly application: ApplicationDependencies }>): React.JSX.Element {
  return <ApplicationContext.Provider value={application}>{children}</ApplicationContext.Provider>;
}
