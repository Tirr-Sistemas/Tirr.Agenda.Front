/**
 * @description Raised when an update would leave a company without an Owner.
 */
export class LastOwnerRemovalError extends Error {
  /**
   * @description Cria o erro que sinaliza a tentativa de remover o último proprietário.
   */
  public constructor() { super("A empresa deve possuir ao menos um proprietário."); this.name = "LastOwnerRemovalError"; }
}
