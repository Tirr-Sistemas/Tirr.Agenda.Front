import { describe, expect, it } from "vitest";

import { PUBLIC_SCHEDULER_ROUTE, publicSchedulerPath, publicSchedulerUrl } from "./publicSchedulerUrl";

describe("public scheduler URL", () => {
  it("uses the business id as a route parameter", () => {
    expect(PUBLIC_SCHEDULER_ROUTE).toBe("/agendar/:businessId");
    expect(publicSchedulerPath(" business/id ")).toBe("/agendar/business%2Fid");
  });

  it("builds an absolute link from the current origin", () => {
    expect(publicSchedulerUrl("890a7ab0", "https://agenda.example.com"))
      .toBe("https://agenda.example.com/agendar/890a7ab0");
  });
});
