import { normalizeMemberRoles, type MemberRole } from "../valueObjects/MemberRole";

/**
 * @description Estado necessário para reconstruir um membro da equipe.
 */
export interface TeamMemberProperties { readonly id: string; readonly roles: readonly MemberRole[]; }

/**
 * @description Representa um membro da empresa e protege as invariantes dos seus papéis.
 */
export class TeamMember {
  readonly #id: string;
  #roles: readonly MemberRole[];
  /**
   * @description Cria um membro da equipe com papéis normalizados pelo domínio.
   *
   * @param properties - Valor de properties utilizado pela operação.
   */
  public constructor(properties: TeamMemberProperties) { this.#id = properties.id; this.#roles = normalizeMemberRoles(properties.roles); }
  /**
   * @description Executa a responsabilidade de id no contexto de team member.
   *
   * @returns Texto resultante da operação.
   */
  public get id(): string { return this.#id; }
  /**
   * @description Executa a responsabilidade de roles no contexto de team member.
   *
   * @returns Coleção resultante da operação.
   */
  public get roles(): readonly MemberRole[] { return this.#roles; }
  /**
   * @description Verifica se o membro possui o papel solicitado.
   *
   * @param role - Papel cuja associação será verificada.
   * @returns Verdadeiro quando a condição avaliada for atendida.
   */
  public hasRole(role: MemberRole): boolean { return this.#roles.includes(role); }
  /**
   * @description Substitui os papéis do membro respeitando as invariantes de autorização.
   *
   * @param roles - Papéis que devem ser atribuídos ao membro.
   */
  public replaceRoles(roles: readonly MemberRole[]): void { this.#roles = normalizeMemberRoles(roles); }
}
