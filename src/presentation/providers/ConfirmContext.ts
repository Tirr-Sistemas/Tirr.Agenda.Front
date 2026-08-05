import { createContext } from "react";

export type ConfirmOptions = {
  readonly title: string;
  readonly description: string;
  readonly confirmLabel?: string;
  readonly tone?: "primary" | "danger";
};

export type ConfirmContextValue = (options: ConfirmOptions) => Promise<boolean>;

export const ConfirmContext = createContext<ConfirmContextValue | null>(null);
