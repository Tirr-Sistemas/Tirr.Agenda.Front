import type { PublicBookingGateway } from "../../ports/PublicBookingGateway";
import type { ListAvailableDatesCommand } from "./ListAvailableDatesCommand";
import type { ListAvailableDatesResult } from "./ListAvailableDatesResult";

/**
 * @description Lista datas disponíveis para uma combinação de profissional e serviço.
 */
export class ListAvailableDatesUseCase {
  /**
   * @description Cria o caso de uso com a porta de acesso ao agendamento público.
   *
   * @param gateway - Porta usada para consultar a disponibilidade de datas.
   */
  public constructor(private readonly gateway: PublicBookingGateway) {}

  /**
   * @description Lista as datas disponíveis para o serviço e o profissional informados.
   *
   * @param command - Contrato com o estabelecimento, serviço, profissional e período.
   * @returns Promessa com as datas que possuem horários disponíveis.
   */
  public execute(command: ListAvailableDatesCommand): Promise<ListAvailableDatesResult> {
    return this.gateway.listAvailableDates(command);
  }
}
