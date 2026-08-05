/**
 * @description Base error for framework-independent business rule violations.
 */
export abstract class DomainError extends Error {
  /**
   * @description Cria um erro de domínio com a mensagem informada.
   *
   * @param message - Valor de message utilizado pela operação.
   */
  protected constructor(message: string) { super(message); this.name = new.target.name; }
}
