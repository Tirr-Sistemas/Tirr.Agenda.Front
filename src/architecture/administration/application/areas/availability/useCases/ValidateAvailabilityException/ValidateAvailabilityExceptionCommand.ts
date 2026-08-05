/** Input contract for validating a full-day or partial availability exception. */
export interface ValidateAvailabilityExceptionCommand { readonly startTime: string | null; readonly endTime: string | null; }
