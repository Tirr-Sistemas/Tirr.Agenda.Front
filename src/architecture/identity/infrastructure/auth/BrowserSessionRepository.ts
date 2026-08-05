import type { SessionRepository } from "@/identity/application/ports/SessionRepository";

const refreshTokenKey = "tirr.refresh-token";
const activeBusinessKey = "tirr.active-business";
/**
 * @description Browser storage adapter; no presentation component accesses browser storage directly.
 */
export class BrowserSessionRepository implements SessionRepository {
  /**
   * @description Obtém refresh token necessário à operação atual.
   *
   * @returns Texto resultante da operação.
   */
  public getRefreshToken(): string | null { return typeof window === "undefined" ? null : window.sessionStorage.getItem(refreshTokenKey); }
  /**
   * @description Atualiza refresh token com o valor informado.
   *
   * @param token - Token de acesso que será armazenado ou removido.
   */
  public setRefreshToken(token: string | null): void { if (typeof window === "undefined") return; if (token) window.sessionStorage.setItem(refreshTokenKey, token); else window.sessionStorage.removeItem(refreshTokenKey); }
  /**
   * @description Obtém active business id necessário à operação atual.
   *
   * @returns Texto resultante da operação.
   */
  public getActiveBusinessId(): string | null { return typeof window === "undefined" ? null : window.localStorage.getItem(activeBusinessKey); }
  /**
   * @description Atualiza active business id com o valor informado.
   *
   * @param businessId - Identificador do estabelecimento no qual a operação será executada.
   */
  public setActiveBusinessId(businessId: string | null): void { if (typeof window === "undefined") return; if (businessId) window.localStorage.setItem(activeBusinessKey, businessId); else window.localStorage.removeItem(activeBusinessKey); }
}
