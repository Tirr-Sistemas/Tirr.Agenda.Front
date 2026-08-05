import type { PublicBookingGateway } from "../../ports/PublicBookingGateway";
import type { ListBookableServicesCommand } from "./ListBookableServicesCommand";
import type { ListBookableServicesResult } from "./ListBookableServicesResult";

/**
 * @description Lista os serviços que podem receber reservas públicas.
 */
export class ListBookableServicesUseCase {
  /**
   * @description Cria o caso de uso com a porta de acesso ao agendamento público.
   *
   * @param gateway - Porta usada para consultar serviços agendáveis.
   */
  public constructor(private readonly gateway: PublicBookingGateway) {}

  /**
   * @description Lista os serviços ativos que podem ser escolhidos no agendamento público.
   *
   * @param command - Contrato que identifica o estabelecimento consultado.
   * @returns Promessa com os serviços disponíveis para agendamento.
   */
  public execute(command: ListBookableServicesCommand): Promise<ListBookableServicesResult> {
    return this.gateway.listServices(command.businessId);
  }
}
