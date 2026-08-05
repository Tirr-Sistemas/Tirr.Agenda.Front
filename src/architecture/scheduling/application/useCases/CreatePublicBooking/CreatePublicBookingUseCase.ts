import type { PublicBookingGateway } from "../../ports/PublicBookingGateway";
import type { CreatePublicBookingCommand } from "./CreatePublicBookingCommand";
import type { CreatePublicBookingResult } from "./CreatePublicBookingResult";

/**
 * @description Creates a public booking; slot conflict decisions stay outside React.
 */
export class CreatePublicBookingUseCase {
  /**
   * @description Cria o caso de uso com a porta de reservas públicas.
   *
   * @param bookings - Valor de bookings utilizado pela operação.
   */
  public constructor(private readonly bookings: PublicBookingGateway) { }
  /**
   * @description Cria um agendamento público e traduz conflitos da infraestrutura para o erro da aplicação.
   *
   * @param input - Dados necessários para executar a operação.
   * @returns Promessa resolvida com o resultado da operação.
   * @throws Repassa a falha quando a regra ou dependência necessária não puder concluir a operação.
   */
  public execute(input: CreatePublicBookingCommand): Promise<CreatePublicBookingResult> {
    if (!input.customerFullName.trim() || !input.customerEmail.trim() || !input.customerPhone.trim()) throw new Error("Nome, telefone e e-mail do cliente são obrigatórios.");
    if (!input.startsAtUtc.endsWith("Z") || new Date(input.startsAtUtc).getTime() <= Date.now()) throw new Error("O agendamento deve usar uma data UTC futura.");
    return this.bookings.create({ ...input, customerFullName: input.customerFullName.trim(), customerEmail: input.customerEmail.trim().toLowerCase() });
  }
}
