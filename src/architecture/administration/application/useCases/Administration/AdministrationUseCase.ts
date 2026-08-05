import type { AdministrationGateway } from "../../ports/AdministrationGateway";
import type { AdministrationCommand } from "./AdministrationCommand";
import type { AdministrationResult } from "./AdministrationResult";

/**
 * @description Executes administrative operations through the application gateway contract.
 */
export class AdministrationUseCase {
  /**
   * @description Cria a fachada administrativa com o gateway de operações.
   *
   * @param gateway - Valor de gateway utilizado pela operação.
   */
  public constructor(private readonly gateway: AdministrationGateway) { }

  /**
   * @description Executa o caso de uso administration conforme o contrato de entrada.
   *
   * @param command - Contrato de entrada que identifica e parametriza a operação.
   * @returns Promessa resolvida com o resultado da operação.
   */
  public async execute<TResult>(command: AdministrationCommand<TResult>): Promise<AdministrationResult<TResult>> {
    return await command.execute(this.gateway);
  }

  /**
   * @description Mantém compatibilidade temporária durante a migração arquitetural.
   *
   *  @deprecated Prefer execute(command) for newly migrated controllers.
   *
   * @returns Promessa resolvida com o resultado da operação.
   */
  public get appointments() { return this.gateway.appointments; }
  /**
   * @description Mantém compatibilidade temporária durante a migração arquitetural.
   *
   *  @deprecated Prefer execute(command) for newly migrated controllers.
   *
   * @returns Promessa resolvida com o resultado da operação.
   */
  public get availability() { return this.gateway.availability; }
  /**
   * @description Mantém compatibilidade temporária durante a migração arquitetural.
   *
   *  @deprecated Prefer execute(command) for newly migrated controllers.
   *
   * @returns Promessa resolvida com o resultado da operação.
   */
  public get categories() { return this.gateway.categories; }
  /**
   * @description Mantém compatibilidade temporária durante a migração arquitetural.
   *
   *  @deprecated Prefer execute(command) for newly migrated controllers.
   *
   * @returns Promessa resolvida com o resultado da operação.
   */
  public get customers() { return this.gateway.customers; }
  /**
   * @description Mantém compatibilidade temporária durante a migração arquitetural.
   *
   *  @deprecated Prefer execute(command) for newly migrated controllers.
   *
   * @returns Promessa resolvida com o resultado da operação.
   */
  public get overview() { return this.gateway.overview; }
  /**
   * @description Mantém compatibilidade temporária durante a migração arquitetural.
   *
   *  @deprecated Prefer execute(command) for newly migrated controllers.
   *
   * @returns Promessa resolvida com o resultado da operação.
   */
  public get professionals() { return this.gateway.professionals; }
  /**
   * @description Mantém compatibilidade temporária durante a migração arquitetural.
   *
   *  @deprecated Prefer execute(command) for newly migrated controllers.
   *
   * @returns Promessa resolvida com o resultado da operação.
   */
  public get services() { return this.gateway.services; }
}
