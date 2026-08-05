import { TimeRange } from "./valueObjects/TimeRange";
export class AvailabilityRule { public readonly range: TimeRange; public constructor(readonly professionalId: string, readonly dayOfWeek: number, start: string, end: string, readonly isActive: boolean) { if (dayOfWeek < 0 || dayOfWeek > 6) throw new Error("Dia da semana inválido."); this.range = new TimeRange(start, end); } }
