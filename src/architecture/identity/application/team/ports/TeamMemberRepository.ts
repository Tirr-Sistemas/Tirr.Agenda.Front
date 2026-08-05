import type { TeamMember } from "@/identity/domain/team/entities/TeamMember";

/** Persistence contract used by team use cases. */
export interface TeamMemberRepository {
  findById(companyId: string, memberId: string): Promise<TeamMember | null>;
  list(companyId: string): Promise<readonly TeamMember[]>;
  save(companyId: string, member: TeamMember): Promise<void>;
}
