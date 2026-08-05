import type { IdentityProfile } from "../../dtos/AuthDtos";
import type { ApiKeyCreated, ApiKeyItem, BusinessMember, BusinessMemberListItem, IdentityUser } from "../../dtos/IdentityManagementDtos";
import type { IdentityManagementGateway } from "../../ports/IdentityManagementGateway";
import type { ManageIdentityCommand } from "./ManageIdentityCommand";
import type { ManageIdentityResult } from "./ManageIdentityResult";
/**
 * @description Coordena operações administrativas de usuários, membros e chaves de API.
 *
 * @param gateway - Porta utilizada para persistir e consultar identidades.
 */
export class ManageIdentityUseCase {
  /**
   * @description Cria o caso de uso com a porta de gestão de identidades.
   *
   * @param gateway - Valor de gateway utilizado pela operação.
   */
  public constructor(private readonly gateway: IdentityManagementGateway) { }
  /**
   * @description Executa a operação de gestão de identidades indicada pelo comando recebido.
   *
   * @param command - Contrato de entrada que identifica e parametriza a operação.
   * @returns Promessa resolvida com o resultado da operação.
   */
  public execute(command: Extract<ManageIdentityCommand, { type: "findByEmail"; }>): Promise<IdentityUser>;
  /**
   * @description Executa a operação de gestão de identidades indicada pelo comando recebido.
   *
   * @param command - Contrato de entrada que identifica e parametriza a operação.
   * @returns Promessa resolvida com o resultado da operação.
   */
  public execute(command: Extract<ManageIdentityCommand, { type: "createUser"; }>): Promise<IdentityProfile>;
  /**
   * @description Executa a operação de gestão de identidades indicada pelo comando recebido.
   *
   * @param command - Contrato de entrada que identifica e parametriza a operação.
   * @returns Promessa resolvida com o resultado da operação.
   */
  public execute(command: Extract<ManageIdentityCommand, { type: "addMember"; }>): Promise<BusinessMember>;
  /**
   * @description Executa a operação de gestão de identidades indicada pelo comando recebido.
   *
   * @param command - Contrato de entrada que identifica e parametriza a operação.
   * @returns Promessa resolvida com o resultado da operação.
   */
  public execute(command: Extract<ManageIdentityCommand, { type: "listMembers"; }>): Promise<BusinessMemberListItem[]>;
  /**
   * @description Executa a operação de gestão de identidades indicada pelo comando recebido.
   *
   * @param command - Contrato de entrada que identifica e parametriza a operação.
   * @returns Promessa resolvida com o resultado da operação.
   */
  public execute(command: Extract<ManageIdentityCommand, { type: "setMemberStatus" | "revokeApiKey"; }>): Promise<void>;
  /**
   * @description Executa a operação de gestão de identidades indicada pelo comando recebido.
   *
   * @param command - Contrato de entrada que identifica e parametriza a operação.
   * @returns Promessa resolvida com o resultado da operação.
   */
  public execute(command: Extract<ManageIdentityCommand, { type: "listApiKeys"; }>): Promise<ApiKeyItem[]>;
  /**
   * @description Executa a operação de gestão de identidades indicada pelo comando recebido.
   *
   * @param command - Contrato de entrada que identifica e parametriza a operação.
   * @returns Promessa resolvida com o resultado da operação.
   */
  public execute(command: Extract<ManageIdentityCommand, { type: "createApiKey" | "rotateApiKey"; }>): Promise<ApiKeyCreated>;
  /**
   * @description Executa a operação de gestão de identidades indicada pelo comando recebido.
   *
   * @param command - Contrato de entrada que identifica e parametriza a operação.
   * @returns Promessa resolvida com o resultado da operação.
   */
  public execute(command: ManageIdentityCommand): Promise<ManageIdentityResult> {
    const api = this.gateway.api;
    switch (command.type) {
      case "findByEmail": return api.findByEmail(command.email);
      case "createUser": return api.createUser(command.fullName, command.email, command.password);
      case "addMember": return api.addMember(command.businessId, command.identityUserId, command.roles);
      case "listMembers": return api.members(command.businessId);
      case "setMemberStatus": return api.setMemberStatus(command.businessId, command.identityUserId, command.isActive).then(() => undefined);
      case "listApiKeys": return api.apiKeys(command.businessId);
      case "createApiKey": return api.createApiKey(command.businessId, command.name, command.permissions, command.expiresAtUtc);
      case "rotateApiKey": return api.rotateApiKey(command.businessId, command.id);
      case "revokeApiKey": return api.revokeApiKey(command.businessId, command.id).then(() => undefined);
    }
  }
}
