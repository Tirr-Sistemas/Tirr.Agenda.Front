import type { AdministrationGateway } from "../../ports/AdministrationGateway";
import type { AdministrationCommand } from "./AdministrationCommand";
import type { AdministrationResult } from "./AdministrationResult";

/** Executes administrative operations through the application gateway contract. */
export class AdministrationUseCase {
  public constructor(private readonly gateway: AdministrationGateway) {}

  public async execute<TResult>(command: AdministrationCommand<TResult>): Promise<AdministrationResult<TResult>> {
    return await command.execute(this.gateway);
  }

  /** @deprecated Prefer execute(command) for newly migrated controllers. */
  public get appointments() { return this.gateway.appointments; }
  /** @deprecated Prefer execute(command) for newly migrated controllers. */
  public get availability() { return this.gateway.availability; }
  /** @deprecated Prefer execute(command) for newly migrated controllers. */
  public get categories() { return this.gateway.categories; }
  /** @deprecated Prefer execute(command) for newly migrated controllers. */
  public get customers() { return this.gateway.customers; }
  /** @deprecated Prefer execute(command) for newly migrated controllers. */
  public get overview() { return this.gateway.overview; }
  /** @deprecated Prefer execute(command) for newly migrated controllers. */
  public get professionals() { return this.gateway.professionals; }
  /** @deprecated Prefer execute(command) for newly migrated controllers. */
  public get services() { return this.gateway.services; }
}
