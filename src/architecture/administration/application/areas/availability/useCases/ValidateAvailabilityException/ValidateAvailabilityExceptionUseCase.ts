import { validateAvailabilityException } from "@/administration/domain/availability/policies/AvailabilityExceptionPolicy";
import type { ValidateAvailabilityExceptionCommand } from "./ValidateAvailabilityExceptionCommand";
import type { ValidateAvailabilityExceptionResult } from "./ValidateAvailabilityExceptionResult";

/** Validates availability input before an adapter persists it. */
export class ValidateAvailabilityExceptionUseCase {
  public execute(input: ValidateAvailabilityExceptionCommand): ValidateAvailabilityExceptionResult {
    validateAvailabilityException(input.startTime, input.endTime);
  }
}
