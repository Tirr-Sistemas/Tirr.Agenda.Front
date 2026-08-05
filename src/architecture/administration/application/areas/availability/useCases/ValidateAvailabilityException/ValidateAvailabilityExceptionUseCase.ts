import { validateAvailabilityException } from "@/administration/domain/availability/policies/AvailabilityExceptionPolicy";
import type { ValidateAvailabilityExceptionCommand } from "./ValidateAvailabilityExceptionCommand";
import type { ValidateAvailabilityExceptionResult } from "./ValidateAvailabilityExceptionResult";

/**
 * @description Validates availability input before an adapter persists it.
 */
export class ValidateAvailabilityExceptionUseCase {
  /**
   * @description Valida uma exceção de disponibilidade conforme as regras do domínio administrativo.
   *
   * @param input - Dados necessários para executar a operação.
   */
  public execute(input: ValidateAvailabilityExceptionCommand): ValidateAvailabilityExceptionResult {
    validateAvailabilityException(input.startTime, input.endTime);
  }
}
