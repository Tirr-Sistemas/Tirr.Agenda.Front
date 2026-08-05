import { validateAvailabilityException } from "./policies/AvailabilityExceptionPolicy";

/**
 * @description Classificações aceitas para uma exceção de disponibilidade.
 */
export type AvailabilityExceptionType = "Unavailable" | "ExtraAvailability";

/**
 * @description Representa uma alteração pontual na agenda recorrente de um profissional.
 *
 * Garante que disponibilidades extras tenham um intervalo completo.
 */
export class AvailabilityException {
  /**
   * @description Cria uma exceção e valida a coerência do intervalo conforme seu tipo.
   *
   * @param professionalId - Identificador do profissional afetado.
   * @param date - Data na qual a exceção será aplicada.
   * @param type - Tipo de bloqueio ou disponibilidade adicional.
   * @param start - Horário inicial quando houver um intervalo específico.
   * @param end - Horário final quando houver um intervalo específico.
   * @throws Quando uma disponibilidade extra não possuir um intervalo válido.
   */
  public constructor(
    readonly professionalId: string,
    readonly date: string,
    readonly type: AvailabilityExceptionType,
    readonly start: string | null,
    readonly end: string | null,
  ) {
    if (type === "ExtraAvailability" && validateAvailabilityException(start, end) === null) {
      throw new Error("Disponibilidade extra exige um intervalo.");
    }
    if (type === "Unavailable") validateAvailabilityException(start, end);
  }
}
