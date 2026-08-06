import { BookingConflictError } from "../../errors/BookingConflictError";
import type { PublicBookingGateway } from "../../ports/PublicBookingGateway";
import { CreatePublicBookingUseCase } from "./CreatePublicBookingUseCase";

const input = { businessId: "business", professionalId: "professional", serviceId: "service", customerFullName: "Ana", customerPhone: "11999999999", customerEmail: "ana@example.com", startsAtUtc: "2099-08-05T12:00:00Z" };

describe("CreatePublicBookingUseCase", () => {
  it("does not translate a slot conflict into a presentation concern", async () => {
    const gateway: Pick<PublicBookingGateway, "create"> = { create: async () => { throw new BookingConflictError(); } };
    await expect(new CreatePublicBookingUseCase(gateway as PublicBookingGateway).execute(input)).rejects.toBeInstanceOf(BookingConflictError);
  });

  it("accepts the UTC offset returned by the API and sends the canonical UTC format", async () => {
    const create = vi.fn(async (command) => ({
      appointmentId: "appointment",
      customerId: "customer",
      startsAtUtc: command.startsAtUtc,
      endsAtUtc: "2099-08-05T12:30:00Z",
      price: 50,
      status: "Scheduled",
    }));
    const gateway: Pick<PublicBookingGateway, "create"> = { create };

    await new CreatePublicBookingUseCase(gateway as PublicBookingGateway).execute({
      ...input,
      startsAtUtc: "2099-08-05T12:00:00+00:00",
    });

    expect(create).toHaveBeenCalledWith(expect.objectContaining({
      startsAtUtc: "2099-08-05T12:00:00.000Z",
    }));
  });

  it("rejects a future date without an explicit UTC offset", async () => {
    const gateway: Pick<PublicBookingGateway, "create"> = { create: vi.fn() };

    expect(() => new CreatePublicBookingUseCase(gateway as PublicBookingGateway).execute({
      ...input,
      startsAtUtc: "2099-08-05T12:00:00",
    })).toThrow("O agendamento deve usar uma data UTC futura.");
  });
});
