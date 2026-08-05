import { http, rawHttp } from "./http";
import type {
  ApiKeyCreated, ApiKeyItem, Appointment, AvailabilityException, AvailabilityExceptionType,
  AvailabilityRule, BookableService, BusinessContextToken, BusinessMember, BusinessProfile,
  Customer, CustomerSummary, FirstAccessInput, FirstAccessResult, IdentityProfile, IdentityUser,
  OperatingHoursResult, Professional, ScheduleAppointmentInput, ScheduledAppointment, Service,
  ServiceCategory, ServiceProfessional, ServiceSummary, TokenResponse, UserBusinessesResult,
  AvailableTimeSlot, BusinessMemberListItem, OperatingHoursDay, ProfessionalService, PublicBusiness,
} from "./types";

const business = (businessId: string) => `/businesses/${businessId}`;
const publicBusiness = (businessId: string) => `/public/businesses/${businessId}`;

export const authApi = {
  register: (input: FirstAccessInput) => rawHttp.post<FirstAccessResult>("/public/auth/register", input).then((r) => r.data),
  login: (email: string, password: string) => rawHttp.post<TokenResponse>("/public/auth/login", { email, password }).then((r) => r.data),
  refresh: (refreshToken: string) => rawHttp.post<TokenResponse>("/public/auth/refresh", { refreshToken }).then((r) => r.data),
  logout: (refreshToken: string) => http.post("/public/auth/logout", { refreshToken }),
  logoutAll: () => http.post("/auth/logout-all"),
  changePassword: (currentPassword: string, newPassword: string) => http.post("/auth/change-password", { currentPassword, newPassword }),
  me: () => http.get<IdentityProfile>("/me").then((r) => r.data),
  businesses: () => http.get<UserBusinessesResult>("/me/businesses").then((r) => r.data.businesses),
  selectBusiness: (businessId: string) => http.post<BusinessContextToken>("/auth/business-context", { businessId }).then((r) => r.data),
  updateProfile: (fullName: string, email: string) => http.put<IdentityProfile>("/me", { fullName, email }).then((r) => r.data),
};

export const publicSchedulingApi = {
  health: () => rawHttp.get<{ service: string; status: string }>("/public/health").then((r) => r.data),
  business: (businessId: string) => rawHttp.get<PublicBusiness>(`${publicBusiness(businessId)}`).then((r) => r.data),
  businessBySlug: (slug: string) => rawHttp.get<PublicBusiness>(`/public/businesses/by-slug/${slug}`).then((r) => r.data),
  services: (businessId: string) => rawHttp.get<{ services: BookableService[] }>(`${publicBusiness(businessId)}/services`).then((r) => r.data.services),
  professionals: (businessId: string, serviceId: string) => rawHttp.get<{ professionals: ServiceProfessional[] }>(`${publicBusiness(businessId)}/services/${serviceId}/professionals`).then((r) => r.data.professionals),
  availableDates: (businessId: string, professionalId: string, serviceId: string, startsOn: string, endsOn: string) => rawHttp.get<{ availableDates: string[] }>(`${publicBusiness(businessId)}/professionals/${professionalId}/available-dates`, { params: { serviceId, startsOn, endsOn } }).then((r) => r.data.availableDates),
  availableSlots: (businessId: string, professionalId: string, serviceId: string, date: string) => rawHttp.get<{ timeSlots: AvailableTimeSlot[] }>(`${publicBusiness(businessId)}/professionals/${professionalId}/available-time-slots`, { params: { serviceId, date } }).then((r) => r.data.timeSlots),
  schedule: (businessId: string, input: ScheduleAppointmentInput) => rawHttp.post<ScheduledAppointment>(`${publicBusiness(businessId)}/appointments`, input).then((r) => r.data),
};

export const overviewApi = {
  profile: (businessId: string) => http.get<BusinessProfile>(`${business(businessId)}/profile`).then((r) => r.data),
  operatingHours: (businessId: string) => http.get<OperatingHoursResult>(`${business(businessId)}/operating-hours`).then((r) => r.data.days),
  customers: (businessId: string, includeInactive = true) => http.get<{ customers: CustomerSummary[] }>(`${business(businessId)}/customers`, { params: { includeInactive } }).then((r) => r.data.customers),
  services: (businessId: string, includeInactive = true) => http.get<{ services: ServiceSummary[] }>(`${business(businessId)}/services`, { params: { includeInactive } }).then((r) => r.data.services),
  updateProfile: (businessId: string, input: Pick<BusinessProfile, "name" | "legalName" | "documentNumber" | "slug" | "timeZone">) => http.put<BusinessProfile>(`${business(businessId)}/profile`, input).then((r) => r.data),
  replaceOperatingHours: (businessId: string, days: OperatingHoursDay[]) => http.put(`${business(businessId)}/operating-hours`, { days }),
};

export const appointmentsApi = {
  day: (businessId: string, date: string) => http.get<{ appointments: Appointment[] }>(`${business(businessId)}/appointments/day`, { params: { date } }).then((r) => r.data.appointments),
  week: (businessId: string, weekStartsOn: string) => http.get<{ appointments: Appointment[] }>(`${business(businessId)}/appointments/week`, { params: { weekStartsOn } }).then((r) => r.data.appointments),
  month: (businessId: string, year: number, month: number) => http.get<{ appointments: Appointment[] }>(`${business(businessId)}/appointments/month`, { params: { year, month } }).then((r) => r.data.appointments),
  create: (businessId: string, input: ScheduleAppointmentInput) => http.post<ScheduledAppointment>(`${business(businessId)}/appointments`, input).then((r) => r.data),
  updateStatus: (businessId: string, appointmentId: string, status: Appointment["status"], cancellationReason?: string) => http.patch(`${business(businessId)}/appointments/${appointmentId}/status`, { status, cancellationReason }),
  reschedule: (businessId: string, appointmentId: string, startsAtUtc: string) => http.put(`${business(businessId)}/appointments/${appointmentId}/schedule`, { startsAtUtc }),
};

export const customersApi = {
  get: (businessId: string, id: string) => http.get<Customer>(`${business(businessId)}/customers/${id}`).then((r) => r.data),
  create: (businessId: string, input: Pick<Customer, "fullName" | "phone" | "email">) => http.post<Customer>(`${business(businessId)}/customers`, input).then((r) => r.data),
  update: (businessId: string, id: string, input: Pick<Customer, "fullName" | "phone" | "email" | "isActive">) => http.put<Customer>(`${business(businessId)}/customers/${id}`, input).then((r) => r.data),
  remove: (businessId: string, id: string) => http.delete(`${business(businessId)}/customers/${id}`),
};

export const servicesApi = {
  get: (businessId: string, id: string) => http.get<Service>(`${business(businessId)}/services/${id}`).then((r) => r.data),
  create: (businessId: string, input: Omit<Service, "id" | "businessId" | "isActive">) => http.post<Service>(`${business(businessId)}/services`, input).then((r) => r.data),
  update: (businessId: string, id: string, input: Omit<Service, "id" | "businessId">) => http.put<Service>(`${business(businessId)}/services/${id}`, input).then((r) => r.data),
  remove: (businessId: string, id: string) => http.delete(`${business(businessId)}/services/${id}`),
};

export const categoriesApi = {
  list: (businessId: string, includeInactive = true) => http.get<{ categories: ServiceCategory[] }>(`${business(businessId)}/service-categories`, { params: { includeInactive } }).then((r) => r.data.categories),
  get: (businessId: string, id: string) => http.get<ServiceCategory>(`${business(businessId)}/service-categories/${id}`).then((r) => r.data),
  create: (businessId: string, input: Pick<ServiceCategory, "name" | "description">) => http.post<ServiceCategory>(`${business(businessId)}/service-categories`, input).then((r) => r.data),
  update: (businessId: string, id: string, input: Pick<ServiceCategory, "name" | "description" | "isActive">) => http.put<ServiceCategory>(`${business(businessId)}/service-categories/${id}`, input).then((r) => r.data),
  remove: (businessId: string, id: string) => http.delete(`${business(businessId)}/service-categories/${id}`),
};

export const professionalsApi = {
  list: (businessId: string, includeInactive = true) => http.get<{ professionals: Professional[] }>(`${business(businessId)}/professionals`, { params: { includeInactive } }).then((r) => r.data.professionals),
  get: (businessId: string, id: string) => http.get<Professional>(`${business(businessId)}/professionals/${id}`).then((r) => r.data),
  create: (businessId: string, input: Pick<Professional, "displayName" | "businessMembershipId">) => http.post<Professional>(`${business(businessId)}/professionals`, input).then((r) => r.data),
  update: (businessId: string, id: string, input: Pick<Professional, "displayName" | "businessMembershipId" | "isActive">) => http.put<Professional>(`${business(businessId)}/professionals/${id}`, input).then((r) => r.data),
  remove: (businessId: string, id: string) => http.delete(`${business(businessId)}/professionals/${id}`),
  services: (businessId: string, professionalId: string) => http.get<{ services: ProfessionalService[] }>(`${business(businessId)}/professionals/${professionalId}/services`).then((r) => r.data.services),
  upsertService: (businessId: string, professionalId: string, serviceId: string, input: { durationInMinutes: number | null; price: number | null; isActive: boolean }) => http.put<ProfessionalService>(`${business(businessId)}/professionals/${professionalId}/services/${serviceId}`, input).then((r) => r.data),
  removeService: (businessId: string, professionalId: string, serviceId: string) => http.delete(`${business(businessId)}/professionals/${professionalId}/services/${serviceId}`),
};

export const availabilityApi = {
  rules: (businessId: string, professionalId?: string, includeInactive = true) => http.get<{ rules: AvailabilityRule[] }>(`${business(businessId)}/availability-rules`, { params: { professionalId, includeInactive } }).then((r) => r.data.rules),
  rule: (businessId: string, id: string) => http.get<AvailabilityRule>(`${business(businessId)}/availability-rules/${id}`).then((r) => r.data),
  createRule: (businessId: string, input: Pick<AvailabilityRule, "professionalId" | "dayOfWeek" | "startTime" | "endTime">) => http.post<AvailabilityRule>(`${business(businessId)}/availability-rules`, input).then((r) => r.data),
  updateRule: (businessId: string, id: string, input: Pick<AvailabilityRule, "dayOfWeek" | "startTime" | "endTime" | "isActive">) => http.put<AvailabilityRule>(`${business(businessId)}/availability-rules/${id}`, input).then((r) => r.data),
  removeRule: (businessId: string, id: string) => http.delete(`${business(businessId)}/availability-rules/${id}`),
  exceptions: (businessId: string, professionalId?: string) => http.get<{ exceptions: AvailabilityException[] }>(`${business(businessId)}/availability-exceptions`, { params: { professionalId } }).then((r) => r.data.exceptions),
  exception: (businessId: string, id: string) => http.get<AvailabilityException>(`${business(businessId)}/availability-exceptions/${id}`).then((r) => r.data),
  createException: (businessId: string, input: { professionalId: string; date: string; type: AvailabilityExceptionType; startTime: string | null; endTime: string | null; reason: string | null }) => http.post<AvailabilityException>(`${business(businessId)}/availability-exceptions`, input).then((r) => r.data),
  updateException: (businessId: string, id: string, input: Omit<AvailabilityException, "id" | "professionalId">) => http.put<AvailabilityException>(`${business(businessId)}/availability-exceptions/${id}`, input).then((r) => r.data),
  removeException: (businessId: string, id: string) => http.delete(`${business(businessId)}/availability-exceptions/${id}`),
};

export const identityApi = {
  findByEmail: (email: string) => http.get<IdentityUser>("/users/by-email", { params: { email } }).then((r) => r.data),
  createUser: (fullName: string, email: string, password: string) => http.post<IdentityProfile>("/users", { fullName, email, password }).then((r) => r.data),
  addMember: (businessId: string, identityUserId: string, roles: string[]) => http.post<BusinessMember>(`${business(businessId)}/members`, { identityUserId, roles }).then((r) => r.data),
  members: (businessId: string) => http.get<{ members: BusinessMemberListItem[] }>(`${business(businessId)}/members`).then((r) => r.data.members),
  replaceRoles: (businessId: string, identityUserId: string, roles: string[]) => http.put(`${business(businessId)}/members/${identityUserId}/roles`, { roles }),
  setMemberStatus: (businessId: string, identityUserId: string, isActive: boolean) => http.patch(`${business(businessId)}/members/${identityUserId}/status`, { isActive }),
  apiKeys: (businessId: string) => http.get<{ apiKeys: ApiKeyItem[] }>(`${business(businessId)}/api-keys`).then((r) => r.data.apiKeys),
  createApiKey: (businessId: string, name: string, permissions: string[], expiresAtUtc: string | null) => http.post<ApiKeyCreated>(`${business(businessId)}/api-keys`, { name, permissions, expiresAtUtc }).then((r) => r.data),
  rotateApiKey: (businessId: string, id: string) => http.post<ApiKeyCreated>(`${business(businessId)}/api-keys/${id}/rotate`).then((r) => r.data),
  revokeApiKey: (businessId: string, id: string) => http.delete(`${business(businessId)}/api-keys/${id}`),
};

export * from "./http";
export * from "./types";
