import { create } from "zustand";

import { authApi, setApiAccessToken, setApiRefreshHandler } from "@/service/api";
import type { FirstAccessInput, IdentityProfile, UserBusiness } from "@/service/api";

const REFRESH_TOKEN_KEY = "tirr.refresh-token";
const ACTIVE_BUSINESS_KEY = "tirr.active-business";

type SessionStatus = "idle" | "loading" | "authenticated" | "unauthenticated";

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

const getStored = (key: string) => typeof window === "undefined" ? null : window.sessionStorage.getItem(key);
const storeRefreshToken = (token: string | null) => {
  if (typeof window === "undefined") return;
  if (token) window.sessionStorage.setItem(REFRESH_TOKEN_KEY, token);
  else window.sessionStorage.removeItem(REFRESH_TOKEN_KEY);
};

const clearSession = () => {
  setApiAccessToken(null);
  storeRefreshToken(null);
};

export const useAuthStore = create<AuthState>((set, get) => ({
  status: "idle",
  user: null,
  businesses: [],
  activeBusiness: null,
  accessToken: null,
  refreshToken: getStored(REFRESH_TOKEN_KEY),
  roles: [],
  permissions: [],
  isSwitchingBusiness: false,
  error: null,

  bootstrap: async () => {
    if (get().status !== "idle") return;
    const refreshToken = get().refreshToken ?? getStored(REFRESH_TOKEN_KEY);
    if (!refreshToken) {
      set({ status: "unauthenticated" });
      return;
    }

    set({ status: "loading", error: null });
    const token = await get().refreshSession();
    if (!token) set({ status: "unauthenticated" });
  },

  login: async (email, password) => {
    set({ status: "loading", error: null });
    try {
      const session = await authApi.login(email.trim(), password);
      setApiAccessToken(session.accessToken);
      storeRefreshToken(session.refreshToken);
      set({ accessToken: session.accessToken, refreshToken: session.refreshToken });

      const [user, businesses] = await Promise.all([authApi.me(), authApi.businesses()]);
      set({ user, businesses });
      if (!businesses.length) {
        set({ status: "authenticated", activeBusiness: null });
        return null;
      }

      const rememberedId = window.localStorage.getItem(ACTIVE_BUSINESS_KEY);
      const selected = businesses.find((item) => item.businessId === rememberedId) ?? businesses[0];
      await get().selectBusiness(selected.businessId);
      return selected;
    } catch (error) {
      clearSession();
      set({ status: "unauthenticated", error: error instanceof Error ? error.message : "Nao foi possivel entrar." });
      throw error;
    }
  },

  register: async (input) => { await authApi.register(input); },

  selectBusiness: async (businessId) => {
    const selected = get().businesses.find((item) => item.businessId === businessId);
    if (!selected) throw new Error("Empresa indisponivel para esta conta.");

    set({ isSwitchingBusiness: true, error: null });
    try {
      const context = await authApi.selectBusiness(businessId);
      setApiAccessToken(context.accessToken);
      window.localStorage.setItem(ACTIVE_BUSINESS_KEY, businessId);
      set({
        status: "authenticated",
        accessToken: context.accessToken,
        activeBusiness: selected,
        roles: context.roles,
        permissions: context.permissions,
      });
      return selected;
    } finally {
      set({ isSwitchingBusiness: false });
    }
  },

  refreshSession: async () => {
    const refreshToken = get().refreshToken ?? getStored(REFRESH_TOKEN_KEY);
    if (!refreshToken) return null;

    try {
      const session = await authApi.refresh(refreshToken);
      setApiAccessToken(session.accessToken);
      storeRefreshToken(session.refreshToken);
      set({ accessToken: session.accessToken, refreshToken: session.refreshToken });

      const [user, businesses] = await Promise.all([authApi.me(), authApi.businesses()]);
      set({ user, businesses });
      const rememberedId = get().activeBusiness?.businessId ?? window.localStorage.getItem(ACTIVE_BUSINESS_KEY);
      const selected = businesses.find((item) => item.businessId === rememberedId) ?? businesses[0] ?? null;
      if (!selected) {
        set({ status: "authenticated", activeBusiness: null, roles: [], permissions: [] });
        return session.accessToken;
      }

      const context = await authApi.selectBusiness(selected.businessId);
      setApiAccessToken(context.accessToken);
      set({
        status: "authenticated",
        accessToken: context.accessToken,
        activeBusiness: selected,
        roles: context.roles,
        permissions: context.permissions,
      });
      return context.accessToken;
    } catch {
      clearSession();
      set({
        status: "unauthenticated", user: null, businesses: [], activeBusiness: null,
        accessToken: null, refreshToken: null, roles: [], permissions: [],
      });
      return null;
    }
  },

  logout: async () => {
    const refreshToken = get().refreshToken;
    try { if (refreshToken) await authApi.logout(refreshToken); } finally {
      clearSession();
      set({ status: "unauthenticated", user: null, businesses: [], activeBusiness: null, accessToken: null, refreshToken: null, roles: [], permissions: [] });
    }
  },

  logoutAll: async () => {
    try { await authApi.logoutAll(); } finally { await get().logout(); }
  },

  changePassword: async (currentPassword, newPassword) => {
    await authApi.changePassword(currentPassword, newPassword);
  },

  can: (permission) => get().permissions.includes(permission),
}));

setApiRefreshHandler(() => useAuthStore.getState().refreshSession());
