import type { SessionRepository } from "@/identity/application/ports/SessionRepository";

const refreshTokenKey = "tirr.refresh-token";
const activeBusinessKey = "tirr.active-business";
/** Browser storage adapter; no presentation component accesses browser storage directly. */
export class BrowserSessionRepository implements SessionRepository {
  public getRefreshToken(): string | null { return typeof window === "undefined" ? null : window.sessionStorage.getItem(refreshTokenKey); }
  public setRefreshToken(token: string | null): void { if (typeof window === "undefined") return; if (token) window.sessionStorage.setItem(refreshTokenKey, token); else window.sessionStorage.removeItem(refreshTokenKey); }
  public getActiveBusinessId(): string | null { return typeof window === "undefined" ? null : window.localStorage.getItem(activeBusinessKey); }
  public setActiveBusinessId(businessId: string | null): void { if (typeof window === "undefined") return; if (businessId) window.localStorage.setItem(activeBusinessKey, businessId); else window.localStorage.removeItem(activeBusinessKey); }
}
