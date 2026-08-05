import MockAdapter from "axios-mock-adapter";

import { authApi, publicSchedulingApi } from ".";
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
});
