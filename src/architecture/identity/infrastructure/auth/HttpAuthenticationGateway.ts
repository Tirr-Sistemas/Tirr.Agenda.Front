import type { FirstAccessInput, BusinessContext, IdentityProfile, TokenResponse, UserBusiness } from "@/identity/application/dtos/AuthDtos";
import type { AuthenticationGateway } from "@/identity/application/ports/AuthenticationGateway";
import { apiHttp, publicHttp, setApiAccessToken } from "@/shared-architecture/http/ApiHttpClient";

type UserBusinessesResponse = { readonly businesses: UserBusiness[]; };

/**
 * @description Adaptador HTTP para autenticação, perfil e contexto do estabelecimento.
 */
export class HttpAuthenticationGateway implements AuthenticationGateway {
  /**
   * @description Registra o primeiro acesso por meio do caso de uso de autenticação.
   *
   * @param input - Dados necessários para executar a operação.
   * @returns Promessa resolvida com o resultado da operação.
   */
  public async register(input: FirstAccessInput): Promise<void> { await publicHttp.post("/public/auth/register", input); }
  /**
   * @description Autentica as credenciais informadas e atualiza a sessão global do usuário.
   *
   * @param email - E-mail utilizado pela operação.
   * @param password - Senha utilizada pela operação.
   * @returns Promessa resolvida com o resultado da operação.
   */
  public async login(email: string, password: string): Promise<TokenResponse> { return (await publicHttp.post<TokenResponse>("/public/auth/login", { email, password })).data; }
  /**
   * @description Executa a responsabilidade de refresh no contexto de http authentication gateway.
   *
   * @param refreshToken - Token de renovação associado à sessão.
   * @returns Promessa resolvida com o resultado da operação.
   */
  public async refresh(refreshToken: string): Promise<TokenResponse> { return (await publicHttp.post<TokenResponse>("/public/auth/refresh", { refreshToken })).data; }
  /**
   * @description Encerra a sessão atual e remove os dados autenticados do store.
   *
   * @param refreshToken - Token de renovação associado à sessão.
   * @returns Promessa resolvida com o resultado da operação.
   */
  public async logout(refreshToken: string): Promise<void> { await apiHttp.post("/public/auth/logout", { refreshToken }); }
  /**
   * @description Encerra todas as sessões do usuário e limpa o estado autenticado local.
   *
   * @returns Promessa resolvida com o resultado da operação.
   */
  public async logoutAll(): Promise<void> { await apiHttp.post("/auth/logout-all"); }
  /**
   * @description Altera a senha do usuário autenticado por meio do caso de uso.
   *
   * @param currentPassword - Senha atual usada para autorizar a alteração.
   * @param newPassword - Nova senha que substituirá a credencial atual.
   * @returns Promessa resolvida com o resultado da operação.
   */
  public async changePassword(currentPassword: string, newPassword: string): Promise<void> { await apiHttp.post("/auth/change-password", { currentPassword, newPassword }); }
  /**
   * @description Executa a responsabilidade de me no contexto de http authentication gateway.
   *
   * @returns Promessa resolvida com o resultado da operação.
   */
  public async me(): Promise<IdentityProfile> { return (await apiHttp.get<IdentityProfile>("/me")).data; }
  /**
   * @description Executa a responsabilidade de businesses no contexto de http authentication gateway.
   *
   * @returns Promessa resolvida com o resultado da operação.
   */
  public async businesses(): Promise<UserBusiness[]> { return (await apiHttp.get<UserBusinessesResponse>("/me/businesses")).data.businesses; }
  /**
   * @description Seleciona o estabelecimento ativo e atualiza tokens, papéis e permissões.
   *
   * @param businessId - Identificador do estabelecimento no qual a operação será executada.
   * @returns Promessa resolvida com o resultado da operação.
   */
  public async selectBusiness(businessId: string): Promise<BusinessContext> { return (await apiHttp.post<BusinessContext>("/auth/business-context", { businessId })).data; }
  /**
   * @description Envia à API a atualização de um registro de registros.
   *
   * @param fullName - Valor de full name utilizado pela operação.
   * @param email - E-mail utilizado pela operação.
   * @returns Promessa resolvida com o resultado da operação.
   */
  public async updateProfile(fullName: string, email: string): Promise<IdentityProfile> { return (await apiHttp.put<IdentityProfile>("/me", { fullName, email })).data; }
  /**
   * @description Atualiza o token usado para autenticar as próximas requisições HTTP.
   *
   * @param token - Token de acesso que será armazenado ou removido.
   */
  public setAccessToken(token: string | null): void { setApiAccessToken(token); }
}
