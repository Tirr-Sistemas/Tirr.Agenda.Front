import type { AdministrationGateway } from "../../ports/AdministrationGateway";

/**
 * @description Typed administrative operation supplied to the application boundary.
 */
export interface AdministrationCommand<TResult> {
  readonly execute: (gateway: AdministrationGateway) => TResult | Promise<TResult>;
}
