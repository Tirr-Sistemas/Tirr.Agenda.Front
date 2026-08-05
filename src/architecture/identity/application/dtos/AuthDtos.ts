export interface IdentityProfile { readonly id: string; readonly fullName: string; readonly email: string; }
export interface UserBusiness { readonly businessId: string; readonly name: string; readonly slug: string; readonly roles: string[]; }
export interface TokenResponse { readonly accessToken: string; readonly refreshToken: string; }
export interface BusinessContext { readonly accessToken: string; readonly businessId: string; readonly roles: string[]; readonly permissions: string[]; }
export interface FirstAccessInput { readonly fullName: string; readonly email: string; readonly password: string; readonly businessName: string; readonly businessSlug: string; readonly timeZoneId: string; readonly legalName?: string; readonly documentNumber?: string; }
export interface SessionSnapshot { readonly user: IdentityProfile; readonly businesses: UserBusiness[]; readonly activeBusiness: UserBusiness | null; readonly accessToken: string; readonly refreshToken: string; readonly roles: string[]; readonly permissions: string[]; }
