import type { IdentityProfile, SessionSnapshot } from "../../dtos/AuthDtos";
import type { AuthenticationGateway } from "../../ports/AuthenticationGateway";
import type { SessionRepository } from "../../ports/SessionRepository";
import type { AuthenticationCommand } from "./AuthenticationCommand";
import type { AuthenticationResult } from "./AuthenticationResult";

/** Coordinates authentication, normalized session persistence and business context. */
export class AuthenticationUseCase {
  public constructor(private readonly gateway: AuthenticationGateway, private readonly session: SessionRepository) {}

  public execute(command: Extract<AuthenticationCommand, { type: "register" | "logout" | "logoutAll" | "changePassword" }>): Promise<void>;
  public execute(command: Extract<AuthenticationCommand, { type: "login" | "selectBusiness" }>): Promise<SessionSnapshot>;
  public execute(command: Extract<AuthenticationCommand, { type: "refresh" }>): Promise<SessionSnapshot | null>;
  public execute(command: Extract<AuthenticationCommand, { type: "updateProfile" }>): Promise<IdentityProfile>;
  public execute(command: AuthenticationCommand): Promise<AuthenticationResult> {
    switch (command.type) {
      case "register": return this.gateway.register(command.input);
      case "login": return this.login(command.email, command.password);
      case "refresh": return this.refresh();
      case "selectBusiness": return this.selectBusiness(command.session, command.businessId);
      case "logout": return this.logout(command.refreshToken);
      case "logoutAll": return this.logoutAll(command.refreshToken);
      case "changePassword": return this.gateway.changePassword(command.currentPassword, command.newPassword);
      case "updateProfile": return this.gateway.updateProfile(command.fullName, command.email);
    }
  }

  private async login(email: string, password: string): Promise<SessionSnapshot> { const token = await this.gateway.login(email.trim(), password); return this.completeSession(token.accessToken, token.refreshToken, this.session.getActiveBusinessId()); }
  private async refresh(): Promise<SessionSnapshot | null> { const refreshToken = this.session.getRefreshToken(); if (!refreshToken) return null; try { const token = await this.gateway.refresh(refreshToken); return await this.completeSession(token.accessToken, token.refreshToken, this.session.getActiveBusinessId()); } catch { this.clear(); return null; } }
  private async selectBusiness(snapshot: SessionSnapshot, businessId: string): Promise<SessionSnapshot> { const activeBusiness = snapshot.businesses.find((item) => item.businessId === businessId); if (!activeBusiness) throw new Error("Empresa indisponível para esta conta."); const context = await this.gateway.selectBusiness(businessId); this.gateway.setAccessToken(context.accessToken); this.session.setActiveBusinessId(businessId); return { ...snapshot, activeBusiness, accessToken: context.accessToken, roles: context.roles, permissions: context.permissions }; }
  private async logout(refreshToken: string | null): Promise<void> { try { if (refreshToken) await this.gateway.logout(refreshToken); } finally { this.clear(); } }
  private async logoutAll(refreshToken: string | null): Promise<void> { try { await this.gateway.logoutAll(); } finally { await this.logout(refreshToken); } }
  private async completeSession(accessToken: string, refreshToken: string, preferredBusinessId: string | null): Promise<SessionSnapshot> { this.gateway.setAccessToken(accessToken); this.session.setRefreshToken(refreshToken); const [user, businesses] = await Promise.all([this.gateway.me(), this.gateway.businesses()]); const selected = businesses.find((item) => item.businessId === preferredBusinessId) ?? businesses[0] ?? null; if (!selected) return { user, businesses, activeBusiness: null, accessToken, refreshToken, roles: [], permissions: [] }; const context = await this.gateway.selectBusiness(selected.businessId); this.gateway.setAccessToken(context.accessToken); this.session.setActiveBusinessId(selected.businessId); return { user, businesses, activeBusiness: selected, accessToken: context.accessToken, refreshToken, roles: context.roles, permissions: context.permissions }; }
  private clear(): void { this.gateway.setAccessToken(null); this.session.setRefreshToken(null); this.session.setActiveBusinessId(null); }
}
