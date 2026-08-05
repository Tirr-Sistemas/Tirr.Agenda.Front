import { BookingConflictError } from "../../errors/BookingConflictError";
import type { PublicBookingGateway } from "../../ports/PublicBookingGateway";
import { CreatePublicBookingUseCase } from "./CreatePublicBookingUseCase";

const input = { businessId: "business", professionalId: "professional", serviceId: "service", customerFullName: "Ana", customerPhone: "11999999999", customerEmail: "ana@example.com", startsAtUtc: "2099-08-05T12:00:00Z" };

describe("CreatePublicBookingUseCase", () => {
  it("does not translate a slot conflict into a presentation concern", async () => {
    const gateway: Pick<PublicBookingGateway, "create"> = { create: async () => { throw new BookingConflictError(); } };
    await expect(new CreatePublicBookingUseCase(gateway as PublicBookingGateway).execute(input)).rejects.toBeInstanceOf(BookingConflictError);
  });
});
