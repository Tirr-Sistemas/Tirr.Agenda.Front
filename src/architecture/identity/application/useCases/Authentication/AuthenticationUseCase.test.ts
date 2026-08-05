import type { AuthenticationGateway } from "../../ports/AuthenticationGateway";
import type { SessionRepository } from "../../ports/SessionRepository";
import { AuthenticationUseCase } from "./AuthenticationUseCase";

const gateway = (): AuthenticationGateway => ({ register: async () => undefined, login: async () => ({ accessToken: "access", refreshToken: "refresh" }), refresh: async () => ({ accessToken: "new-access", refreshToken: "new-refresh" }), logout: async () => undefined, logoutAll: async () => undefined, changePassword: async () => undefined, me: async () => ({ id: "user", fullName: "Ana", email: "ana@example.com" }), businesses: async () => [{ businessId: "business", name: "Empresa", slug: "empresa", roles: ["Owner"] }], selectBusiness: async (businessId) => ({ accessToken: "context", businessId, roles: ["Owner"], permissions: ["users.put"] }), updateProfile: async () => ({ id: "user", fullName: "Ana", email: "ana@example.com" }), setAccessToken: () => undefined });

describe("AuthenticationUseCase", () => {
  it("persists normalized session data after login", async () => {
    let refreshToken: string | null = null;
    let activeBusinessId: string | null = null;
    const session: SessionRepository = { getRefreshToken: () => refreshToken, setRefreshToken: (value) => { refreshToken = value; }, getActiveBusinessId: () => activeBusinessId, setActiveBusinessId: (value) => { activeBusinessId = value; } };
    const result = await new AuthenticationUseCase(gateway(), session).execute({ type: "login", email: "ana@example.com", password: "secret" });
    expect(result.activeBusiness?.businessId).toBe("business");
    expect(refreshToken).toBe("refresh");
    expect(activeBusinessId).toBe("business");
  });
});
