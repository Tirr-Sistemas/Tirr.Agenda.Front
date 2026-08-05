import type { PublicBookingGateway } from "../../ports/PublicBookingGateway"; import type { ListBookableServicesCommand } from "./ListBookableServicesCommand"; import type { ListBookableServicesResult } from "./ListBookableServicesResult";
/** Lista os serviços que podem receber reservas públicas. */
export class ListBookableServicesUseCase { public constructor(private readonly gateway: PublicBookingGateway) {} public execute(command: ListBookableServicesCommand): Promise<ListBookableServicesResult> { return this.gateway.listServices(command.businessId); } }
