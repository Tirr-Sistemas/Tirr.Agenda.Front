/** Lista canônica dos estados de um agendamento. */
export const appointmentStatuses = ["pending", "confirmed", "cancelled", "completed", "noShow"] as const;
/** Estado válido derivado da lista canônica. */
export type AppointmentStatus = (typeof appointmentStatuses)[number];
const terminalStatuses: readonly AppointmentStatus[] = ["cancelled", "completed", "noShow"];
/** Estado necessário para reconstruir o agregado de agendamento. */
export interface AppointmentProperties { readonly id: string; readonly businessId: string; readonly professionalId: string; readonly serviceId: string; readonly customerName: string; readonly customerPhone: string; readonly startsAtUtc: string; readonly endsAtUtc: string; readonly price: number; readonly status: AppointmentStatus; }
/** Agregado que protege o período, o preço e o ciclo de vida do agendamento. */
export class Appointment {
  public constructor(readonly properties: AppointmentProperties) { if (new Date(properties.startsAtUtc).getTime() >= new Date(properties.endsAtUtc).getTime()) throw new Error("O período do agendamento é inválido."); if (properties.price < 0) throw new Error("O preço não pode ser negativo."); }
  public ensureMutable(): void { if (terminalStatuses.includes(this.properties.status)) throw new Error("O agendamento finalizado não pode mais ser alterado."); }
}
