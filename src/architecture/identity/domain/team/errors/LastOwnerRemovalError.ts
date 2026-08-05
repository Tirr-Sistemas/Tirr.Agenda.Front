/** Raised when an update would leave a company without an Owner. */
export class LastOwnerRemovalError extends Error {
  public constructor() { super("A empresa deve possuir ao menos um proprietário."); this.name = "LastOwnerRemovalError"; }
}
