import { createContext } from "react";
import type { ApplicationDependencies } from "@/core/applicationDependencies";

export const ApplicationContext = createContext<ApplicationDependencies | null>(null);
