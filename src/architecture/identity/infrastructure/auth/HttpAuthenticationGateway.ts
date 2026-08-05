import type { FirstAccessInput, BusinessContext, IdentityProfile, TokenResponse, UserBusiness } from "@/identity/application/dtos/AuthDtos";
import type { AuthenticationGateway } from "@/identity/application/ports/AuthenticationGateway";
import { apiHttp, publicHttp, setApiAccessToken } from "@/shared-architecture/http/ApiHttpClient";

type UserBusinessesResponse = { readonly businesses: UserBusiness[] };

/** Adaptador HTTP para autenticação, perfil e contexto do estabelecimento. */
export class HttpAuthenticationGateway implements AuthenticationGateway {
  public async register(input: FirstAccessInput): Promise<void> { await publicHttp.post("/public/auth/register", input); }
  public async login(email: string, password: string): Promise<TokenResponse> { return (await publicHttp.post<TokenResponse>("/public/auth/login", { email, password })).data; }
  public async refresh(refreshToken: string): Promise<TokenResponse> { return (await publicHttp.post<TokenResponse>("/public/auth/refresh", { refreshToken })).data; }
  public async logout(refreshToken: string): Promise<void> { await apiHttp.post("/public/auth/logout", { refreshToken }); }
  public async logoutAll(): Promise<void> { await apiHttp.post("/auth/logout-all"); }
  public async changePassword(currentPassword: string, newPassword: string): Promise<void> { await apiHttp.post("/auth/change-password", { currentPassword, newPassword }); }
  public async me(): Promise<IdentityProfile> { return (await apiHttp.get<IdentityProfile>("/me")).data; }
  public async businesses(): Promise<UserBusiness[]> { return (await apiHttp.get<UserBusinessesResponse>("/me/businesses")).data.businesses; }
  public async selectBusiness(businessId: string): Promise<BusinessContext> { return (await apiHttp.post<BusinessContext>("/auth/business-context", { businessId })).data; }
  public async updateProfile(fullName: string, email: string): Promise<IdentityProfile> { return (await apiHttp.put<IdentityProfile>("/me", { fullName, email })).data; }
  public setAccessToken(token: string | null): void { setApiAccessToken(token); }
}
