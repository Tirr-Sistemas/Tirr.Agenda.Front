import MockAdapter from "axios-mock-adapter";

import { HttpAdministrationGateway } from "@/administration/infrastructure/api/HttpAdministrationGateway";
import { HttpAuthenticationGateway } from "@/identity/infrastructure/auth/HttpAuthenticationGateway";
import { HttpIdentityManagementGateway } from "@/identity/infrastructure/HttpIdentityManagementGateway";
import { HttpPublicBookingGateway } from "@/scheduling/infrastructure/api/HttpPublicBookingGateway";
import { apiHttp, publicHttp, setApiAccessToken } from "@/shared-architecture/http/ApiHttpClient";

describe("context HTTP infrastructure", () => {
  const publicMock = new MockAdapter(publicHttp);
  const privateMock = new MockAdapter(apiHttp);
  const administration = new HttpAdministrationGateway(apiHttp);
  const authentication = new HttpAuthenticationGateway();
  const identity = new HttpIdentityManagementGateway();
  const scheduling = new HttpPublicBookingGateway(publicHttp);

  afterEach(() => {
    publicMock.reset();
    privateMock.reset();
    setApiAccessToken(null);
  });

  it("resolves a public business through scheduling infrastructure", async () => {
    publicMock.onGet("/public/businesses/by-slug/estudio-centro").reply(200, {
      businessId: "business-1",
      name: "Estudio Centro",
      slug: "estudio-centro",
      timeZone: "America/Sao_Paulo",
    });

    await expect(scheduling.getBusinessBySlug("estudio-centro")).resolves.toMatchObject({
      businessId: "business-1",
      slug: "estudio-centro",
    });
  });

  it("sends the contextual token through identity infrastructure", async () => {
    setApiAccessToken("global-token");
    privateMock.onPost("/auth/business-context", { businessId: "business-2" }).reply((config) => {
      expect(config.headers?.Authorization).toBe("Bearer global-token");
      return [200, { accessToken: "business-token", businessId: "business-2", roles: ["Owner"], permissions: ["business.get"] }];
    });

    await expect(authentication.selectBusiness("business-2")).resolves.toMatchObject({ businessId: "business-2" });
  });

  it("serializes administration operating hours in TimeOnly format", async () => {
    privateMock.onPut("/businesses/business-1/operating-hours").reply((config) => {
      expect(JSON.parse(config.data as string)).toEqual({
        days: [
          { dayOfWeek: "Monday", isOperating: true, opensAt: "09:00:00", closesAt: "18:30:00" },
          { dayOfWeek: "Sunday", isOperating: false, opensAt: null, closesAt: null },
        ],
      });
      return [204];
    });

    await administration.overview.replaceOperatingHours("business-1", [
      { dayOfWeek: "Monday", isOperating: true, opensAt: "09:00", closesAt: "18:30" },
      { dayOfWeek: "Sunday", isOperating: false, opensAt: "09:00", closesAt: "18:00" },
    ]);
  });

  it("serializes administration availability ranges in TimeOnly format", async () => {
    privateMock.onPost("/businesses/business-1/availability-rules").reply((config) => {
      expect(JSON.parse(config.data as string)).toEqual({
        professionalId: "professional-1",
        dayOfWeek: "Monday",
        startTime: "09:00:00",
        endTime: "18:30:00",
      });
      return [201, {}];
    });

    await administration.availability.createRule("business-1", {
      professionalId: "professional-1",
      dayOfWeek: "Monday",
      startTime: "09:00",
      endTime: "18:30",
    });
  });

  it("reads API keys through identity infrastructure", async () => {
    privateMock.onGet("/businesses/business-1/api-keys").reply(200, [{
      id: "key-1",
      name: "Integracao",
      prefix: "tirr_test",
      isActive: true,
      expiresAtUtc: null,
      revokedAtUtc: null,
      lastUsedAtUtc: null,
      createdAtUtc: "2026-08-04T12:00:00Z",
      permissions: ["appointments.get"],
    }]);

    await expect(identity.api.apiKeys("business-1")).resolves.toEqual([
      expect.objectContaining({ id: "key-1", permissions: ["appointments.get"] }),
    ]);
  });
});
