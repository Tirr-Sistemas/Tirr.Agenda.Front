import { createContext } from "react";
import type { ApplicationDependencies } from "@/core/applicationDependencies";

/** Contexto React que expõe exclusivamente os casos de uso da aplicação. */
export const ApplicationContext = createContext<ApplicationDependencies | null>(null);
