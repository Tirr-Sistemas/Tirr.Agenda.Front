export interface SessionRepository {
  getRefreshToken(): string | null;
  setRefreshToken(token: string | null): void;
  getActiveBusinessId(): string | null;
  setActiveBusinessId(businessId: string | null): void;
}
