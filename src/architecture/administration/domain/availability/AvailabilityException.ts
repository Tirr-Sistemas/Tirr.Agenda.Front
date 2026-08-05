import { validateAvailabilityException } from "./policies/AvailabilityExceptionPolicy";
/** Classificações aceitas para uma exceção de disponibilidade. */
export type AvailabilityExceptionType = "Unavailable" | "ExtraAvailability";
/**
 * Representa uma alteração pontual na agenda recorrente de um profissional.
 *
 * Garante que disponibilidades extras tenham um intervalo completo.
 */
export class AvailabilityException { public constructor(readonly professionalId: string, readonly date: string, readonly type: AvailabilityExceptionType, readonly start: string | null, readonly end: string | null) { if (type === "ExtraAvailability" && validateAvailabilityException(start, end) === null) throw new Error("Disponibilidade extra exige um intervalo."); if (type === "Unavailable") validateAvailabilityException(start, end); } }
