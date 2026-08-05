import { validateAvailabilityException } from "./AvailabilityExceptionPolicy";

describe("validateAvailabilityException", () => {
  it("accepts an all-day exception", () => expect(validateAvailabilityException(null, null)).toBeNull());
  it("rejects a partial range", () => expect(() => validateAvailabilityException("09:00", null)).toThrow());
  it("rejects an inverted range", () => expect(() => validateAvailabilityException("18:00", "09:00")).toThrow());
});
