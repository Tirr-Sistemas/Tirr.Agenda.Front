import type { PublicBookingGateway } from "../../ports/PublicBookingGateway"; import type { ListAvailableDatesCommand } from "./ListAvailableDatesCommand"; import type { ListAvailableDatesResult } from "./ListAvailableDatesResult";
/** Lista datas disponíveis para uma combinação de profissional e serviço. */
export class ListAvailableDatesUseCase { public constructor(private readonly gateway: PublicBookingGateway) {} public execute(command: ListAvailableDatesCommand): Promise<ListAvailableDatesResult> { return this.gateway.listAvailableDates(command); } }
