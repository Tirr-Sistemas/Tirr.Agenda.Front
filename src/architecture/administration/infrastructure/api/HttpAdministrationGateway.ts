import type {
  Appointment, AppointmentStatus, AvailabilityException, AvailabilityExceptionType,
  AvailabilityRule, BusinessProfile, Customer, CustomerSummary, OperatingHoursDay,
  Professional, ProfessionalService, ScheduleAppointmentInput, Service, ServiceCategory,
  ServiceSummary,
} from "@/administration/application/dtos";
import type { AdministrationGateway } from "@/administration/application/ports/AdministrationGateway";
import type { AxiosInstance } from "axios";

const business = (businessId: string): string => `/businesses/${businessId}`;
const asTimeOnly = (value: string | null): string | null => {
  if (!value) return null;
  const [hours = "00", minutes = "00", seconds = "00"] = value.split(":");
  return `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}:${seconds.slice(0, 2).padStart(2, "0")}`;
};
const withTimeOnlyRange = <T extends { startTime: string | null; endTime: string | null }>(input: T): T => ({
  ...input,
  startTime: asTimeOnly(input.startTime),
  endTime: asTimeOnly(input.endTime),
});

export class HttpAdministrationGateway implements AdministrationGateway {
  public constructor(private readonly http: AxiosInstance) {}

  public readonly appointments: AdministrationGateway["appointments"] = {
    day: async (businessId, date) => (await this.http.get<{ appointments: Appointment[] }>(`${business(businessId)}/appointments/day`, { params: { date } })).data.appointments,
    week: async (businessId, weekStartsOn) => (await this.http.get<{ appointments: Appointment[] }>(`${business(businessId)}/appointments/week`, { params: { weekStartsOn } })).data.appointments,
    month: async (businessId, year, month) => (await this.http.get<{ appointments: Appointment[] }>(`${business(businessId)}/appointments/month`, { params: { year, month } })).data.appointments,
    create: async (businessId, input: ScheduleAppointmentInput) => (await this.http.post(`${business(businessId)}/appointments`, input)).data,
    updateStatus: async (businessId, appointmentId, status: AppointmentStatus, reason) => (await this.http.patch(`${business(businessId)}/appointments/${appointmentId}/status`, { status, cancellationReason: reason })).data,
    reschedule: async (businessId, appointmentId, startsAtUtc) => (await this.http.put(`${business(businessId)}/appointments/${appointmentId}/schedule`, { startsAtUtc })).data,
  };

  public readonly overview: AdministrationGateway["overview"] = {
    profile: async (businessId) => (await this.http.get<BusinessProfile>(`${business(businessId)}/profile`)).data,
    operatingHours: async (businessId) => (await this.http.get<{ days: OperatingHoursDay[] }>(`${business(businessId)}/operating-hours`)).data.days,
    customers: async (businessId, includeInactive = true) => (await this.http.get<{ customers: CustomerSummary[] }>(`${business(businessId)}/customers`, { params: { includeInactive } })).data.customers,
    services: async (businessId, includeInactive = true) => (await this.http.get<{ services: ServiceSummary[] }>(`${business(businessId)}/services`, { params: { includeInactive } })).data.services,
    updateProfile: async (businessId, input) => (await this.http.put<BusinessProfile>(`${business(businessId)}/profile`, input)).data,
    replaceOperatingHours: async (businessId, days) => (await this.http.put(`${business(businessId)}/operating-hours`, {
      days: days.map((day) => ({
        ...day,
        opensAt: day.isOperating ? asTimeOnly(day.opensAt) : null,
        closesAt: day.isOperating ? asTimeOnly(day.closesAt) : null,
      })),
    })).data,
  };

  public readonly customers: AdministrationGateway["customers"] = {
    get: async (businessId, id) => (await this.http.get<Customer>(`${business(businessId)}/customers/${id}`)).data,
    create: async (businessId, input) => (await this.http.post<Customer>(`${business(businessId)}/customers`, input)).data,
    update: async (businessId, id, input) => (await this.http.put<Customer>(`${business(businessId)}/customers/${id}`, input)).data,
    remove: async (businessId, id) => (await this.http.delete(`${business(businessId)}/customers/${id}`)).data,
  };

  public readonly categories: AdministrationGateway["categories"] = {
    list: async (businessId, includeInactive = true) => (await this.http.get<{ categories: ServiceCategory[] }>(`${business(businessId)}/service-categories`, { params: { includeInactive } })).data.categories,
    get: async (businessId, id) => (await this.http.get<ServiceCategory>(`${business(businessId)}/service-categories/${id}`)).data,
    create: async (businessId, input) => (await this.http.post<ServiceCategory>(`${business(businessId)}/service-categories`, input)).data,
    update: async (businessId, id, input) => (await this.http.put<ServiceCategory>(`${business(businessId)}/service-categories/${id}`, input)).data,
    remove: async (businessId, id) => (await this.http.delete(`${business(businessId)}/service-categories/${id}`)).data,
  };

  public readonly services: AdministrationGateway["services"] = {
    get: async (businessId, id) => (await this.http.get<Service>(`${business(businessId)}/services/${id}`)).data,
    create: async (businessId, input) => (await this.http.post<Service>(`${business(businessId)}/services`, input)).data,
    update: async (businessId, id, input) => (await this.http.put<Service>(`${business(businessId)}/services/${id}`, input)).data,
    remove: async (businessId, id) => (await this.http.delete(`${business(businessId)}/services/${id}`)).data,
  };

  public readonly professionals: AdministrationGateway["professionals"] = {
    list: async (businessId, includeInactive = true) => (await this.http.get<{ professionals: Professional[] }>(`${business(businessId)}/professionals`, { params: { includeInactive } })).data.professionals,
    get: async (businessId, id) => (await this.http.get<Professional>(`${business(businessId)}/professionals/${id}`)).data,
    create: async (businessId, input) => (await this.http.post<Professional>(`${business(businessId)}/professionals`, input)).data,
    update: async (businessId, id, input) => (await this.http.put<Professional>(`${business(businessId)}/professionals/${id}`, input)).data,
    remove: async (businessId, id) => (await this.http.delete(`${business(businessId)}/professionals/${id}`)).data,
    services: async (businessId, professionalId) => (await this.http.get<{ services: ProfessionalService[] }>(`${business(businessId)}/professionals/${professionalId}/services`)).data.services,
    upsertService: async (businessId, professionalId, serviceId, input) => (await this.http.put<ProfessionalService>(`${business(businessId)}/professionals/${professionalId}/services/${serviceId}`, input)).data,
    removeService: async (businessId, professionalId, serviceId) => (await this.http.delete(`${business(businessId)}/professionals/${professionalId}/services/${serviceId}`)).data,
  };

  public readonly availability: AdministrationGateway["availability"] = {
    rules: async (businessId, professionalId, includeInactive = true) => (await this.http.get<{ rules: AvailabilityRule[] }>(`${business(businessId)}/availability-rules`, { params: { professionalId, includeInactive } })).data.rules,
    rule: async (businessId, id) => (await this.http.get<AvailabilityRule>(`${business(businessId)}/availability-rules/${id}`)).data,
    createRule: async (businessId, input) => (await this.http.post<AvailabilityRule>(`${business(businessId)}/availability-rules`, withTimeOnlyRange(input))).data,
    updateRule: async (businessId, id, input) => (await this.http.put<AvailabilityRule>(`${business(businessId)}/availability-rules/${id}`, withTimeOnlyRange(input))).data,
    removeRule: async (businessId, id) => (await this.http.delete(`${business(businessId)}/availability-rules/${id}`)).data,
    exceptions: async (businessId, professionalId) => (await this.http.get<{ exceptions: AvailabilityException[] }>(`${business(businessId)}/availability-exceptions`, { params: { professionalId } })).data.exceptions,
    exception: async (businessId, id) => (await this.http.get<AvailabilityException>(`${business(businessId)}/availability-exceptions/${id}`)).data,
    createException: async (businessId, input: { professionalId: string; date: string; type: AvailabilityExceptionType; startTime: string | null; endTime: string | null; reason: string | null }) => (await this.http.post<AvailabilityException>(`${business(businessId)}/availability-exceptions`, withTimeOnlyRange(input))).data,
    updateException: async (businessId, id, input) => (await this.http.put<AvailabilityException>(`${business(businessId)}/availability-exceptions/${id}`, withTimeOnlyRange(input))).data,
    removeException: async (businessId, id) => (await this.http.delete(`${business(businessId)}/availability-exceptions/${id}`)).data,
  };
}
