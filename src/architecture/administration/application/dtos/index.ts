export interface BusinessProfile { businessId: string; name: string; legalName: string | null; documentNumber: string | null; slug: string; timeZone: string; status: string; }
export interface OperatingHoursDay { dayOfWeek: string; isOperating: boolean; opensAt: string | null; closesAt: string | null; }
export interface CustomerSummary { customerId: string; fullName: string; phone: string; email: string | null; isActive: boolean; appointmentCount: number; lastServiceName: string | null; lastAppointmentAtUtc: string | null; }
export interface Customer { id: string; businessId: string; fullName: string; phone: string; email: string; isActive: boolean; }
export interface ServiceSummary { serviceId: string; serviceCategoryId: string; name: string; description: string | null; durationInMinutes: number; price: number; isActive: boolean; appointmentCount: number; lastAppointmentAtUtc: string | null; }
export interface Service { id: string; businessId: string; serviceCategoryId: string; name: string; description: string | null; durationInMinutes: number; price: number; isActive: boolean; }
export interface ServiceCategory { id: string; businessId: string; name: string; description: string | null; isActive: boolean; }
export interface Professional { id: string; businessId: string; businessMembershipId: string | null; displayName: string; isActive: boolean; }
export interface ProfessionalService { professionalId: string; serviceId: string; serviceName: string; durationInMinutes: number; price: number; isActive: boolean; durationOverrideInMinutes: number | null; priceOverride: number | null; }
export interface AvailabilityRule { id: string; professionalId: string; dayOfWeek: string; startTime: string; endTime: string; isActive: boolean; }
export type AvailabilityExceptionType = "Unavailable" | "ExtraAvailability";
export interface AvailabilityException { id: string; professionalId: string; date: string; type: AvailabilityExceptionType; startTime: string | null; endTime: string | null; reason: string | null; }
export type AppointmentStatus = "Pending" | "Confirmed" | "Cancelled" | "Completed" | "NoShow";
export interface Appointment { appointmentId: string; professionalId: string; professionalName: string; serviceId: string; serviceName: string; serviceCategoryId: string; serviceCategoryName: string; customerId: string; customerName: string; startsAtUtc: string; endsAtUtc: string; price: number; status: AppointmentStatus; }
export interface ScheduleAppointmentInput { professionalId: string; serviceId: string; customerFullName: string; customerPhone: string; customerEmail: string; startsAtUtc: string; }
