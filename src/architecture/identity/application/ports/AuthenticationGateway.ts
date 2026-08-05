import type { BusinessContext, FirstAccessInput, IdentityProfile, TokenResponse, UserBusiness } from "../dtos/AuthDtos";

/** Port for all remote authentication and identity operations. */
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
