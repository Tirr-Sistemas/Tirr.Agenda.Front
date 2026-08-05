/**
 * @description Dados públicos e administrativos do estabelecimento ativo.
 */
export interface BusinessProfile { businessId: string; name: string; legalName: string | null; documentNumber: string | null; slug: string; timeZone: string; status: string; }
/**
 * @description Expediente configurado para um dia da semana.
 */
export interface OperatingHoursDay { dayOfWeek: string; isOperating: boolean; opensAt: string | null; closesAt: string | null; }
/**
 * @description Projeção resumida de cliente usada nas listagens administrativas.
 */
export interface CustomerSummary { customerId: string; fullName: string; phone: string; email: string | null; isActive: boolean; appointmentCount: number; lastServiceName: string | null; lastAppointmentAtUtc: string | null; }
/**
 * @description Dados completos de um cliente pertencente ao estabelecimento.
 */
export interface Customer { id: string; businessId: string; fullName: string; phone: string; email: string; isActive: boolean; }
/**
 * @description Projeção de serviço enriquecida com indicadores de utilização.
 */
export interface ServiceSummary { serviceId: string; serviceCategoryId: string; name: string; description: string | null; durationInMinutes: number; price: number; isActive: boolean; appointmentCount: number; lastAppointmentAtUtc: string | null; }
/**
 * @description Dados persistidos de um serviço do catálogo.
 */
export interface Service { id: string; businessId: string; serviceCategoryId: string; name: string; description: string | null; durationInMinutes: number; price: number; isActive: boolean; }
/**
 * @description Categoria usada para organizar serviços do catálogo.
 */
export interface ServiceCategory { id: string; businessId: string; name: string; description: string | null; isActive: boolean; }
/**
 * @description Profissional que pode realizar atendimentos no estabelecimento.
 */
export interface Professional { id: string; businessId: string; businessMembershipId: string | null; displayName: string; isActive: boolean; }
/**
 * @description Vínculo entre profissional e serviço, incluindo substituições de preço e duração.
 */
export interface ProfessionalService { professionalId: string; serviceId: string; serviceName: string; durationInMinutes: number; price: number; isActive: boolean; durationOverrideInMinutes: number | null; priceOverride: number | null; }
/**
 * @description Regra semanal de disponibilidade de um profissional.
 */
export interface AvailabilityRule { id: string; professionalId: string; dayOfWeek: string; startTime: string; endTime: string; isActive: boolean; }
/**
 * @description Tipos suportados de exceção à disponibilidade recorrente.
 */
export type AvailabilityExceptionType = "Unavailable" | "ExtraAvailability";
/**
 * @description Exceção de indisponibilidade ou disponibilidade extra em uma data.
 */
export interface AvailabilityException { id: string; professionalId: string; date: string; type: AvailabilityExceptionType; startTime: string | null; endTime: string | null; reason: string | null; }
/**
 * @description Estados do ciclo de vida de um agendamento administrativo.
 */
export type AppointmentStatus = "Pending" | "Confirmed" | "Cancelled" | "Completed" | "NoShow";
/**
 * @description Projeção administrativa completa de um agendamento.
 */
export interface Appointment { appointmentId: string; professionalId: string; professionalName: string; serviceId: string; serviceName: string; serviceCategoryId: string; serviceCategoryName: string; customerId: string; customerName: string; startsAtUtc: string; endsAtUtc: string; price: number; status: AppointmentStatus; }
/**
 * @description Dados necessários para criar um agendamento pela área administrativa.
 */
export interface ScheduleAppointmentInput { professionalId: string; serviceId: string; customerFullName: string; customerPhone: string; customerEmail: string; startsAtUtc: string; }
