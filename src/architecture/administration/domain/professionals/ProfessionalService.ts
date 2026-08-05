/**
 * @description Configuração personalizada de um serviço para determinado profissional.
 */
export interface ProfessionalServiceProperties {
  readonly professionalId: string;
  readonly serviceId: string;
  readonly durationInMinutes: number | null;
  readonly price: number | null;
}

/**
 * @description Vínculo que protege substituições válidas de duração e preço.
 */
export class ProfessionalService {
  /**
   * @description Cria um vínculo e valida as substituições específicas do profissional.
   *
   * @param properties - Configuração do serviço para o profissional.
   * @throws Quando a duração não for positiva ou o preço for negativo.
   */
  public constructor(readonly properties: ProfessionalServiceProperties) {
    if (properties.durationInMinutes !== null && properties.durationInMinutes <= 0) {
      throw new Error("A duração personalizada deve ser maior que zero.");
    }
    if (properties.price !== null && properties.price < 0) {
      throw new Error("O preço personalizado não pode ser negativo.");
    }
  }
}
