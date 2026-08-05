import type { IdentityProfile } from "../../dtos/AuthDtos";
import type { ApiKeyCreated, ApiKeyItem, BusinessMember, BusinessMemberListItem, IdentityUser } from "../../dtos/IdentityManagementDtos";
export type ManageIdentityResult = void | IdentityProfile | IdentityUser | BusinessMember | BusinessMemberListItem[] | ApiKeyItem[] | ApiKeyCreated;
