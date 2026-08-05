import type { PublicBookingGateway } from "../../ports/PublicBookingGateway";
import type { CreatePublicBookingCommand } from "./CreatePublicBookingCommand";
import type { CreatePublicBookingResult } from "./CreatePublicBookingResult";

/** Creates a public booking; slot conflict decisions stay outside React. */
export class CreatePublicBookingUseCase {
  public constructor(private readonly bookings: PublicBookingGateway) {}
  public execute(input: CreatePublicBookingCommand): Promise<CreatePublicBookingResult> {
    if (!input.customerFullName.trim() || !input.customerEmail.trim() || !input.customerPhone.trim()) throw new Error("Nome, telefone e e-mail do cliente são obrigatórios.");
    if (!input.startsAtUtc.endsWith("Z") || new Date(input.startsAtUtc).getTime() <= Date.now()) throw new Error("O agendamento deve usar uma data UTC futura.");
    return this.bookings.create({ ...input, customerFullName: input.customerFullName.trim(), customerEmail: input.customerEmail.trim().toLowerCase() });
  }
}
