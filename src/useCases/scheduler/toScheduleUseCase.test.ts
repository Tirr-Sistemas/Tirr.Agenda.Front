import { afterEach, describe, expect, it, vi } from "vitest";

import { ServiceModel } from "@/model/ServiceModel";
import { API_AGENDA } from "@/service/AgendaApi";

import toScheduleUseCase, { type ToScheduleUseCaseArgs } from "./toScheduleUseCase";

const createInput = (): ToScheduleUseCaseArgs => {
  const scheduledDate = new Date();
  scheduledDate.setDate(scheduledDate.getDate() + 1);

  return {
    chosenService: new ServiceModel({
      id: "1",
      image: "service.png",
      name: "Servico teste",
      description: "Descricao teste",
      price: 50,
    }),
    chosenDay: scheduledDate.getDate(),
    chosenMonth: scheduledDate.getMonth(),
    chosenYear: scheduledDate.getFullYear(),
    chosenHour: "14:00",
    name: "Ana Silva",
    email: "ana@example.com",
    phone: "(19) 99999-9999",
  };
};

describe("toScheduleUseCase", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("retorna falso quando a API nao confirma o agendamento", async () => {
    vi.spyOn(API_AGENDA, "criarAgendamento").mockResolvedValue(null);

    await expect(toScheduleUseCase(createInput())).resolves.toBe(false);
  });

  it("retorna verdadeiro quando a API confirma o agendamento", async () => {
    vi.spyOn(API_AGENDA, "criarAgendamento").mockResolvedValue({ sucesso: true });

    await expect(toScheduleUseCase(createInput())).resolves.toBe(true);
  });
});
