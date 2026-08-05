import type { IdentityManagementGateway } from "@/identity/application/ports/IdentityManagementGateway";
import type { IdentityProfile } from "@/identity/application/dtos/AuthDtos";
import type { ApiKeyCreated, ApiKeyItem, BusinessMember, BusinessMemberListItem, IdentityUser } from "@/identity/application/dtos/IdentityManagementDtos";
import { apiHttp } from "@/shared-architecture/http/ApiHttpClient";

/**
 * @description Monta o caminho da API para o estabelecimento informado.
 *
 * @param businessId - Identificador do estabelecimento no qual a operação será executada.
 * @returns Texto resultante da operação.
 */
const business = (businessId: string): string => `/businesses/${businessId}`;

/**
 *  @description Adaptador HTTP para gerenciamento de usuários, membros e chaves de API.
 */
export class HttpIdentityManagementGateway implements IdentityManagementGateway {
  public readonly api = {
    /**
     * @description Localiza by email conforme os crit?rios recebidos.
     *
     * @param email - E-mail utilizado pela opera??o.
     *
     * @returns Promessa resolvida com o resultado da opera??o.
     */
    findByEmail: async (email: string): Promise<IdentityUser> => (await apiHttp.get<IdentityUser>("/users/by-email", { params: { email } })).data,
    /**
     * @description Cria uma identidade para o e-mail informado quando ela ainda n?o existe.
     *
     * @param fullName - Valor de full name utilizado pela opera??o.
     *
     * @param email - E-mail utilizado pela opera??o.
     *
     * @param password - Senha utilizada pela opera??o.
     *
     * @returns Promessa resolvida com o resultado da opera??o.
     */
    createUser: async (fullName: string, email: string, password: string): Promise<IdentityProfile> => (await apiHttp.post<IdentityProfile>("/users", { fullName, email, password })).data,
    /**
     * @description Adiciona a identidade localizada ? equipe do estabelecimento.
     *
     * @param businessId - Identificador do estabelecimento no qual a opera??o ser? executada.
     *
     * @param identityUserId - Valor de identity user id utilizado pela opera??o.
     *
     * @param roles - Pap?is que devem ser atribu?dos ao membro.
     *
     * @returns Promessa resolvida com o resultado da opera??o.
     */
    addMember: async (businessId: string, identityUserId: string, roles: string[]): Promise<BusinessMember> => (await apiHttp.post<BusinessMember>(`${business(businessId)}/members`, { identityUserId, roles })).data,
    /**
     * @description Executa a responsabilidade de members no contexto de http identity management gateway.
     *
     * @param businessId - Identificador do estabelecimento no qual a opera??o ser? executada.
     *
     * @returns Promessa resolvida com o resultado da opera??o.
     */
    members: async (businessId: string): Promise<BusinessMemberListItem[]> => (await apiHttp.get<{ members: BusinessMemberListItem[]; }>(`${business(businessId)}/members`)).data.members,
    /**
     * @description Atualiza member status com o valor informado.
     *
     * @param businessId - Identificador do estabelecimento no qual a opera??o ser? executada.
     *
     * @param identityUserId - Valor de identity user id utilizado pela opera??o.
     *
     * @param isActive - Valor de is active utilizado pela opera??o.
     *
     * @returns Promessa resolvida com o resultado da opera??o.
     */
    setMemberStatus: async (businessId: string, identityUserId: string, isActive: boolean): Promise<void> => { await apiHttp.patch(`${business(businessId)}/members/${identityUserId}/status`, { isActive }); },
    /**
     * @description Executa a responsabilidade de api keys no contexto de http identity management gateway.
     *
     * @param businessId - Identificador do estabelecimento no qual a opera??o ser? executada.
     *
     * @returns Promessa resolvida com o resultado da opera??o.
     */
    apiKeys: async (businessId: string): Promise<ApiKeyItem[]> => {
      const response = await apiHttp.get<ApiKeyItem[]>(`${business(businessId)}/api-keys`);
      return Array.isArray(response.data) ? response.data.map((item) => ({ ...item, permissions: item.permissions ?? [] })) : [];
    },
    /**
     * @description Envia ? API a cria??o de um registro de api.
     *
     * @param businessId - Identificador do estabelecimento no qual a opera??o ser? executada.
     *
     * @param name - Nome associado ao registro.
     *
     * @param permissions - Valor de permissions utilizado pela opera??o.
     *
     * @param expiresAtUtc - Valor de expires at utc utilizado pela opera??o.
     *
     * @returns Promessa resolvida com o resultado da opera??o.
     */
    createApiKey: async (businessId: string, name: string, permissions: string[], expiresAtUtc: string | null): Promise<ApiKeyCreated> => (await apiHttp.post<ApiKeyCreated>(`${business(businessId)}/api-keys`, { name, permissions, expiresAtUtc })).data,
    /**
     * @description Executa a responsabilidade de rotate api key no contexto de http identity management gateway.
     *
     * @param businessId - Identificador do estabelecimento no qual a opera??o ser? executada.
     *
     * @param id - Identificador do registro alvo.
     *
     * @returns Promessa resolvida com o resultado da opera??o.
     */
    rotateApiKey: async (businessId: string, id: string): Promise<ApiKeyCreated> => (await apiHttp.post<ApiKeyCreated>(`${business(businessId)}/api-keys/${id}/rotate`)).data,
    /**
     * @description Executa a responsabilidade de revoke api key no contexto de http identity management gateway.
     *
     * @param businessId - Identificador do estabelecimento no qual a opera??o ser? executada.
     *
     * @param id - Identificador do registro alvo.
     *
     * @returns Promessa resolvida com o resultado da opera??o.
     */
    revokeApiKey: async (businessId: string, id: string): Promise<void> => { await apiHttp.delete(`${business(businessId)}/api-keys/${id}`); },
  };
}
