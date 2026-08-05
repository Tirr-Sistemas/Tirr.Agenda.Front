import type { PublicBookingGateway } from "../../ports/PublicBookingGateway";
import type { ResolvePublicBusinessCommand } from "./ResolvePublicBusinessCommand";
import type { ResolvePublicBusinessResult } from "./ResolvePublicBusinessResult";

/**
 * @description Resolve o estabelecimento público sem expor detalhes do transporte à interface.
 */
export class ResolvePublicBusinessUseCase {
  /**
   * @description Cria o caso de uso com a porta de acesso ao agendamento público.
   *
   * @param gateway - Porta usada para consultar estabelecimentos públicos.
   */
  public constructor(private readonly gateway: PublicBookingGateway) {}

  /**
   * @description Resolve o estabelecimento público por identificador ou slug para iniciar o agendamento.
   *
   * @param command - Contrato que informa o identificador ou slug pesquisado.
   * @returns Promessa com os dados públicos do estabelecimento.
   */
  public execute(command: ResolvePublicBusinessCommand): Promise<ResolvePublicBusinessResult> {
    return command.type === "slug"
      ? this.gateway.getBusinessBySlug(command.slug)
      : this.gateway.getBusiness(command.businessId);
  }
}
