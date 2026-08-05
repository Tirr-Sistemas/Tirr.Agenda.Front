import type { IdentityProfile } from "../../dtos/AuthDtos";
import type { ApiKeyCreated, ApiKeyItem, BusinessMember, BusinessMemberListItem, IdentityUser } from "../../dtos/IdentityManagementDtos";
import type { IdentityManagementGateway } from "../../ports/IdentityManagementGateway";
import type { ManageIdentityCommand } from "./ManageIdentityCommand";
import type { ManageIdentityResult } from "./ManageIdentityResult";
export class ManageIdentityUseCase {
  public constructor(private readonly gateway: IdentityManagementGateway) {}
  public execute(command: Extract<ManageIdentityCommand, { type: "findByEmail" }>): Promise<IdentityUser>;
  public execute(command: Extract<ManageIdentityCommand, { type: "createUser" }>): Promise<IdentityProfile>;
  public execute(command: Extract<ManageIdentityCommand, { type: "addMember" }>): Promise<BusinessMember>;
  public execute(command: Extract<ManageIdentityCommand, { type: "listMembers" }>): Promise<BusinessMemberListItem[]>;
  public execute(command: Extract<ManageIdentityCommand, { type: "setMemberStatus" | "revokeApiKey" }>): Promise<void>;
  public execute(command: Extract<ManageIdentityCommand, { type: "listApiKeys" }>): Promise<ApiKeyItem[]>;
  public execute(command: Extract<ManageIdentityCommand, { type: "createApiKey" | "rotateApiKey" }>): Promise<ApiKeyCreated>;
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
