import { normalizeMemberRoles, type MemberRole } from "../valueObjects/MemberRole";

/** Estado necessário para reconstruir um membro da equipe. */
export interface TeamMemberProperties { readonly id: string; readonly roles: readonly MemberRole[]; }

/** Representa um membro da empresa e protege as invariantes dos seus papéis. */
export class TeamMember {
  readonly #id: string;
  #roles: readonly MemberRole[];
  public constructor(properties: TeamMemberProperties) { this.#id = properties.id; this.#roles = normalizeMemberRoles(properties.roles); }
  public get id(): string { return this.#id; }
  public get roles(): readonly MemberRole[] { return this.#roles; }
  public hasRole(role: MemberRole): boolean { return this.#roles.includes(role); }
  public replaceRoles(roles: readonly MemberRole[]): void { this.#roles = normalizeMemberRoles(roles); }
}
