/**
 * @description Comandos aceitos pelo gerenciamento administrativo de identidades.
 */
export type ManageIdentityCommand =
  | { readonly type: "findByEmail"; readonly email: string; }
  | { readonly type: "createUser"; readonly fullName: string; readonly email: string; readonly password: string; }
  | { readonly type: "addMember"; readonly businessId: string; readonly identityUserId: string; readonly roles: string[]; }
  | { readonly type: "listMembers"; readonly businessId: string; }
  | { readonly type: "setMemberStatus"; readonly businessId: string; readonly identityUserId: string; readonly isActive: boolean; }
  | { readonly type: "listApiKeys"; readonly businessId: string; }
  | { readonly type: "createApiKey"; readonly businessId: string; readonly name: string; readonly permissions: string[]; readonly expiresAtUtc: string | null; }
  | { readonly type: "rotateApiKey"; readonly businessId: string; readonly id: string; }
  | { readonly type: "revokeApiKey"; readonly businessId: string; readonly id: string; };
