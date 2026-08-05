/**
 * @description Signals that the requested slot is no longer available.
 */
export class BookingConflictError extends Error {
  /**
   * @description Cria o erro que representa conflito de horário no agendamento.
   */
  public constructor() { super("O horário selecionado não está mais disponível."); this.name = "BookingConflictError"; }
}
