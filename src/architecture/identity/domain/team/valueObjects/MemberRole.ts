/** Papéis válidos para um membro do estabelecimento. */
export const memberRoleValues = ["Owner", "Administrator", "Receptionist", "Professional"] as const;
/** Papel administrativo derivado da lista canônica de valores. */
export type MemberRole = (typeof memberRoleValues)[number];

/** Normalizes a member's roles and protects the non-empty roles invariant. */
export function normalizeMemberRoles(roles: readonly MemberRole[]): readonly MemberRole[] {
  const normalizedRoles = [...new Set(roles)];
  if (normalizedRoles.length === 0) throw new Error("O membro deve possuir pelo menos um papel.");
  return normalizedRoles;
}

/**
 * Verifica se um texto representa um papel de membro suportado.
 *
 * @param {string} value - Valor recebido de uma fonte externa.
 * @returns {boolean} Verdadeiro quando o valor pertence à lista canônica.
 */
export function isMemberRole(value: string): value is MemberRole {
  return memberRoleValues.includes(value as MemberRole);
}
