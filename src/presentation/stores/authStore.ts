import { create } from "zustand";

import type { FirstAccessInput, IdentityProfile, UserBusiness } from "@/identity/application/dtos/AuthDtos";
import type { AuthenticationUseCase } from "@/identity/application/useCases/Authentication/AuthenticationUseCase";

/** Fases possíveis do ciclo de restauração e autenticação da sessão. */
type SessionStatus = "idle" | "loading" | "authenticated" | "unauthenticated";

/** Estado global e comandos de autenticação consumidos pela apresentação. */
type AuthState = {
  status: SessionStatus;
  user: IdentityProfile | null;
  businesses: UserBusiness[];
  activeBusiness: UserBusiness | null;
  accessToken: string | null;
  refreshToken: string | null;
  roles: string[];
  permissions: string[];
  isSwitchingBusiness: boolean;
  error: string | null;
  bootstrap: () => Promise<void>;
  login: (email: string, password: string) => Promise<UserBusiness | null>;
  register: (input: FirstAccessInput) => Promise<void>;
  selectBusiness: (businessId: string) => Promise<UserBusiness>;
  refreshSession: () => Promise<string | null>;
  logout: () => Promise<void>;
  logoutAll: () => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  can: (permission: string) => boolean;
};

/** Caso de uso injetado pelo composition root. */
let authentication: AuthenticationUseCase | null = null;
/**
 * Injeta o caso de uso de autenticação utilizado pelo store.
 *
 * @param {AuthenticationUseCase} useCase - Fachada de autenticação da aplicação.
 * @returns {void}
 */
export const configureAuthentication = (useCase: AuthenticationUseCase): void => { authentication = useCase; };
const requireAuthentication = (): AuthenticationUseCase => {
  if (!authentication) throw new Error("A autenticação não foi configurada.");
  return authentication;
};
const unauthenticatedState = { status: "unauthenticated" as const, user: null, businesses: [], activeBusiness: null, accessToken: null, refreshToken: null, roles: [], permissions: [] };

/** Store Zustand que mantém sessão, permissões e estabelecimento ativo. */
export const useAuthStore = create<AuthState>((set, get) => ({
  status: "idle",
  user: null,
  businesses: [],
  activeBusiness: null,
  accessToken: null,
  refreshToken: null,
  roles: [],
  permissions: [],
  isSwitchingBusiness: false,
  error: null,

  bootstrap: async () => {
    if (get().status !== "idle") return;
    set({ status: "loading", error: null });
    const token = await get().refreshSession();
    if (!token) set({ status: "unauthenticated" });
  },

  login: async (email, password) => {
    set({ status: "loading", error: null });
    try {
      const session = await requireAuthentication().execute({ type: "login", email, password });
      set({ status: "authenticated", ...session });
      return session.activeBusiness;
    } catch (error) {
      set({ ...unauthenticatedState, error: error instanceof Error ? error.message : "Nao foi possivel entrar." });
      throw error;
    }
  },

  register: async (input) => { await requireAuthentication().execute({ type: "register", input }); },

  selectBusiness: async (businessId) => {
    set({ isSwitchingBusiness: true, error: null });
    try {
      const current = get();
      if (!current.user || !current.accessToken || !current.refreshToken) throw new Error("Sessão indisponível.");
      const session = await requireAuthentication().execute({ type: "selectBusiness", session: { user: current.user, businesses: current.businesses, activeBusiness: current.activeBusiness, accessToken: current.accessToken, refreshToken: current.refreshToken, roles: current.roles, permissions: current.permissions }, businessId });
      set({ status: "authenticated", ...session });
      return session.activeBusiness!;
    } finally {
      set({ isSwitchingBusiness: false });
    }
  },

  refreshSession: async () => {
    const session = await requireAuthentication().execute({ type: "refresh" });
    if (!session) { set(unauthenticatedState); return null; }
    set({ status: "authenticated", ...session });
    return session.accessToken;
  },

  logout: async () => {
    try { await requireAuthentication().execute({ type: "logout", refreshToken: get().refreshToken }); } finally { set(unauthenticatedState); }
  },

  logoutAll: async () => {
    try { await requireAuthentication().execute({ type: "logoutAll", refreshToken: get().refreshToken }); } finally { set(unauthenticatedState); }
  },

  changePassword: async (currentPassword, newPassword) => {
    await requireAuthentication().execute({ type: "changePassword", currentPassword, newPassword });
  },

  can: (permission) => get().permissions.includes(permission),
}));
