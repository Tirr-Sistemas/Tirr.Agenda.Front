/**
 * @description Papéis válidos para um membro do estabelecimento.
 */
export const memberRoleValues = ["Owner", "Administrator", "Receptionist", "Professional"] as const;
/**
 * @description Papel administrativo derivado da lista canônica de valores.
 */
export type MemberRole = (typeof memberRoleValues)[number];

/**
 * @description Normalizes a member's roles and protects the non-empty roles invariant.
 *
 * @param roles - Valor de roles utilizado pela operação.
 * @returns Coleção resultante da operação.
 * @throws Repassa a falha quando a regra ou dependência necessária não puder concluir a operação.
 */
export function normalizeMemberRoles(roles: readonly MemberRole[]): readonly MemberRole[] {
  const normalizedRoles = [...new Set(roles)];
  if (normalizedRoles.length === 0) throw new Error("O membro deve possuir pelo menos um papel.");
  return normalizedRoles;
}

/**
 * @description Verifica se um texto representa um papel de membro suportado.
 *
 * @param value - Valor recebido de uma fonte externa.
 * @returns Verdadeiro quando o valor pertence à lista canônica.
 */
export function isMemberRole(value: string): value is MemberRole {
  return memberRoleValues.includes(value as MemberRole);
}
