/**
 * @description Estados possíveis de um estabelecimento.
 */
export type BusinessStatus = "active" | "suspended" | "inactive";
/**
 * @description Propriedades necessárias para reconstruir a entidade de estabelecimento.
 */
export interface BusinessProperties { readonly id: string; readonly name: string; readonly slug: string; readonly timeZone: string; readonly status: BusinessStatus; }
/**
 * @description Entidade raiz que normaliza o slug e protege os dados obrigatórios da empresa.
 */
export class Business {
  public readonly id: string; public readonly name: string; public readonly slug: string; public readonly timeZone: string; public readonly status: BusinessStatus;
  /**
   * @description Cria o estabelecimento e valida seus dados essenciais.
   *
   * @param properties - Valor de properties utilizado pela operação.
   * @throws Repassa a falha quando a regra ou dependência necessária não puder concluir a operação.
   */
  public constructor(properties: BusinessProperties) { const slug = properties.slug.trim().toLowerCase(); if (!properties.name.trim()) throw new Error("O nome da empresa é obrigatório."); if (!slug || /\s/.test(slug)) throw new Error("O slug deve estar em minúsculas e sem espaços."); if (!properties.timeZone.trim()) throw new Error("O fuso horário é obrigatório."); this.id = properties.id; this.name = properties.name.trim(); this.slug = slug; this.timeZone = properties.timeZone; this.status = properties.status; }
}
