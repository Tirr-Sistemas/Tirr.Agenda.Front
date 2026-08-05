/**
 * @description Immutable time range used by availability rules and exceptions.
 */
export class TimeRange {
  /**
   * @description Cria um intervalo e garante que o horário final seja posterior ao inicial.
   *
   * @param start - Valor de start utilizado pela operação.
   * @param end - Valor de end utilizado pela operação.
   * @throws Repassa a falha quando a regra ou dependência necessária não puder concluir a operação.
   */
  public constructor(readonly start: string, readonly end: string) {
    if (!/^\d{2}:\d{2}(:\d{2})?$/.test(start) || !/^\d{2}:\d{2}(:\d{2})?$/.test(end) || start >= end) {
      throw new Error("O horário final deve ser posterior ao horário inicial.");
    }
  }
}
