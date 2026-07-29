import type {
  GetAppointmentResponseDto,
  GetCategoryResponseDto,
} from "@/service/fakeApi/types";

export type AdminAppointment = {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  serviceName: string;
  serviceCategory: string;
  servicePrice: number;
  start: Date;
  end: Date;
};

export const CALENDAR_EVENT_DURATION_MINUTES = 30;

const buildServiceIndex = (categories: GetCategoryResponseDto[]) => {
  return new Map(
    categories.flatMap((category) =>
      category.services.map((service) => [
        service.id,
        {
          category: category.title,
          name: service.name,
          price: service.price,
        },
      ] as const)
    )
  );
};

const toLocalDateTime = (chosenDay: string, chosenHour: string) => {
  const [year, month, day] = chosenDay.slice(0, 10).split("-").map(Number);
  const [hour, minute] = chosenHour.split(":").map(Number);

  return new Date(year, month - 1, day, hour, minute);
};

export const adaptAppointments = (
  appointments: GetAppointmentResponseDto[],
  categories: GetCategoryResponseDto[]
): AdminAppointment[] => {
  const serviceIndex = buildServiceIndex(categories);

  return appointments
    .map((appointment) => {
      const service = serviceIndex.get(appointment.chosenServiceId);

      if (!service) {
        return null;
      }

      const start = toLocalDateTime(appointment.chosenDay, appointment.chosenHour);

      if (Number.isNaN(start.getTime())) {
        return null;
      }

      return {
        id: appointment.id,
        clientName: appointment.name,
        clientEmail: appointment.email,
        clientPhone: appointment.phone,
        serviceName: service.name,
        serviceCategory: service.category,
        servicePrice: service.price,
        start,
        // The source contract does not expose duration yet. This keeps calendar events usable until it does.
        end: new Date(start.getTime() + CALENDAR_EVENT_DURATION_MINUTES * 60 * 1000),
      };
    })
    .filter((appointment): appointment is AdminAppointment => appointment !== null)
    .sort((first, second) => first.start.getTime() - second.start.getTime());
};

export const isSameCalendarDay = (first: Date, second: Date) =>
  first.getFullYear() === second.getFullYear() &&
  first.getMonth() === second.getMonth() &&
  first.getDate() === second.getDate();

export const getClosestAppointment = (appointments: AdminAppointment[]) => {
  const now = Date.now();

  return (
    appointments.find((appointment) => appointment.start.getTime() >= now) ??
    appointments[0] ??
    null
  );
};
