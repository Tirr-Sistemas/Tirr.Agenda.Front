import * as ts from "typescript";
import { describe, expect, it } from "vitest";

const modules = import.meta.glob([
  "./**/*.{ts,tsx}",
  "../core.tsx",
  "../core/**/*.{ts,tsx}",
  "../presentation/**/*.{ts,tsx}",
], { query: "?raw", import: "default", eager: true }) as Record<string, string>;

const productionModules = Object.entries(modules).filter(([path]) => !path.includes(".test."));

/**
 * @description Retorna verdadeiro quando a declaração possui o modificador `export`.
 *
 * @param node - Nó da árvore sintática que será inspecionado.
 * @returns Verdadeiro quando a declaração for exportada.
 */
const isExported = (node: ts.Node): boolean => ts.canHaveModifiers(node)
  && Boolean(ts.getModifiers(node)?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword));

/**
 * @description Identifica declarações públicas que precisam de documentação de API.
 *
 * @param node - Nó da árvore sintática que será inspecionado.
 * @returns Verdadeiro quando a declaração pública exigir documentação.
 */
const isDocumentableDeclaration = (node: ts.Node): boolean =>
  ts.isFunctionDeclaration(node)
  || ts.isClassDeclaration(node)
  || ts.isInterfaceDeclaration(node)
  || ts.isTypeAliasDeclaration(node)
  || ts.isEnumDeclaration(node)
  || ts.isVariableStatement(node);

/**
 * @description Localiza o bloco JSDoc imediatamente anterior à declaração informada.
 *
 * @param node - Declaração cuja documentação será consultada.
 * @param sourceFile - Arquivo TypeScript que contém a declaração.
 * @returns Conteúdo do JSDoc associado ou uma string vazia quando ausente.
 */
const getJsDoc = (node: ts.Node, sourceFile: ts.SourceFile): string => {
  const ranges = ts.getLeadingCommentRanges(sourceFile.text, node.getFullStart()) ?? [];
  const jsDoc = [...ranges]
    .reverse()
    .find((range) => sourceFile.text.slice(range.pos, range.end).startsWith("/**"));

  return jsDoc ? sourceFile.text.slice(jsDoc.pos, jsDoc.end) : "";
};

/**
 * @description Resolve a declaração que deve receber o JSDoc de uma função relevante de produção.
 *
 * @param node - Nó candidato encontrado durante a varredura da árvore sintática.
 * @param sourceFile - Arquivo TypeScript usado para reconhecer wrappers de hooks.
 * @returns Declaração documentável ou `null` quando o nó não representar uma função relevante.
 */
const getFunctionDocumentationTarget = (node: ts.Node, sourceFile: ts.SourceFile): ts.Node | null => {
  if (
    ts.isFunctionDeclaration(node)
    || ts.isMethodDeclaration(node)
    || ts.isConstructorDeclaration(node)
    || ts.isGetAccessorDeclaration(node)
    || ts.isSetAccessorDeclaration(node)
  ) return node;

  if (
    ts.isPropertyDeclaration(node)
    && node.initializer
    && (ts.isArrowFunction(node.initializer) || ts.isFunctionExpression(node.initializer))
  ) return node;

  if (ts.isVariableDeclaration(node) && node.initializer) {
    if (ts.isArrowFunction(node.initializer) || ts.isFunctionExpression(node.initializer)) {
      return node.parent.parent;
    }

    if (
      ts.isCallExpression(node.initializer)
      && /^(useCallback|useMemo)$/.test(node.initializer.expression.getText(sourceFile))
      && node.initializer.arguments.some((argument) => ts.isArrowFunction(argument) || ts.isFunctionExpression(argument))
    ) return node.parent.parent;
  }

  if (
    ts.isPropertyAssignment(node)
    && (ts.isArrowFunction(node.initializer) || ts.isFunctionExpression(node.initializer))
  ) return node;

  return null;
};

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

  it("documents every relevant production function with @description", () => {
    const missing = productionModules.flatMap(([path, source]) => {
      const sourceFile = ts.createSourceFile(path, source, ts.ScriptTarget.Latest, true, path.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
      const undocumented: string[] = [];
      const inspectedTargets = new Set<number>();

      const visit = (node: ts.Node): void => {
        const target = getFunctionDocumentationTarget(node, sourceFile);
        if (target && !inspectedTargets.has(target.pos)) {
          inspectedTargets.add(target.pos);
          const jsDoc = getJsDoc(target, sourceFile);
          if (!jsDoc.includes("@description")) {
            undocumented.push(`${path}:${sourceFile.getLineAndCharacterOfPosition(target.getStart(sourceFile)).line + 1}`);
          }
        }
        ts.forEachChild(node, visit);
      };

      visit(sourceFile);
      return undocumented;
    });

    expect(missing).toEqual([]);
  });

  it("uses @description in every production JSDoc block", () => {
    const missingDescriptions = productionModules.flatMap(([path, source]) =>
      [...source.matchAll(/\/\*\*[\s\S]*?\*\//g)]
        .filter((match) => !match[0].includes("@description"))
        .map((match) => `${path}:${source.slice(0, match.index).split(/\r?\n/).length}`),
    );

    expect(missingDescriptions).toEqual([]);
  });

  it("keeps TypeScript types out of JSDoc tags", () => {
    const redundantTypes = productionModules.flatMap(([path, source]) => {
      const matches = [...source.matchAll(/@(param|returns?|throws)\s+\{[^}\r\n]+\}/g)];
      return matches.map((match) => `${path}:${source.slice(0, match.index).split(/\r?\n/).length}`);
    });

    expect(redundantTypes).toEqual([]);
  });
});
