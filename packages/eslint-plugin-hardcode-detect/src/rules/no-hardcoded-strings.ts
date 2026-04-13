import path from "node:path";
import type { Rule } from "eslint";
import type { SourceCode } from "eslint";
// Tipos ESTree via `@types/estree` (resolução TypeScript; não é pacote runtime).
// eslint-disable-next-line n/no-missing-import -- módulo de tipos only
import type { Comment, Literal, Node, Program } from "estree";
import { uniqueConstantName } from "../utils/constant-name.js";
import { globMatch } from "../utils/glob-match.js";

/** Opções públicas M1 (subset do contrato; R2/R3 reservados sem fix). */
export type RemediationMode = "off" | "r1" | "r2" | "r3" | "auto";

export type EnvDefaultLiteralPolicy = "include" | "report-separate" | "ignore";

export type NoHardcodedStringsOptions = {
  remediationMode: RemediationMode;
  constantNamingConvention: "UPPER_SNAKE_CASE";
  dedupeWithinFile: boolean;
  remediationIncludeGlobs: string[];
  remediationExcludeGlobs: string[];
  envDefaultLiteralPolicy: EnvDefaultLiteralPolicy;
};

const DEFAULT_OPTIONS: NoHardcodedStringsOptions = {
  remediationMode: "off",
  constantNamingConvention: "UPPER_SNAKE_CASE",
  dedupeWithinFile: true,
  remediationIncludeGlobs: [],
  remediationExcludeGlobs: [],
  envDefaultLiteralPolicy: "include",
};

export function normalizeNoHardcodedStringsOptions(
  raw: unknown,
): NoHardcodedStringsOptions {
  if (raw === undefined || raw === null) {
    return { ...DEFAULT_OPTIONS };
  }
  if (typeof raw !== "object" || Array.isArray(raw)) {
    return { ...DEFAULT_OPTIONS };
  }
  const o = raw as Record<string, unknown>;
  const remediationMode =
    o.remediationMode === "off" ||
    o.remediationMode === "r1" ||
    o.remediationMode === "r2" ||
    o.remediationMode === "r3" ||
    o.remediationMode === "auto"
      ? o.remediationMode
      : DEFAULT_OPTIONS.remediationMode;
  const constantNamingConvention =
    o.constantNamingConvention === "UPPER_SNAKE_CASE"
      ? "UPPER_SNAKE_CASE"
      : DEFAULT_OPTIONS.constantNamingConvention;
  const dedupeWithinFile =
    typeof o.dedupeWithinFile === "boolean"
      ? o.dedupeWithinFile
      : DEFAULT_OPTIONS.dedupeWithinFile;
  const remediationIncludeGlobs = Array.isArray(o.remediationIncludeGlobs)
    ? o.remediationIncludeGlobs.filter((x): x is string => typeof x === "string")
    : DEFAULT_OPTIONS.remediationIncludeGlobs;
  const remediationExcludeGlobs = Array.isArray(o.remediationExcludeGlobs)
    ? o.remediationExcludeGlobs.filter((x): x is string => typeof x === "string")
    : DEFAULT_OPTIONS.remediationExcludeGlobs;
  const envDefaultLiteralPolicy =
    o.envDefaultLiteralPolicy === "include" ||
    o.envDefaultLiteralPolicy === "report-separate" ||
    o.envDefaultLiteralPolicy === "ignore"
      ? o.envDefaultLiteralPolicy
      : DEFAULT_OPTIONS.envDefaultLiteralPolicy;

  return {
    remediationMode,
    constantNamingConvention,
    dedupeWithinFile,
    remediationIncludeGlobs,
    remediationExcludeGlobs,
    envDefaultLiteralPolicy,
  };
}

/** R2/R3 ainda sem fix: sem remediação automática. */
function effectiveRemediationMode(mode: RemediationMode): "off" | "r1" {
  if (mode === "r2" || mode === "r3") {
    return "off";
  }
  if (mode === "auto") {
    return "r1";
  }
  if (mode === "r1") {
    return "r1";
  }
  return "off";
}

function getRelativePath(filename: string, cwd: string): string {
  const rel = path.relative(cwd, filename);
  return rel.split(path.sep).join("/");
}

function isExcludedByGlobs(
  relativePath: string,
  patterns: string[],
): boolean {
  return patterns.some((p) => globMatch(relativePath, p));
}

function isIncludedByGlobs(
  relativePath: string,
  patterns: string[],
): boolean {
  if (patterns.length === 0) {
    return true;
  }
  return patterns.some((p) => globMatch(relativePath, p));
}

function looksRiskyFilePath(relativePath: string): boolean {
  const lower = relativePath.toLowerCase();
  return (
    lower.includes("/__tests__/") ||
    lower.includes("/test/") ||
    lower.includes(".test.") ||
    lower.includes(".spec.") ||
    lower.includes(".i18n.")
  );
}

function looksLikeSecretCandidate(value: string): boolean {
  if (value.length < 24) {
    return false;
  }
  return /^[A-Za-z0-9+/=_-]+$/.test(value);
}

function containsProcessEnvReference(node: Node | null | undefined): boolean {
  if (!node) {
    return false;
  }
  if (node.type === "MemberExpression") {
    const obj = node.object;
    if (
      !node.computed &&
      obj.type === "MemberExpression" &&
      !obj.computed &&
      obj.object.type === "Identifier" &&
      obj.object.name === "process" &&
      obj.property.type === "Identifier" &&
      obj.property.name === "env"
    ) {
      return true;
    }
  }
  if (node.type === "ChainExpression") {
    return containsProcessEnvReference(node.expression);
  }
  if (node.type === "LogicalExpression") {
    return (
      containsProcessEnvReference(node.left) ||
      containsProcessEnvReference(node.right)
    );
  }
  return false;
}

type LiteralWithParent = Literal & { parent?: Node };

function isEnvDefaultLiteral(node: LiteralWithParent): boolean {
  const parent = node.parent;
  if (!parent) {
    return false;
  }
  if (parent.type === "LogicalExpression") {
    const op = parent.operator;
    if (op !== "??" && op !== "||") {
      return false;
    }
    if (parent.right !== node) {
      return false;
    }
    return containsProcessEnvReference(parent.left);
  }
  return false;
}

function getInsertPositionAfterImports(
  program: Program,
  sourceCode: SourceCode,
): number {
  const body = program.body;
  let lastImportEnd = program.range?.[0] ?? 0;
  let sawImport = false;
  for (const stmt of body) {
    if (stmt.type === "ImportDeclaration") {
      sawImport = true;
      lastImportEnd = stmt.range?.[1] ?? lastImportEnd;
    } else if (sawImport) {
      break;
    }
  }
  if (sawImport) {
    return lastImportEnd;
  }
  const first = body[0];
  if (first?.range) {
    let pos = first.range[0];
    const comments = sourceCode.getCommentsBefore(first) as Comment[];
    if (comments.length > 0 && comments[0].range) {
      pos = comments[0].range[0];
    }
    return pos;
  }
  return program.range?.[0] ?? 0;
}

type Occurrence = {
  node: Literal;
  value: string;
  isEnvDefault: boolean;
};

type GroupInfo = {
  key: string;
  occurrences: Occurrence[];
  constName: string;
};

function buildFullFileR1Fix(
  fixer: Rule.RuleFixer,
  sourceCode: SourceCode,
  program: Program,
  groups: GroupInfo[],
  replaceTargets: { node: Literal; constName: string }[],
  insertPos: number,
): Rule.Fix | Iterable<Rule.Fix> | null {
  const decls = groups
    .map((g) => ({
      name: g.constName,
      value: g.occurrences[0].value,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  const text = sourceCode.text;
  const needsNlBefore =
    insertPos > 0 && text[insertPos - 1] !== "\n" && text[insertPos - 1] !== "\r";
  const lines = decls.map(
    (d) => `const ${d.name} = ${JSON.stringify(d.value)};`,
  );
  const prefix = needsNlBefore ? "\n" : "";
  const insertion = `${prefix}${lines.join("\n")}\n`;

  const edits: Rule.Fix[] = [];
  edits.push(fixer.insertTextAfterRange([insertPos, insertPos], insertion));

  const sortedReplace = [...replaceTargets].sort(
    (a, b) => (b.node.range?.[0] ?? 0) - (a.node.range?.[0] ?? 0),
  );
  for (const { node, constName } of sortedReplace) {
    const start = node.range?.[0] ?? 0;
    const end = node.range?.[1] ?? 0;
    edits.push(fixer.replaceTextRange([start, end], constName));
  }

  return edits;
}

const rule: Rule.RuleModule = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Desencorajar literais de string hardcoded (exceto strings triviais muito curtas).",
      url: "https://github.com/malnati/eslint-hardcode-detect-plugin/blob/main/specs/plugin-contract.md",
    },
    schema: [
      {
        type: "object",
        description:
          "Remediação assistida (R1 no mesmo ficheiro) e política de literais de fallback de process.env.",
        properties: {
          remediationMode: {
            description:
              "Trilha de remediação: off (só detecção), r1 (constantes no topo do ficheiro), r2/r3 reservados, auto (r1).",
            enum: ["off", "r1", "r2", "r3", "auto"],
          },
          constantNamingConvention: {
            description:
              "Convenção para nomes de constantes injectadas (extensível no contrato).",
            enum: ["UPPER_SNAKE_CASE"],
          },
          dedupeWithinFile: {
            description:
              "Se true, um identificador por valor normalizado no mesmo ficheiro.",
            type: "boolean",
          },
          remediationIncludeGlobs: {
            description:
              "Se não vazio, só estes caminhos (relativos ao cwd) recebem autofix R1.",
            type: "array",
            items: {
              description: "Padrão glob de caminho relativo.",
              type: "string",
            },
          },
          remediationExcludeGlobs: {
            description:
              "Caminhos que casam não recebem autofix R1 (ex.: i18n, testes).",
            type: "array",
            items: {
              description: "Padrão glob de caminho relativo.",
              type: "string",
            },
          },
          envDefaultLiteralPolicy: {
            description:
              "Tratamento do literal à direita de process.env ?? ou ||.",
            enum: ["include", "report-separate", "ignore"],
          },
        },
        additionalProperties: false,
      },
    ],
    defaultOptions: [
      {
        remediationMode: DEFAULT_OPTIONS.remediationMode,
        constantNamingConvention: DEFAULT_OPTIONS.constantNamingConvention,
        dedupeWithinFile: DEFAULT_OPTIONS.dedupeWithinFile,
        remediationIncludeGlobs: DEFAULT_OPTIONS.remediationIncludeGlobs,
        remediationExcludeGlobs: DEFAULT_OPTIONS.remediationExcludeGlobs,
        envDefaultLiteralPolicy: DEFAULT_OPTIONS.envDefaultLiteralPolicy,
      },
    ],
    fixable: "code",
    hasSuggestions: true,
    messages: {
      hardcoded:
        "Evite string literal hardcoded; prefira constantes ou catálogo de mensagens.",
      hardcodedEnvDefault:
        "Literal de fallback de process.env (?? ou ||); prefira constantes ou catálogo de mensagens.",
    },
  },

  create(context) {
    const options = normalizeNoHardcodedStringsOptions(
      context.options[0] as unknown,
    );
    const cwd = context.cwd ?? process.cwd();
    const filename = context.filename ?? path.join(cwd, "unknown");
    const relativePath = getRelativePath(filename, cwd);

    const effMode = effectiveRemediationMode(options.remediationMode);
    const r1Active = effMode === "r1";

    const excludedRemediation = isExcludedByGlobs(
      relativePath,
      options.remediationExcludeGlobs,
    );
    const includedRemediation = isIncludedByGlobs(
      relativePath,
      options.remediationIncludeGlobs,
    );

    const occurrences: Occurrence[] = [];

    return {
      Literal(node: Literal) {
        if (typeof node.value !== "string") {
          return;
        }
        if (node.value.length < 2) {
          return;
        }

        const isEnvDefault = isEnvDefaultLiteral(node as LiteralWithParent);
        if (isEnvDefault && options.envDefaultLiteralPolicy === "ignore") {
          return;
        }

        occurrences.push({ node, value: node.value, isEnvDefault });
      },

      "Program:exit"(program: Program) {
        const sourceCode = context.getSourceCode();
        const usedNames = new Set<string>();

        const groupKeys: string[] = [];
        const groupOcc = new Map<string, Occurrence[]>();

        for (let i = 0; i < occurrences.length; i++) {
          const occ = occurrences[i];
          const key = options.dedupeWithinFile
            ? `${occ.value}\0${occ.isEnvDefault}`
            : `${occ.value}\0${occ.isEnvDefault}\0${i}`;
          if (!groupOcc.has(key)) {
            groupOcc.set(key, []);
            groupKeys.push(key);
          }
          groupOcc.get(key)!.push(occ);
        }

        const groups: GroupInfo[] = [];
        for (const key of groupKeys) {
          const ocs = groupOcc.get(key)!;
          const constName = uniqueConstantName(ocs[0].value, usedNames);
          groups.push({ key, occurrences: ocs, constName });
        }

        const replaceTargets: { node: Literal; constName: string }[] = [];
        for (const g of groups) {
          for (const occ of g.occurrences) {
            replaceTargets.push({ node: occ.node, constName: g.constName });
          }
        }

        const replaceTargetsSafe = replaceTargets.filter(
          (t) => !looksLikeSecretCandidate(t.node.value as string),
        );
        const groupsSafe = groups.filter(
          (g) => !looksLikeSecretCandidate(g.occurrences[0].value),
        );

        let firstFixNode: Literal | null = null;
        if (
          r1Active &&
          includedRemediation &&
          !excludedRemediation &&
          replaceTargetsSafe.length > 0 &&
          !looksRiskyFilePath(relativePath)
        ) {
          const sorted = [...replaceTargetsSafe].sort(
            (a, b) => (a.node.range?.[0] ?? 0) - (b.node.range?.[0] ?? 0),
          );
          firstFixNode = sorted[0]!.node;
        }

        const insertPos = getInsertPositionAfterImports(program, sourceCode);

        for (let i = 0; i < occurrences.length; i++) {
          const occ = occurrences[i];
          const messageId =
            occ.isEnvDefault &&
            options.envDefaultLiteralPolicy === "report-separate"
              ? "hardcodedEnvDefault"
              : "hardcoded";

          const secret = looksLikeSecretCandidate(occ.value);
          const riskyPath = looksRiskyFilePath(relativePath);
          const noAutofixContext =
            !r1Active ||
            !includedRemediation ||
            excludedRemediation ||
            secret ||
            riskyPath;

          if (noAutofixContext) {
            const suggest =
              r1Active && occ.node && replaceTargetsSafe.length > 0
                ? [
                    {
                      desc: "Extrair para constante no topo do ficheiro",
                      fix(fixer: Rule.RuleFixer) {
                        return buildFullFileR1Fix(
                          fixer,
                          sourceCode,
                          program,
                          groupsSafe,
                          replaceTargetsSafe,
                          insertPos,
                        );
                      },
                    },
                  ]
                : undefined;

            context.report({
              node: occ.node,
              messageId,
              ...(suggest ? { suggest } : {}),
            });
            continue;
          }

          const fix =
            firstFixNode === occ.node
              ? (fixer: Rule.RuleFixer) =>
                  buildFullFileR1Fix(
                    fixer,
                    sourceCode,
                    program,
                    groupsSafe,
                    replaceTargetsSafe,
                    insertPos,
                  )
              : undefined;

          context.report({
            node: occ.node,
            messageId,
            ...(fix ? { fix } : {}),
          });
        }
      },
    };
  },
};

export default rule;
