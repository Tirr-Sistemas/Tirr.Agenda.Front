import { BookingConflictError } from "@/scheduling/application/errors/BookingConflictError";
import type { AvailableTimeSlot, BookableService, CreatePublicBookingInput, PublicBusiness, ScheduledAppointment, ServiceProfessional } from "@/scheduling/application/dtos/PublicBookingDtos";
import type { PublicBookingGateway } from "@/scheduling/application/ports/PublicBookingGateway";
import type { AxiosInstance } from "axios";

function object(value: unknown): Record<string, unknown> { if (!value || typeof value !== "object") throw new Error("Resposta da API inválida."); return value as Record<string, unknown>; }
function list(value: unknown): readonly Record<string, unknown>[] { if (!Array.isArray(value) || !value.every((item) => item && typeof item === "object")) throw new Error("Resposta da API inválida."); return value as Record<string, unknown>[]; }
function text(value: unknown): string { if (typeof value !== "string") throw new Error("Resposta da API inválida."); return value; }
function number(value: unknown): number { if (typeof value !== "number") throw new Error("Resposta da API inválida."); return value; }
function publicBusiness(value: unknown): PublicBusiness { const item = object(value); return { businessId: text(item.businessId), name: text(item.name), slug: text(item.slug), timeZone: text(item.timeZone) }; }
function service(value: Record<string, unknown>): BookableService { return { serviceId: text(value.serviceId), serviceCategoryId: text(value.serviceCategoryId), name: text(value.name), description: value.description === null ? null : text(value.description), durationInMinutes: number(value.durationInMinutes), price: number(value.price) }; }
function professional(value: Record<string, unknown>): ServiceProfessional { return { professionalId: text(value.professionalId), displayName: text(value.displayName), durationInMinutes: number(value.durationInMinutes), price: number(value.price) }; }
function slot(value: Record<string, unknown>): AvailableTimeSlot { return { startsAtUtc: text(value.startsAtUtc), endsAtUtc: text(value.endsAtUtc) }; }
function appointment(value: unknown): ScheduledAppointment { const item = object(value); return { appointmentId: text(item.appointmentId), customerId: text(item.customerId), startsAtUtc: text(item.startsAtUtc), endsAtUtc: text(item.endsAtUtc), price: number(item.price), status: text(item.status) }; }

/** Axios adapter that validates untrusted HTTP responses before exposing DTOs. */
export class HttpPublicBookingGateway implements PublicBookingGateway {
  public constructor(private readonly http: AxiosInstance) {}
  public async health(): Promise<void> { await this.http.get<unknown>("/public/health"); }
  public async getBusiness(businessId: string): Promise<PublicBusiness> { return publicBusiness((await this.http.get<unknown>(`/public/businesses/${businessId}`)).data); }
  public async getBusinessBySlug(slug: string): Promise<PublicBusiness> { return publicBusiness((await this.http.get<unknown>(`/public/businesses/by-slug/${slug}`)).data); }
  public async listServices(businessId: string): Promise<BookableService[]> { return list(object((await this.http.get<unknown>(`/public/businesses/${businessId}/services`)).data).services).map(service); }
  public async listProfessionals(businessId: string, serviceId: string): Promise<ServiceProfessional[]> { return list(object((await this.http.get<unknown>(`/public/businesses/${businessId}/services/${serviceId}/professionals`)).data).professionals).map(professional); }
  public async listAvailableDates(input: { readonly businessId: string; readonly professionalId: string; readonly serviceId: string; readonly startsOn: string; readonly endsOn: string }): Promise<string[]> { const response = await this.http.get<unknown>(`/public/businesses/${input.businessId}/professionals/${input.professionalId}/available-dates`, { params: { serviceId: input.serviceId, startsOn: input.startsOn, endsOn: input.endsOn } }); const dates = object(response.data).availableDates; if (!Array.isArray(dates) || !dates.every((date) => typeof date === "string")) throw new Error("Resposta da API inválida."); return dates; }
  public async listAvailableSlots(input: { readonly businessId: string; readonly professionalId: string; readonly serviceId: string; readonly date: string }): Promise<AvailableTimeSlot[]> { const response = await this.http.get<unknown>(`/public/businesses/${input.businessId}/professionals/${input.professionalId}/available-time-slots`, { params: { serviceId: input.serviceId, date: input.date } }); return list(object(response.data).timeSlots).map(slot); }
  public async create(input: CreatePublicBookingInput): Promise<ScheduledAppointment> { try { return appointment((await this.http.post<unknown>(`/public/businesses/${input.businessId}/appointments`, input)).data); } catch (error: unknown) { if (typeof error === "object" && error && "status" in error && (error as { status?: unknown }).status === 409) throw new BookingConflictError(); throw error; } }
}
