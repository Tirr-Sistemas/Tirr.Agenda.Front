export interface ServiceProperties { readonly id: string; readonly businessId: string; readonly categoryId: string; readonly name: string; readonly durationInMinutes: number; readonly price: number; readonly isActive: boolean; }
export class Service {
  public constructor(readonly properties: ServiceProperties) { if (!properties.name.trim()) throw new Error("O nome do serviço é obrigatório."); if (properties.durationInMinutes <= 0) throw new Error("A duração deve ser maior que zero."); if (properties.price < 0) throw new Error("O preço não pode ser negativo."); }
}
