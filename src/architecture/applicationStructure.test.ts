const applicationFiles = Object.keys(import.meta.glob("./**/*.ts", { query: "?raw", import: "default" }));
const compatibilityFiles = Object.keys(import.meta.glob([
  "../legacy/**/*.{ts,tsx}",
  "../service/**/*.{ts,tsx}",
  "../useCases/**/*.{ts,tsx}",
  "../model/**/*.{ts,tsx}",
], { query: "?raw", import: "default" }));
const uiOutsidePresentationFiles = Object.keys(import.meta.glob([
  "../{page,hook,shared,auth,theme,styles,assets,utils}/**/*.{ts,tsx,css,png,svg}",
  "../routingV1.tsx",
], { query: "?raw", import: "default" }));

describe("application use-case structure", () => {
  it("keeps every use case in a folder with Command, UseCase and Result contracts", () => {
    const useCaseNames = new Set(
      applicationFiles
        .map((path) => path.match(/\/useCases\/([^/]+)\//)?.[1])
        .filter((name): name is string => Boolean(name)),
    );

    for (const name of useCaseNames) {
      const folder = `/useCases/${name}/`;
      expect(applicationFiles.some((path) => path.includes(folder) && path.endsWith(`${name}Command.ts`)), `${name} is missing its Command`).toBe(true);
      expect(applicationFiles.some((path) => path.includes(folder) && path.endsWith(`${name}UseCase.ts`)), `${name} is missing its UseCase`).toBe(true);
      expect(applicationFiles.some((path) => path.includes(folder) && path.endsWith(`${name}Result.ts`)), `${name} is missing its Result`).toBe(true);
    }
  });

  it("does not keep compatibility layers from the previous architecture", () => {
    expect(compatibilityFiles).toEqual([]);
  });

  it("keeps every UI concern inside presentation", () => {
    expect(uiOutsidePresentationFiles).toEqual([]);
  });
});
