import * as ts from "typescript";
import { describe, expect, it } from "vitest";

const modules = import.meta.glob([
  "./**/*.{ts,tsx}",
  "../core.tsx",
  "../core/**/*.{ts,tsx}",
  "../presentation/**/*.{ts,tsx}",
], { query: "?raw", import: "default", eager: true }) as Record<string, string>;

const productionModules = Object.entries(modules).filter(([path]) => !path.includes(".test."));

/** Retorna verdadeiro quando a declaração possui o modificador `export`. */
const isExported = (node: ts.Node): boolean => ts.canHaveModifiers(node)
  && Boolean(ts.getModifiers(node)?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword));

/** Identifica declarações públicas que precisam de documentação de API. */
const isDocumentableDeclaration = (node: ts.Node): boolean =>
  ts.isFunctionDeclaration(node)
  || ts.isClassDeclaration(node)
  || ts.isInterfaceDeclaration(node)
  || ts.isTypeAliasDeclaration(node)
  || ts.isEnumDeclaration(node)
  || ts.isVariableStatement(node);

describe("JSDoc documentation", () => {
  it("documents every production TypeScript module", () => {
    const missing = productionModules.filter(([, source]) => !source.includes("/**")).map(([path]) => path);
    expect(missing).toEqual([]);
  });

  it("documents every named exported declaration", () => {
    const missing = productionModules.flatMap(([path, source]) => {
      const sourceFile = ts.createSourceFile(path, source, ts.ScriptTarget.Latest, true, path.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
      return sourceFile.statements
        .filter((node) => isDocumentableDeclaration(node) && isExported(node))
        .filter((node) => !node.getFullText(sourceFile).trimStart().startsWith("/**"))
        .map((node) => `${path}:${sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile)).line + 1}`);
    });
    expect(missing).toEqual([]);
  });
});
