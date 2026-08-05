import { validateAppointmentStatusTransition } from "./AppointmentStatusPolicy";
describe("appointment lifecycle", () => { it("requires a cancellation reason", () => expect(() => validateAppointmentStatusTransition("pending", "cancelled")).toThrow()); it("prevents changes after completion", () => expect(() => validateAppointmentStatusTransition("completed", "confirmed")).toThrow()); });
