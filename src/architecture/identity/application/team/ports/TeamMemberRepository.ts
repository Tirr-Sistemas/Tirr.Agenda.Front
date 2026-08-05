import type { TeamMember } from "@/identity/domain/team/entities/TeamMember";

/**
 * @description Contrato de persistência utilizado pelos casos de uso de equipe.
 */
export interface TeamMemberRepository {
  findById(companyId: string, memberId: string): Promise<TeamMember | null>;
  list(companyId: string): Promise<readonly TeamMember[]>;
  save(companyId: string, member: TeamMember): Promise<void>;
}
