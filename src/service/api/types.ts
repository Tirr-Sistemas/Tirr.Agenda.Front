export type ApiProblem = {
  title?: string;
  detail?: string;
  status?: number;
  errors?: Record<string, string[]>;
};

export type TokenResponse = {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  accessTokenExpiresAtUtc: string;
};

export type BusinessContextToken = {
  accessToken: string;
  tokenType: string;
  accessTokenExpiresAtUtc: string;
  businessId: string;
  roles: string[];
  permissions: string[];
};

export type IdentityProfile = { id: string; fullName: string; email: string };
export type IdentityUser = IdentityProfile & { isActive: boolean };
export type UserBusiness = { businessId: string; name: string; slug: string; roles: string[] };
export type UserBusinessesResult = { businesses: UserBusiness[] };
export type BusinessMember = {
  membershipId: string;
  identityUserId: string;
  businessId: string;
  roles: string[];
  isActive: boolean;
};
export type BusinessMemberListItem = BusinessMember & { fullName: string; email: string };
export type PublicBusiness = { businessId: string; name: string; slug: string; timeZone: string };

export type BusinessProfile = {
  businessId: string;
  name: string;
  legalName: string | null;
  documentNumber: string | null;
  slug: string;
  timeZone: string;
  status: string;
};

export type OperatingHoursDay = {
  dayOfWeek: string;
  isOperating: boolean;
  opensAt: string | null;
  closesAt: string | null;
};
export type OperatingHoursResult = { days: OperatingHoursDay[] };

export type CustomerSummary = {
  customerId: string;
  fullName: string;
  phone: string;
  email: string | null;
  isActive: boolean;
  appointmentCount: number;
  lastServiceName: string | null;
  lastAppointmentAtUtc: string | null;
};
export type Customer = {
  id: string;
  businessId: string;
  fullName: string;
  phone: string;
  email: string;
  isActive: boolean;
};

export type ServiceSummary = {
  serviceId: string;
  serviceCategoryId: string;
  name: string;
  description: string | null;
  durationInMinutes: number;
  price: number;
  isActive: boolean;
  appointmentCount: number;
  lastAppointmentAtUtc: string | null;
};
export type Service = {
  id: string;
  businessId: string;
  serviceCategoryId: string;
  name: string;
  description: string | null;
  durationInMinutes: number;
  price: number;
  isActive: boolean;
};
export type ServiceCategory = {
  id: string;
  businessId: string;
  name: string;
  description: string | null;
  isActive: boolean;
};
export type Professional = {
  id: string;
  businessId: string;
  businessMembershipId: string | null;
  displayName: string;
  isActive: boolean;
};
export type ProfessionalService = {
  professionalId: string;
  serviceId: string;
  serviceName: string;
  durationInMinutes: number;
  price: number;
  isActive: boolean;
  durationOverrideInMinutes: number | null;
  priceOverride: number | null;
};

export type AvailabilityRule = {
  id: string;
  professionalId: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  isActive: boolean;
};
export type AvailabilityExceptionType = "Unavailable" | "ExtraAvailability";
export type AvailabilityException = {
  id: string;
  professionalId: string;
  date: string;
  type: AvailabilityExceptionType;
  startTime: string | null;
  endTime: string | null;
  reason: string | null;
};

export type AppointmentStatus = "Pending" | "Confirmed" | "Cancelled" | "Completed" | "NoShow";
export type Appointment = {
  appointmentId: string;
  professionalId: string;
  professionalName: string;
  serviceId: string;
  serviceName: string;
  serviceCategoryId: string;
  serviceCategoryName: string;
  customerId: string;
  customerName: string;
  startsAtUtc: string;
  endsAtUtc: string;
  price: number;
  status: AppointmentStatus;
};

export type BookableService = {
  serviceId: string;
  serviceCategoryId: string;
  name: string;
  description: string | null;
  durationInMinutes: number;
  price: number;
};
export type ServiceProfessional = {
  professionalId: string;
  displayName: string;
  durationInMinutes: number;
  price: number;
};
export type AvailableTimeSlot = { startsAtUtc: string; endsAtUtc: string };
export type ScheduledAppointment = {
  appointmentId: string;
  customerId: string;
  startsAtUtc: string;
  endsAtUtc: string;
  price: number;
  status: AppointmentStatus;
};

export type ApiKeyItem = {
  id: string;
  name: string;
  prefix: string;
  isActive: boolean;
  expiresAtUtc: string | null;
  revokedAtUtc: string | null;
  lastUsedAtUtc: string | null;
  createdAtUtc: string;
  permissions: string[];
};
export type ApiKeyCreated = {
  id: string;
  name: string;
  apiKey: string;
  prefix: string;
  permissions: string[];
  expiresAtUtc: string | null;
};

export type ScheduleAppointmentInput = {
  professionalId: string;
  serviceId: string;
  customerFullName: string;
  customerPhone: string;
  customerEmail: string;
  startsAtUtc: string;
};

export type FirstAccessInput = {
  fullName: string;
  email: string;
  password: string;
  businessName: string;
  businessSlug: string;
  timeZoneId: string;
  legalName?: string;
  documentNumber?: string;
};
export type FirstAccessResult = {
  identityUserId: string;
  businessId: string;
  membershipId: string;
  fullName: string;
  email: string;
  businessName: string;
  businessSlug: string;
  roles: string[];
};
