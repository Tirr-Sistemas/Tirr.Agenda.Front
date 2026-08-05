import type { IdentityProfile, SessionSnapshot } from "../../dtos/AuthDtos";
import type { AuthenticationGateway } from "../../ports/AuthenticationGateway";
import type { SessionRepository } from "../../ports/SessionRepository";
import type { AuthenticationCommand } from "./AuthenticationCommand";
import type { AuthenticationResult } from "./AuthenticationResult";

/**
 * @description Coordinates authentication, normalized session persistence and business context.
 */
export class AuthenticationUseCase {
  /**
   * @description Cria o caso de uso com as portas de autenticação e sessão.
   *
   * @param gateway - Valor de gateway utilizado pela operação.
   * @param session - Valor de session utilizado pela operação.
   */
  public constructor(private readonly gateway: AuthenticationGateway, private readonly session: SessionRepository) { }

  /**
   * @description Executa a operação de autenticação indicada pelo comando e devolve o contrato de resultado correspondente.
   *
   * @param command - Contrato de entrada que identifica e parametriza a operação.
   * @returns Promessa resolvida com o resultado da operação.
   */
  public execute(command: Extract<AuthenticationCommand, { type: "register" | "logout" | "logoutAll" | "changePassword"; }>): Promise<void>;
  /**
   * @description Executa a operação de autenticação indicada pelo comando e devolve o contrato de resultado correspondente.
   *
   * @param command - Contrato de entrada que identifica e parametriza a operação.
   * @returns Promessa resolvida com o resultado da operação.
   */
  public execute(command: Extract<AuthenticationCommand, { type: "login" | "selectBusiness"; }>): Promise<SessionSnapshot>;
  /**
   * @description Executa a operação de autenticação indicada pelo comando e devolve o contrato de resultado correspondente.
   *
   * @param command - Contrato de entrada que identifica e parametriza a operação.
   * @returns Promessa resolvida com o resultado da operação.
   */
  public execute(command: Extract<AuthenticationCommand, { type: "refresh"; }>): Promise<SessionSnapshot | null>;
  /**
   * @description Executa a operação de autenticação indicada pelo comando e devolve o contrato de resultado correspondente.
   *
   * @param command - Contrato de entrada que identifica e parametriza a operação.
   * @returns Promessa resolvida com o resultado da operação.
   */
  public execute(command: Extract<AuthenticationCommand, { type: "updateProfile"; }>): Promise<IdentityProfile>;
  /**
   * @description Executa a operação de autenticação indicada pelo comando e devolve o contrato de resultado correspondente.
   *
   * @param command - Contrato de entrada que identifica e parametriza a operação.
   * @returns Promessa resolvida com o resultado da operação.
   */
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

  /**
   * @description Autentica as credenciais informadas e atualiza a sessão global do usuário.
   *
   * @param email - E-mail utilizado pela operação.
   * @param password - Senha utilizada pela operação.
   * @returns Promessa resolvida com o resultado da operação.
   */
  private async login(email: string, password: string): Promise<SessionSnapshot> { const token = await this.gateway.login(email.trim(), password); return this.completeSession(token.accessToken, token.refreshToken, this.session.getActiveBusinessId()); }
  /**
   * @description Executa a responsabilidade de refresh no contexto de authentication.
   *
   * @returns Promessa resolvida com o resultado da operação.
   */
  private async refresh(): Promise<SessionSnapshot | null> { const refreshToken = this.session.getRefreshToken(); if (!refreshToken) return null; try { const token = await this.gateway.refresh(refreshToken); return await this.completeSession(token.accessToken, token.refreshToken, this.session.getActiveBusinessId()); } catch { this.clear(); return null; } }
  /**
   * @description Seleciona o estabelecimento ativo e atualiza tokens, papéis e permissões.
   *
   * @param snapshot - Valor de snapshot utilizado pela operação.
   * @param businessId - Identificador do estabelecimento no qual a operação será executada.
   * @returns Promessa resolvida com o resultado da operação.
   * @throws Repassa a falha quando a regra ou dependência necessária não puder concluir a operação.
   */
  private async selectBusiness(snapshot: SessionSnapshot, businessId: string): Promise<SessionSnapshot> { const activeBusiness = snapshot.businesses.find((item) => item.businessId === businessId); if (!activeBusiness) throw new Error("Empresa indisponível para esta conta."); const context = await this.gateway.selectBusiness(businessId); this.gateway.setAccessToken(context.accessToken); this.session.setActiveBusinessId(businessId); return { ...snapshot, activeBusiness, accessToken: context.accessToken, roles: context.roles, permissions: context.permissions }; }
  /**
   * @description Encerra a sessão atual e remove os dados autenticados do store.
   *
   * @param refreshToken - Token de renovação associado à sessão.
   * @returns Promessa resolvida com o resultado da operação.
   */
  private async logout(refreshToken: string | null): Promise<void> { try { if (refreshToken) await this.gateway.logout(refreshToken); } finally { this.clear(); } }
  /**
   * @description Encerra todas as sessões do usuário e limpa o estado autenticado local.
   *
   * @param refreshToken - Token de renovação associado à sessão.
   * @returns Promessa resolvida com o resultado da operação.
   */
  private async logoutAll(refreshToken: string | null): Promise<void> { try { await this.gateway.logoutAll(); } finally { await this.logout(refreshToken); } }
  /**
   * @description Executa a responsabilidade de complete session no contexto de authentication.
   *
   * @param accessToken - Valor de access token utilizado pela operação.
   * @param refreshToken - Token de renovação associado à sessão.
   * @param preferredBusinessId - Valor de preferred business id utilizado pela operação.
   * @returns Promessa resolvida com o resultado da operação.
   */
  private async completeSession(accessToken: string, refreshToken: string, preferredBusinessId: string | null): Promise<SessionSnapshot> { this.gateway.setAccessToken(accessToken); this.session.setRefreshToken(refreshToken); const [user, businesses] = await Promise.all([this.gateway.me(), this.gateway.businesses()]); const selected = businesses.find((item) => item.businessId === preferredBusinessId) ?? businesses[0] ?? null; if (!selected) return { user, businesses, activeBusiness: null, accessToken, refreshToken, roles: [], permissions: [] }; const context = await this.gateway.selectBusiness(selected.businessId); this.gateway.setAccessToken(context.accessToken); this.session.setActiveBusinessId(selected.businessId); return { user, businesses, activeBusiness: selected, accessToken: context.accessToken, refreshToken, roles: context.roles, permissions: context.permissions }; }
  /**
   * @description Executa a responsabilidade de clear no contexto de authentication.
   */
  private clear(): void { this.gateway.setAccessToken(null); this.session.setRefreshToken(null); this.session.setActiveBusinessId(null); }
}
