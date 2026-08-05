import { TimeRange } from "../valueObjects/TimeRange";

/**
 * @description Validates the invariant shared by full-day and partial availability exceptions.
 *
 * @param start - Valor de start utilizado pela operação.
 * @param end - Valor de end utilizado pela operação.
 * @returns Resultado produzido pela operação.
 * @throws Repassa a falha quando a regra ou dependência necessária não puder concluir a operação.
 */
export function validateAvailabilityException(start: string | null, end: string | null): TimeRange | null {
  if ((start === null) !== (end === null)) throw new Error("Informe início e fim, ou deixe ambos vazios.");
  return start === null || end === null ? null : new TimeRange(start, end);
}
