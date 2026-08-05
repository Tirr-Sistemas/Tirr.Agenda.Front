import type { IdentityProfile } from "./AuthDtos";
export type IdentityUser = IdentityProfile & { readonly isActive: boolean };
export interface BusinessMember { readonly membershipId: string; readonly identityUserId: string; readonly businessId: string; readonly roles: string[]; readonly isActive: boolean; }
export type BusinessMemberListItem = BusinessMember & { readonly fullName: string; readonly email: string };
export interface ApiKeyItem { readonly id: string; readonly name: string; readonly prefix: string; readonly isActive: boolean; readonly expiresAtUtc: string | null; readonly revokedAtUtc: string | null; readonly lastUsedAtUtc: string | null; readonly createdAtUtc: string; readonly permissions: string[]; }
export interface ApiKeyCreated { readonly id: string; readonly name: string; readonly apiKey: string; readonly prefix: string; readonly permissions: string[]; readonly expiresAtUtc: string | null; }
