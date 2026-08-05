export const memberRoleValues = ["Owner", "Administrator", "Receptionist", "Professional"] as const;
export type MemberRole = (typeof memberRoleValues)[number];

/** Normalizes a member's roles and protects the non-empty roles invariant. */
export function normalizeMemberRoles(roles: readonly MemberRole[]): readonly MemberRole[] {
  const normalizedRoles = [...new Set(roles)];
  if (normalizedRoles.length === 0) throw new Error("O membro deve possuir pelo menos um papel.");
  return normalizedRoles;
}

export function isMemberRole(value: string): value is MemberRole {
  return memberRoleValues.includes(value as MemberRole);
}
