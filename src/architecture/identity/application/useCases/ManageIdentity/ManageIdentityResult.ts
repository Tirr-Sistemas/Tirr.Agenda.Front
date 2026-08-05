import type { IdentityProfile } from "../../dtos/AuthDtos";
import type { ApiKeyCreated, ApiKeyItem, BusinessMember, BusinessMemberListItem, IdentityUser } from "../../dtos/IdentityManagementDtos";
/**
 * @description União das respostas produzidas pelo gerenciamento de identidade.
 */
export type ManageIdentityResult = void | IdentityProfile | IdentityUser | BusinessMember | BusinessMemberListItem[] | ApiKeyItem[] | ApiKeyCreated;
