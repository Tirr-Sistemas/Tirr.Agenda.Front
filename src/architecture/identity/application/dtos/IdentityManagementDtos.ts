import type { IdentityProfile } from "./AuthDtos";
/**
 * @description Usuário de identidade enriquecido com seu estado operacional.
 */
export type IdentityUser = IdentityProfile & { readonly isActive: boolean; };
/**
 * @description Associação de uma identidade a um estabelecimento.
 */
export interface BusinessMember { readonly membershipId: string; readonly identityUserId: string; readonly businessId: string; readonly roles: string[]; readonly isActive: boolean; }
/**
 * @description Membro enriquecido com dados de apresentação da identidade.
 */
export type BusinessMemberListItem = BusinessMember & { readonly fullName: string; readonly email: string; };
/**
 * @description Metadados públicos de uma chave de API, sem o segredo.
 */
export interface ApiKeyItem { readonly id: string; readonly name: string; readonly prefix: string; readonly isActive: boolean; readonly expiresAtUtc: string | null; readonly revokedAtUtc: string | null; readonly lastUsedAtUtc: string | null; readonly createdAtUtc: string; readonly permissions: string[]; }
/**
 * @description Resultado de criação ou rotação que expõe o segredo uma única vez.
 */
export interface ApiKeyCreated { readonly id: string; readonly name: string; readonly apiKey: string; readonly prefix: string; readonly permissions: string[]; readonly expiresAtUtc: string | null; }
