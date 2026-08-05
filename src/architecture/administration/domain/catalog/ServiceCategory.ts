/**
 * @description Categoria de catálogo com nome obrigatório.
 */
export class ServiceCategory {
  /**
   * @description Cria uma categoria de serviço com nome e estado de ativação válidos.
   *
   * @param id - Identificador do registro alvo.
   * @param name - Nome associado ao registro.
   * @param isActive - Valor de is active utilizado pela operação.
   * @throws Repassa a falha quando a regra ou dependência necessária não puder concluir a operação.
   */
  public constructor(readonly id: string, readonly name: string, readonly isActive: boolean) { if (!name.trim()) throw new Error("O nome da categoria é obrigatório."); }
}
