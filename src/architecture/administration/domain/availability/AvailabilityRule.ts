import { TimeRange } from "./valueObjects/TimeRange";

/**
 * @description Regra semanal que valida o dia e o intervalo de atendimento do profissional.
 */
export class AvailabilityRule {
  public readonly range: TimeRange;

  /**
   * @description Cria uma regra recorrente com dia da semana e intervalo válidos.
   *
   * @param professionalId - Identificador do profissional proprietário da regra.
   * @param dayOfWeek - Dia da semana entre zero e seis.
   * @param start - Horário inicial do atendimento.
   * @param end - Horário final do atendimento.
   * @param isActive - Indica se a regra está ativa.
   * @throws Quando o dia da semana ou o intervalo informado for inválido.
   */
  public constructor(
    readonly professionalId: string,
    readonly dayOfWeek: number,
    start: string,
    end: string,
    readonly isActive: boolean,
  ) {
    if (dayOfWeek < 0 || dayOfWeek > 6) throw new Error("Dia da semana inválido.");
    this.range = new TimeRange(start, end);
  }
}
