/**
 * @description Propriedades persistidas de um profissional.
 */
export interface ProfessionalProperties {
  readonly id: string;
  readonly businessId: string;
  readonly membershipId: string | null;
  readonly displayName: string;
  readonly isActive: boolean;
}

/**
 * @description Profissional administrativo com nome de exibição obrigatório.
 */
export class Professional {
  /**
   * @description Cria um profissional após validar seu nome de exibição.
   *
   * @param properties - Dados persistidos do profissional.
   * @throws Quando o nome de exibição estiver vazio.
   */
  public constructor(readonly properties: ProfessionalProperties) {
    if (!properties.displayName.trim()) {
      throw new Error("O nome do profissional é obrigatório.");
    }
  }
}
