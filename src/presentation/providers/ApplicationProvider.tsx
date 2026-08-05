import { type PropsWithChildren } from "react";
import type { ApplicationDependencies } from "@/core/applicationDependencies";
import { ApplicationContext } from "./ApplicationContext";

export function ApplicationProvider({ application, children }: PropsWithChildren<{ readonly application: ApplicationDependencies }>): React.JSX.Element {
  return <ApplicationContext.Provider value={application}>{children}</ApplicationContext.Provider>;
}
