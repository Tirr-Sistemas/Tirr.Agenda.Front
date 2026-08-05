export type BusinessStatus = "active" | "suspended" | "inactive";
export interface BusinessProperties { readonly id: string; readonly name: string; readonly slug: string; readonly timeZone: string; readonly status: BusinessStatus; }
export class Business {
  public readonly id: string; public readonly name: string; public readonly slug: string; public readonly timeZone: string; public readonly status: BusinessStatus;
  public constructor(properties: BusinessProperties) { const slug = properties.slug.trim().toLowerCase(); if (!properties.name.trim()) throw new Error("O nome da empresa é obrigatório."); if (!slug || /\s/.test(slug)) throw new Error("O slug deve estar em minúsculas e sem espaços."); if (!properties.timeZone.trim()) throw new Error("O fuso horário é obrigatório."); this.id = properties.id; this.name = properties.name.trim(); this.slug = slug; this.timeZone = properties.timeZone; this.status = properties.status; }
}
