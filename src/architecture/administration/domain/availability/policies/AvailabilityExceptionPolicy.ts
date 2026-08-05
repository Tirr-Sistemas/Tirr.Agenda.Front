import { TimeRange } from "../valueObjects/TimeRange";

/** Validates the invariant shared by full-day and partial availability exceptions. */
export function validateAvailabilityException(start: string | null, end: string | null): TimeRange | null {
  if ((start === null) !== (end === null)) throw new Error("Informe início e fim, ou deixe ambos vazios.");
  return start === null || end === null ? null : new TimeRange(start, end);
}
