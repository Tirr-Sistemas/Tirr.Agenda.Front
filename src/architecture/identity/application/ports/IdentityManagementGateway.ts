import type { IdentityProfile } from "../dtos/AuthDtos";
import type { ApiKeyCreated, ApiKeyItem, BusinessMember, BusinessMemberListItem, IdentityUser } from "../dtos/IdentityManagementDtos";

export interface IdentityManagementGateway {
  readonly api: {
    findByEmail(email: string): Promise<IdentityUser>;
    createUser(fullName: string, email: string, password: string): Promise<IdentityProfile>;
    addMember(businessId: string, identityUserId: string, roles: string[]): Promise<BusinessMember>;
    members(businessId: string): Promise<BusinessMemberListItem[]>;
    setMemberStatus(businessId: string, identityUserId: string, isActive: boolean): Promise<unknown>;
    apiKeys(businessId: string): Promise<ApiKeyItem[]>;
    createApiKey(businessId: string, name: string, permissions: string[], expiresAtUtc: string | null): Promise<ApiKeyCreated>;
    rotateApiKey(businessId: string, id: string): Promise<ApiKeyCreated>;
    revokeApiKey(businessId: string, id: string): Promise<unknown>;
  };
}
