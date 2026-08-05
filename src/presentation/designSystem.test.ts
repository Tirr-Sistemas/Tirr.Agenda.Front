import { describe, expect, it } from "vitest";

const modules = import.meta.glob(["./**/*.{ts,tsx,css}", "../core.tsx"], {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

const sources = Object.entries(modules).filter(([path]) => !path.includes(".test."));

describe("presentation design-system guardrails", () => {
  it("does not use the retired icon font", () => {
    const source = sources.map(([, content]) => content).join("\n");
    expect(source).not.toMatch(/bootstrap-icons|\bbi-[a-z]/);
  });

  it("uses the accessible confirmation provider", () => {
    const source = sources.map(([, content]) => content).join("\n");
    expect(source).not.toContain("window.confirm");
  });

  it("keeps forced CSS overrides isolated to the calendar adapter", () => {
    const offenders = sources
      .filter(([path]) => path.endsWith(".css") && !path.endsWith("calendar.css"))
      .filter(([, content]) => content.includes("!important"))
      .map(([path]) => path);
    expect(offenders).toEqual([]);
  });
});
