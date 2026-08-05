import type { AppointmentStatus } from "./Appointment";
const transitions: Readonly<Record<AppointmentStatus, readonly AppointmentStatus[]>> = { pending: ["confirmed", "cancelled", "noShow"], confirmed: ["completed", "cancelled", "noShow"], cancelled: [], completed: [], noShow: [] };
/**
 * @description Valida uma transição de status e exige justificativa em cancelamentos.
 *
 * @param current - Estado atual do agendamento.
 * @param requested - Próximo estado solicitado.
 * @param cancellationReason - Motivo obrigatório quando houver cancelamento.
 * @returns Sem valor de retorno.
 * @throws Quando a transição não é permitida ou o motivo está ausente.
 */
export function validateAppointmentStatusTransition(current: AppointmentStatus, requested: AppointmentStatus, cancellationReason?: string): void { if (!transitions[current].includes(requested)) throw new Error("Transição de status inválida."); if (requested === "cancelled" && !cancellationReason?.trim()) throw new Error("O cancelamento exige um motivo."); }
