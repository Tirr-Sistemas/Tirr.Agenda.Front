/** Immutable time range used by availability rules and exceptions. */
export class TimeRange {
  public constructor(readonly start: string, readonly end: string) {
    if (!/^\d{2}:\d{2}(:\d{2})?$/.test(start) || !/^\d{2}:\d{2}(:\d{2})?$/.test(end) || start >= end) {
      throw new Error("O horário final deve ser posterior ao horário inicial.");
    }
  }
}
