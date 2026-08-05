/** Base error for framework-independent business rule violations. */
export abstract class DomainError extends Error {
  protected constructor(message: string) { super(message); this.name = new.target.name; }
}
