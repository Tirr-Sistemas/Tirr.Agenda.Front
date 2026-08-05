/** Signals that the requested slot is no longer available. */
export class BookingConflictError extends Error {
  public constructor() { super("O horário selecionado não está mais disponível."); this.name = "BookingConflictError"; }
}
