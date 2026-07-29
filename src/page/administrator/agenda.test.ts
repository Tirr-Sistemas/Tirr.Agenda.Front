import { describe, expect, it } from "vitest";

import { adaptAppointments } from "./agenda";

describe("adaptAppointments", () => {
  it("combina agendamento, servico e data local para o calendario", () => {
    const appointments = [{
      id: "appointment-1",
      chosenServiceId: "service-1",
      chosenDay: "2026-08-10T00:00:00.000Z",
      chosenHour: "14:30",
      name: "Ana Silva",
      email: "ana@example.com",
      phone: "19999999999",
    }];
    const categories = [{
      title: "Corte",
      services: [{
        id: "service-1",
        name: "Corte Basico",
        description: "Corte",
        image: "service.png",
        price: 45,
      }],
    }];

    const [appointment] = adaptAppointments(appointments, categories);

    expect(appointment).toMatchObject({
      clientName: "Ana Silva",
      serviceName: "Corte Basico",
      serviceCategory: "Corte",
      servicePrice: 45,
    });
    expect(appointment.start.getHours()).toBe(14);
    expect(appointment.start.getMinutes()).toBe(30);
    expect(appointment.end.getMinutes()).toBe(0);
  });
});
