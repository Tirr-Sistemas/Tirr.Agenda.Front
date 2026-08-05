export const PUBLIC_SCHEDULER_ROUTE = "/agendar/:businessId";

export const publicSchedulerPath = (businessId: string) => `/agendar/${encodeURIComponent(businessId.trim())}`;

export const publicSchedulerUrl = (businessId: string, origin = window.location.origin) =>
  new URL(publicSchedulerPath(businessId), origin).toString();
