import MockAdapter from "axios-mock-adapter";

import { authApi, availabilityApi, overviewApi, publicSchedulingApi } from ".";
import { http, rawHttp, setApiAccessToken } from "./http";

describe("typed API client", () => {
  const publicMock = new MockAdapter(rawHttp);
  const privateMock = new MockAdapter(http);

  afterEach(() => {
    publicMock.reset();
    privateMock.reset();
    setApiAccessToken(null);
  });

  it("resolves a public business by slug", async () => {
    publicMock.onGet("/public/businesses/by-slug/estudio-centro").reply(200, {
      businessId: "business-1",
      name: "Estudio Centro",
      slug: "estudio-centro",
      timeZone: "America/Sao_Paulo",
    });

    await expect(publicSchedulingApi.businessBySlug("estudio-centro")).resolves.toMatchObject({
      businessId: "business-1",
      slug: "estudio-centro",
    });
  });

  it("sends the access token when selecting a business", async () => {
    setApiAccessToken("global-token");
    privateMock.onPost("/auth/business-context", { businessId: "business-2" }).reply((config) => {
      expect(config.headers?.Authorization).toBe("Bearer global-token");
      return [200, { accessToken: "business-token", expiresInSeconds: 900, businessId: "business-2", roles: ["Owner"], permissions: ["business.get"] }];
    });

    await expect(authApi.selectBusiness("business-2")).resolves.toMatchObject({ businessId: "business-2" });
  });

  it("normalizes API problems", async () => {
    publicMock.onGet("/public/health").reply(409, { title: "Conflito", detail: "Horario indisponivel." });

    await expect(publicSchedulingApi.health()).rejects.toEqual(expect.objectContaining({
      name: "ApiError",
      status: 409,
      message: "Horario indisponivel.",
    }));
  });

  it("serializes operating hours using the TimeOnly API format", async () => {
    privateMock.onPut("/businesses/business-1/operating-hours").reply((config) => {
      expect(JSON.parse(config.data as string)).toEqual({
        days: [
          { dayOfWeek: "Monday", isOperating: true, opensAt: "09:00:00", closesAt: "18:30:00" },
          { dayOfWeek: "Sunday", isOperating: false, opensAt: null, closesAt: null },
        ],
      });
      return [204];
    });

    await overviewApi.replaceOperatingHours("business-1", [
      { dayOfWeek: "Monday", isOperating: true, opensAt: "09:00", closesAt: "18:30" },
      { dayOfWeek: "Sunday", isOperating: false, opensAt: "09:00", closesAt: "18:00" },
    ]);
  });

  it("serializes availability ranges using the TimeOnly API format", async () => {
    privateMock.onPost("/businesses/business-1/availability-rules").reply((config) => {
      expect(JSON.parse(config.data as string)).toEqual({
        professionalId: "professional-1",
        dayOfWeek: "Monday",
        startTime: "09:00:00",
        endTime: "18:30:00",
      });
      return [201, {}];
    });
    privateMock.onPost("/businesses/business-1/availability-exceptions").reply((config) => {
      expect(JSON.parse(config.data as string)).toEqual({
        professionalId: "professional-1",
        date: "2026-08-05",
        type: "Unavailable",
        startTime: "12:15:00",
        endTime: "13:45:00",
        reason: "Almoco",
      });
      return [201, {}];
    });

    await availabilityApi.createRule("business-1", {
      professionalId: "professional-1",
      dayOfWeek: "Monday",
      startTime: "09:00",
      endTime: "18:30",
    });
    await availabilityApi.createException("business-1", {
      professionalId: "professional-1",
      date: "2026-08-05",
      type: "Unavailable",
      startTime: "12:15",
      endTime: "13:45",
      reason: "Almoco",
    });
  });
});
