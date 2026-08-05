import type { PublicBookingGateway } from "../../ports/PublicBookingGateway";
import type { ResolvePublicBusinessCommand } from "./ResolvePublicBusinessCommand";
import type { ResolvePublicBusinessResult } from "./ResolvePublicBusinessResult";
export class ResolvePublicBusinessUseCase { public constructor(private readonly gateway: PublicBookingGateway) {} public execute(command: ResolvePublicBusinessCommand): Promise<ResolvePublicBusinessResult> { return command.type === "slug" ? this.gateway.getBusinessBySlug(command.slug) : this.gateway.getBusiness(command.businessId); } }
