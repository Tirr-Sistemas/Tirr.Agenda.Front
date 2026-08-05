/** Propriedades persistidas de um cliente administrativo. */
export interface CustomerProperties { readonly id: string; readonly businessId: string; readonly fullName: string; readonly phone: string; readonly email: string; readonly isActive: boolean; }
/** Cliente que normaliza os dados e protege os contatos obrigatórios. */
export class Customer { public readonly properties: CustomerProperties; public constructor(properties: CustomerProperties) { if (!properties.fullName.trim() || !properties.phone.trim() || !properties.email.trim()) throw new Error("Nome, telefone e e-mail são obrigatórios."); this.properties = { ...properties, fullName: properties.fullName.trim(), email: properties.email.trim().toLowerCase() }; } }
