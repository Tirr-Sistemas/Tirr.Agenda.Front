import type { FirstAccessInput, SessionSnapshot } from "../../dtos/AuthDtos";

export type AuthenticationCommand =
  | { readonly type: "register"; readonly input: FirstAccessInput }
  | { readonly type: "login"; readonly email: string; readonly password: string }
  | { readonly type: "refresh" }
  | { readonly type: "selectBusiness"; readonly session: SessionSnapshot; readonly businessId: string }
  | { readonly type: "logout"; readonly refreshToken: string | null }
  | { readonly type: "logoutAll"; readonly refreshToken: string | null }
  | { readonly type: "changePassword"; readonly currentPassword: string; readonly newPassword: string }
  | { readonly type: "updateProfile"; readonly fullName: string; readonly email: string };
