import type { PublicBookingGateway } from "../../ports/PublicBookingGateway"; import type { ListAvailableTimeSlotsCommand } from "./ListAvailableTimeSlotsCommand"; import type { ListAvailableTimeSlotsResult } from "./ListAvailableTimeSlotsResult";
/** Consulta os horários livres de um profissional para um serviço e uma data. */
export class ListAvailableTimeSlotsUseCase { public constructor(private readonly gateway: PublicBookingGateway) {} public execute(command: ListAvailableTimeSlotsCommand): Promise<ListAvailableTimeSlotsResult> { return this.gateway.listAvailableSlots(command); } }
