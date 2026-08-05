/** Propriedades persistidas de um profissional. */
export interface ProfessionalProperties { readonly id: string; readonly businessId: string; readonly membershipId: string | null; readonly displayName: string; readonly isActive: boolean; }
/** Profissional administrativo com nome de exibição obrigatório. */
export class Professional { public constructor(readonly properties: ProfessionalProperties) { if (!properties.displayName.trim()) throw new Error("O nome do profissional é obrigatório."); } }
