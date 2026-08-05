import type { IdentityManagementGateway } from "@/identity/application/ports/IdentityManagementGateway";
import type { IdentityProfile } from "@/identity/application/dtos/AuthDtos";
import type { ApiKeyCreated, ApiKeyItem, BusinessMember, BusinessMemberListItem, IdentityUser } from "@/identity/application/dtos/IdentityManagementDtos";
import { apiHttp } from "@/shared-architecture/http/ApiHttpClient";

const business = (businessId: string): string => `/businesses/${businessId}`;

/** Adaptador HTTP para gerenciamento de usuários, membros e chaves de API. */
export class HttpIdentityManagementGateway implements IdentityManagementGateway {
  public readonly api = {
    findByEmail: async (email: string): Promise<IdentityUser> => (await apiHttp.get<IdentityUser>("/users/by-email", { params: { email } })).data,
    createUser: async (fullName: string, email: string, password: string): Promise<IdentityProfile> => (await apiHttp.post<IdentityProfile>("/users", { fullName, email, password })).data,
    addMember: async (businessId: string, identityUserId: string, roles: string[]): Promise<BusinessMember> => (await apiHttp.post<BusinessMember>(`${business(businessId)}/members`, { identityUserId, roles })).data,
    members: async (businessId: string): Promise<BusinessMemberListItem[]> => (await apiHttp.get<{ members: BusinessMemberListItem[] }>(`${business(businessId)}/members`)).data.members,
    setMemberStatus: async (businessId: string, identityUserId: string, isActive: boolean): Promise<void> => { await apiHttp.patch(`${business(businessId)}/members/${identityUserId}/status`, { isActive }); },
    apiKeys: async (businessId: string): Promise<ApiKeyItem[]> => {
      const response = await apiHttp.get<ApiKeyItem[]>(`${business(businessId)}/api-keys`);
      return Array.isArray(response.data) ? response.data.map((item) => ({ ...item, permissions: item.permissions ?? [] })) : [];
    },
    createApiKey: async (businessId: string, name: string, permissions: string[], expiresAtUtc: string | null): Promise<ApiKeyCreated> => (await apiHttp.post<ApiKeyCreated>(`${business(businessId)}/api-keys`, { name, permissions, expiresAtUtc })).data,
    rotateApiKey: async (businessId: string, id: string): Promise<ApiKeyCreated> => (await apiHttp.post<ApiKeyCreated>(`${business(businessId)}/api-keys/${id}/rotate`)).data,
    revokeApiKey: async (businessId: string, id: string): Promise<void> => { await apiHttp.delete(`${business(businessId)}/api-keys/${id}`); },
  };
}
