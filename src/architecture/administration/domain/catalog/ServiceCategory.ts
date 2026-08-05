export class ServiceCategory {
  public constructor(readonly id: string, readonly name: string, readonly isActive: boolean) { if (!name.trim()) throw new Error("O nome da categoria é obrigatório."); }
}
