import type { PublicBookingGateway } from "../../ports/PublicBookingGateway";
import type { ListServiceProfessionalsCommand } from "./ListServiceProfessionalsCommand";
import type { ListServiceProfessionalsResult } from "./ListServiceProfessionalsResult";

/**
 * @description Lista profissionais disponíveis para executar determinado serviço.
 */
export class ListServiceProfessionalsUseCase {
  /**
   * @description Cria o caso de uso com a porta de acesso ao agendamento público.
   *
   * @param gateway - Porta usada para consultar profissionais disponíveis.
   */
  public constructor(private readonly gateway: PublicBookingGateway) {}

  /**
   * @description Lista os profissionais habilitados para atender o serviço selecionado.
   *
   * @param command - Contrato que identifica o estabelecimento e o serviço.
   * @returns Promessa com os profissionais disponíveis para o serviço.
   */
  public execute(command: ListServiceProfessionalsCommand): Promise<ListServiceProfessionalsResult> {
    return this.gateway.listProfessionals(command.businessId, command.serviceId);
  }
}
