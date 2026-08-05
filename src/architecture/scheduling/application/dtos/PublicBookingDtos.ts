export interface PublicBusiness { readonly businessId: string; readonly name: string; readonly slug: string; readonly timeZone: string; }
export interface BookableService { readonly serviceId: string; readonly serviceCategoryId: string; readonly name: string; readonly description: string | null; readonly durationInMinutes: number; readonly price: number; }
export interface ServiceProfessional { readonly professionalId: string; readonly displayName: string; readonly durationInMinutes: number; readonly price: number; }
export interface AvailableTimeSlot { readonly startsAtUtc: string; readonly endsAtUtc: string; }
export interface ScheduledAppointment { readonly appointmentId: string; readonly customerId: string; readonly startsAtUtc: string; readonly endsAtUtc: string; readonly price: number; readonly status: string; }
export interface CreatePublicBookingInput { readonly businessId: string; readonly professionalId: string; readonly serviceId: string; readonly customerFullName: string; readonly customerPhone: string; readonly customerEmail: string; readonly startsAtUtc: string; }
