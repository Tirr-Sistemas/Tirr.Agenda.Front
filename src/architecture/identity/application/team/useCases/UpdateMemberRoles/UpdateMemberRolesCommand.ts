import type { MemberRole } from "@/identity/domain/team/valueObjects/MemberRole";

/** Input contract for updating a team member's complete role set. */
export interface UpdateMemberRolesCommand {
  readonly companyId: string;
  readonly memberId: string;
  readonly requestedRoles: readonly MemberRole[];
}
