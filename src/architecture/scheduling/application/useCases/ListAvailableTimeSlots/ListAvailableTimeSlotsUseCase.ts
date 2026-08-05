import type { PublicBookingGateway } from "../../ports/PublicBookingGateway";
import type { ListAvailableTimeSlotsCommand } from "./ListAvailableTimeSlotsCommand";
import type { ListAvailableTimeSlotsResult } from "./ListAvailableTimeSlotsResult";

/**
 * @description Consulta os horários livres de um profissional para um serviço e uma data.
 */
export class ListAvailableTimeSlotsUseCase {
  /**
   * @description Cria o caso de uso com a porta de acesso ao agendamento público.
   *
   * @param gateway - Porta usada para consultar horários disponíveis.
   */
  public constructor(private readonly gateway: PublicBookingGateway) {}

  /**
   * @description Lista os horários disponíveis para a data, o serviço e o profissional informados.
   *
   * @param command - Contrato com a combinação de agenda que será consultada.
   * @returns Promessa com os horários livres para agendamento.
   */
  public execute(command: ListAvailableTimeSlotsCommand): Promise<ListAvailableTimeSlotsResult> {
    return this.gateway.listAvailableSlots(command);
  }
}
