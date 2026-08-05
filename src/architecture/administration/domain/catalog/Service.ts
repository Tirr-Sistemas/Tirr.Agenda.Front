/**
 * @description Propriedades persistidas de um serviço administrativo.
 */
export interface ServiceProperties { readonly id: string; readonly businessId: string; readonly categoryId: string; readonly name: string; readonly durationInMinutes: number; readonly price: number; readonly isActive: boolean; }
/**
 * @description Serviço do catálogo que protege nome, duração e preço válidos.
 */
export class Service {
  /**
   * @description Cria o serviço e valida seus dados obrigatórios e valores comerciais.
   *
   * @param properties - Valor de properties utilizado pela operação.
   * @throws Repassa a falha quando a regra ou dependência necessária não puder concluir a operação.
   */
  public constructor(readonly properties: ServiceProperties) { if (!properties.name.trim()) throw new Error("O nome do serviço é obrigatório."); if (properties.durationInMinutes <= 0) throw new Error("A duração deve ser maior que zero."); if (properties.price < 0) throw new Error("O preço não pode ser negativo."); }
}
