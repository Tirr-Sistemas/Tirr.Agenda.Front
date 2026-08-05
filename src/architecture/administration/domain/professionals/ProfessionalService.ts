/** Configuração personalizada de um serviço para determinado profissional. */
export interface ProfessionalServiceProperties { readonly professionalId: string; readonly serviceId: string; readonly durationInMinutes: number | null; readonly price: number | null; }
/** Vínculo que protege substituições válidas de duração e preço. */
export class ProfessionalService { public constructor(readonly properties: ProfessionalServiceProperties) { if (properties.durationInMinutes !== null && properties.durationInMinutes <= 0) throw new Error("A duração personalizada deve ser maior que zero."); if (properties.price !== null && properties.price < 0) throw new Error("O preço personalizado não pode ser negativo."); } }
