import type { AvailableTimeSlot, BookableService, CreatePublicBookingInput, PublicBusiness, ScheduledAppointment, ServiceProfessional } from "../dtos/PublicBookingDtos";

/** Boundary for the public scheduling API. */
export interface PublicBookingGateway {
  health(): Promise<void>;
  getBusiness(businessId: string): Promise<PublicBusiness>;
  getBusinessBySlug(slug: string): Promise<PublicBusiness>;
  listServices(businessId: string): Promise<BookableService[]>;
  listProfessionals(businessId: string, serviceId: string): Promise<ServiceProfessional[]>;
  listAvailableDates(input: { readonly businessId: string; readonly professionalId: string; readonly serviceId: string; readonly startsOn: string; readonly endsOn: string }): Promise<string[]>;
  listAvailableSlots(input: { readonly businessId: string; readonly professionalId: string; readonly serviceId: string; readonly date: string }): Promise<AvailableTimeSlot[]>;
  create(input: CreatePublicBookingInput): Promise<ScheduledAppointment>;
}
