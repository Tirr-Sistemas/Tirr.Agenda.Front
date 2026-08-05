/** Perfil básico da identidade autenticada. */
export interface IdentityProfile { readonly id: string; readonly fullName: string; readonly email: string; }
/** Estabelecimento ao qual o usuário possui acesso e seus papéis locais. */
export interface UserBusiness { readonly businessId: string; readonly name: string; readonly slug: string; readonly roles: string[]; }
/** Par de tokens emitido por uma operação de autenticação. */
export interface TokenResponse { readonly accessToken: string; readonly refreshToken: string; }
/** Contexto autorizado retornado após selecionar um estabelecimento. */
export interface BusinessContext { readonly accessToken: string; readonly businessId: string; readonly roles: string[]; readonly permissions: string[]; }
/** Dados necessários para criar a primeira conta e o primeiro estabelecimento. */
export interface FirstAccessInput { readonly fullName: string; readonly email: string; readonly password: string; readonly businessName: string; readonly businessSlug: string; readonly timeZoneId: string; readonly legalName?: string; readonly documentNumber?: string; }
/** Fotografia completa da sessão usada pela aplicação e pelo estado da interface. */
export interface SessionSnapshot { readonly user: IdentityProfile; readonly businesses: UserBusiness[]; readonly activeBusiness: UserBusiness | null; readonly accessToken: string; readonly refreshToken: string; readonly roles: string[]; readonly permissions: string[]; }
