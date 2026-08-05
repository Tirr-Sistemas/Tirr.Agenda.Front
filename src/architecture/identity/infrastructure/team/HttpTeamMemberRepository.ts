import type { TeamMemberRepository } from "@/identity/application/team/ports/TeamMemberRepository";
import { TeamMember } from "@/identity/domain/team/entities/TeamMember";
import { isMemberRole } from "@/identity/domain/team/valueObjects/MemberRole";
import type { AxiosInstance } from "axios";

type MemberResponse = { identityUserId: string; roles: string[] };
function parseMember(value: unknown): TeamMember {
  if (!value || typeof value !== "object") throw new Error("Resposta de membro inválida.");
  const item = value as Partial<MemberResponse>;
  if (typeof item.identityUserId !== "string" || !Array.isArray(item.roles) || !item.roles.every((role) => typeof role === "string" && isMemberRole(role))) throw new Error("Resposta de membro inválida.");
  return new TeamMember({ id: item.identityUserId, roles: item.roles });
}

/** HTTP implementation; untrusted responses are parsed before reaching the domain. */
export class HttpTeamMemberRepository implements TeamMemberRepository {
  public constructor(private readonly http: AxiosInstance) {}
  public async findById(companyId: string, memberId: string): Promise<TeamMember | null> { return (await this.list(companyId)).find((member) => member.id === memberId) ?? null; }
  public async list(companyId: string): Promise<readonly TeamMember[]> {
    const response = await this.http.get<unknown>(`/businesses/${companyId}/members`);
    if (!response.data || typeof response.data !== "object" || !Array.isArray((response.data as { members?: unknown }).members)) throw new Error("Resposta de membros inválida.");
    return (response.data as { members: unknown[] }).members.map(parseMember);
  }
  public async save(companyId: string, member: TeamMember): Promise<void> { await this.http.put(`/businesses/${companyId}/members/${member.id}/roles`, { roles: member.roles }); }
}
