export interface ProfessionalProperties { readonly id: string; readonly businessId: string; readonly membershipId: string | null; readonly displayName: string; readonly isActive: boolean; }
export class Professional { public constructor(readonly properties: ProfessionalProperties) { if (!properties.displayName.trim()) throw new Error("O nome do profissional é obrigatório."); } }
