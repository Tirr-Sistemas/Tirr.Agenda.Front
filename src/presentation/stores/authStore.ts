import { create } from "zustand";

import type { FirstAccessInput, IdentityProfile, UserBusiness } from "@/identity/application/dtos/AuthDtos";
import type { AuthenticationUseCase } from "@/identity/application/useCases/Authentication/AuthenticationUseCase";

/**
 * @description Fases possíveis do ciclo de restauração e autenticação da sessão.
 */
type SessionStatus = "idle" | "loading" | "authenticated" | "unauthenticated";

/**
 * @description Estado global e comandos de autenticação consumidos pela apresentação.
 */
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

/**
 * @description Caso de uso injetado pelo composition root.
 */
let authentication: AuthenticationUseCase | null = null;
/**
 * @description Injeta o caso de uso de autenticação utilizado pelo store.
 *
 * @param useCase - Fachada de autenticação da aplicação.
 * @returns Sem valor de retorno.
 */
export const configureAuthentication = (useCase: AuthenticationUseCase): void => { authentication = useCase; };
/**
 * @description Obtém o caso de uso de autenticação configurado para o store.
 *
 * @returns Resultado produzido pela operação.
 * @throws Repassa a falha quando a regra ou dependência necessária não puder concluir a operação.
 */
const requireAuthentication = (): AuthenticationUseCase => {
  if (!authentication) throw new Error("A autenticação não foi configurada.");
  return authentication;
};
const unauthenticatedState = { status: "unauthenticated" as const, user: null, businesses: [], activeBusiness: null, accessToken: null, refreshToken: null, roles: [], permissions: [] };

/**
 * @description Store Zustand que mantém sessão, permissões e estabelecimento ativo.
 */
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

  /**
   * @description Restaura a sessão persistida antes de liberar as rotas da aplicação.
   *
   * @returns Promessa resolvida com o resultado da operação.
   */
  bootstrap: async () => {
    if (get().status !== "idle") return;
    set({ status: "loading", error: null });
    const token = await get().refreshSession();
    if (!token) set({ status: "unauthenticated" });
  },

  /**
   * @description Autentica as credenciais informadas e atualiza a sessão global do usuário.
   *
   * @param email - E-mail utilizado pela operação.
   * @param password - Senha utilizada pela operação.
   * @returns Promessa resolvida com o resultado da operação.
   * @throws Repassa a falha quando a regra ou dependência necessária não puder concluir a operação.
   */
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

  /**
   * @description Registra o primeiro acesso por meio do caso de uso de autenticação.
   *
   * @param input - Dados necessários para executar a operação.
   * @returns Promessa resolvida com o resultado da operação.
   */
  register: async (input) => { await requireAuthentication().execute({ type: "register", input }); },

  /**
   * @description Seleciona o estabelecimento ativo e atualiza tokens, papéis e permissões.
   *
   * @param businessId - Identificador do estabelecimento no qual a operação será executada.
   * @returns Promessa resolvida com o resultado da operação.
   * @throws Repassa a falha quando a regra ou dependência necessária não puder concluir a operação.
   */
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

  /**
   * @description Renova a sessão corrente e sincroniza os dados globais de autenticação.
   *
   * @returns Promessa resolvida com o resultado da operação.
   */
  refreshSession: async () => {
    const session = await requireAuthentication().execute({ type: "refresh" });
    if (!session) { set(unauthenticatedState); return null; }
    set({ status: "authenticated", ...session });
    return session.accessToken;
  },

  /**
   * @description Encerra a sessão atual e remove os dados autenticados do store.
   *
   * @returns Promessa resolvida com o resultado da operação.
   */
  logout: async () => {
    try { await requireAuthentication().execute({ type: "logout", refreshToken: get().refreshToken }); } finally { set(unauthenticatedState); }
  },

  /**
   * @description Encerra todas as sessões do usuário e limpa o estado autenticado local.
   *
   * @returns Promessa resolvida com o resultado da operação.
   */
  logoutAll: async () => {
    try { await requireAuthentication().execute({ type: "logoutAll", refreshToken: get().refreshToken }); } finally { set(unauthenticatedState); }
  },

  /**
   * @description Altera a senha do usuário autenticado por meio do caso de uso.
   *
   * @param currentPassword - Senha atual usada para autorizar a alteração.
   * @param newPassword - Nova senha que substituirá a credencial atual.
   * @returns Promessa resolvida com o resultado da operação.
   */
  changePassword: async (currentPassword, newPassword) => {
    await requireAuthentication().execute({ type: "changePassword", currentPassword, newPassword });
  },

  /**
   * @description Verifica se a sessão ativa contém a permissão solicitada.
   *
   * @param permission - Permissão cuja concessão será verificada.
   * @returns Verdadeiro quando a condição avaliada for atendida.
   */
  can: (permission) => get().permissions.includes(permission),
}));
