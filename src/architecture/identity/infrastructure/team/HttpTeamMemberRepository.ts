import type { TeamMemberRepository } from "@/identity/application/team/ports/TeamMemberRepository";
import { TeamMember } from "@/identity/domain/team/entities/TeamMember";
import { isMemberRole } from "@/identity/domain/team/valueObjects/MemberRole";
import type { AxiosInstance } from "axios";

type MemberResponse = { identityUserId: string; roles: string[]; };
/**
 * @description Converte o DTO recebido da API em uma entidade de membro da equipe.
 *
 * @param value - Valor que será processado.
 * @returns Resultado produzido pela operação.
 * @throws Repassa a falha quando a regra ou dependência necessária não puder concluir a operação.
 */
function parseMember(value: unknown): TeamMember {
  if (!value || typeof value !== "object") throw new Error("Resposta de membro inválida.");
  const item = value as Partial<MemberResponse>;
  if (typeof item.identityUserId !== "string" || !Array.isArray(item.roles) || !item.roles.every((role) => typeof role === "string" && isMemberRole(role))) throw new Error("Resposta de membro inválida.");
  return new TeamMember({ id: item.identityUserId, roles: item.roles });
}

/**
 * @description Repositório HTTP que valida respostas externas antes de criar entidades de equipe.
 */
export class HttpTeamMemberRepository implements TeamMemberRepository {
  /**
   * @description Cria o repositório de membros com o cliente HTTP configurado.
   *
   * @param http - Valor de http utilizado pela operação.
   */
  public constructor(private readonly http: AxiosInstance) { }
  /**
   * @description Localiza by id conforme os critérios recebidos.
   *
   * @param companyId - Valor de company id utilizado pela operação.
   * @param memberId - Identificador do membro da equipe.
   * @returns Promessa resolvida com o resultado da operação.
   */
  public async findById(companyId: string, memberId: string): Promise<TeamMember | null> { return (await this.list(companyId)).find((member) => member.id === memberId) ?? null; }
  /**
   * @description Extrai uma coleção de uma resposta desconhecida, usando uma lista vazia quando necessário.
   *
   * @param companyId - Valor de company id utilizado pela operação.
   * @returns Promessa resolvida com o resultado da operação.
   * @throws Repassa a falha quando a regra ou dependência necessária não puder concluir a operação.
   */
  public async list(companyId: string): Promise<readonly TeamMember[]> {
    const response = await this.http.get<unknown>(`/businesses/${companyId}/members`);
    if (!response.data || typeof response.data !== "object" || !Array.isArray((response.data as { members?: unknown; }).members)) throw new Error("Resposta de membros inválida.");
    return (response.data as { members: unknown[]; }).members.map(parseMember);
  }
  /**
   * @description Executa a responsabilidade de save no contexto de http team member repository.
   *
   * @param companyId - Valor de company id utilizado pela opera??o.
   *
   * @param member - Valor de member utilizado pela opera??o.
   *
   * @returns Promessa resolvida com o resultado da opera??o.
   */
  public async save(companyId: string, member: TeamMember): Promise<void> { await this.http.put(`/businesses/${companyId}/members/${member.id}/roles`, { roles: member.roles }); }
}
