/**
 * @description Identificação pública do estabelecimento exibido no agendamento.
 */
export interface PublicBusiness { readonly businessId: string; readonly name: string; readonly slug: string; readonly timeZone: string; }
/**
 * @description Serviço ativo que pode ser escolhido por um cliente.
 */
export interface BookableService { readonly serviceId: string; readonly serviceCategoryId: string; readonly name: string; readonly description: string | null; readonly durationInMinutes: number; readonly price: number; }
/**
 * @description Profissional habilitado para executar o serviço escolhido.
 */
export interface ServiceProfessional { readonly professionalId: string; readonly displayName: string; readonly durationInMinutes: number; readonly price: number; }
/**
 * @description Intervalo UTC disponível para reserva.
 */
export interface AvailableTimeSlot { readonly startsAtUtc: string; readonly endsAtUtc: string; }
/**
 * @description Comprovante retornado após a criação de um agendamento.
 */
export interface ScheduledAppointment { readonly appointmentId: string; readonly customerId: string; readonly startsAtUtc: string; readonly endsAtUtc: string; readonly price: number; readonly status: string; }
/**
 * @description Dados necessários para confirmar uma reserva pública.
 */
export interface CreatePublicBookingInput { readonly businessId: string; readonly professionalId: string; readonly serviceId: string; readonly customerFullName: string; readonly customerPhone: string; readonly customerEmail: string; readonly startsAtUtc: string; }
