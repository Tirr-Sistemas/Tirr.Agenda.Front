import type { BusinessContext, FirstAccessInput, IdentityProfile, TokenResponse, UserBusiness } from "../dtos/AuthDtos";

/**
 * @description Porta de saída para autenticação remota, perfil e seleção de empresa.
 */
export interface AuthenticationGateway {
  register(input: FirstAccessInput): Promise<void>;
  login(email: string, password: string): Promise<TokenResponse>;
  refresh(refreshToken: string): Promise<TokenResponse>;
  logout(refreshToken: string): Promise<void>;
  logoutAll(): Promise<void>;
  changePassword(currentPassword: string, newPassword: string): Promise<void>;
  me(): Promise<IdentityProfile>;
  businesses(): Promise<UserBusiness[]>;
  selectBusiness(businessId: string): Promise<BusinessContext>;
  updateProfile(fullName: string, email: string): Promise<IdentityProfile>;
  setAccessToken(token: string | null): void;
}
