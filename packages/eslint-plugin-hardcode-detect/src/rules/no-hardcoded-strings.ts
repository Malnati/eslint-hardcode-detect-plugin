import path from "node:path";
import type { Rule } from "eslint";
import type { SourceCode } from "eslint";
// Tipos ESTree via `@types/estree` (resolução TypeScript; não é pacote runtime).
// eslint-disable-next-line n/no-missing-import -- módulo de tipos only
import type {
  CallExpression,
  Comment,
  Expression,
  Literal,
  Node,
  Program,
  Super,
} from "estree";
import { uniqueConstantName } from "../utils/constant-name.js";
import { globMatch } from "../utils/glob-match.js";
import {
  getCrossFileLiteralIndex,
  r2NormalizedLiteralKey,
} from "../utils/r2-literal-index.js";
import {
  getR3ConstRegistry,
  stableConstNameForGroup,
} from "../utils/r3-const-registry.js";
import type { DataFileMergeStrategy } from "../utils/r3-data-file-writers.js";
import { writeR3PatchesToDataFiles } from "../utils/r3-write-data-files.js";
import type { DataFileFormat } from "../utils/r3-write-data-files.js";

/** Opções públicas M1 (subset do contrato; R2/R3 reservados sem fix). */
export type RemediationMode = "off" | "r1" | "r2" | "r3" | "auto";

export type EnvDefaultLiteralPolicy = "include" | "report-separate" | "ignore";

export type LiteralIndexRebuildPolicy = "every-run";

export type ParallelLintingCompatibility =
  | "require-serial"
  | "documented-limitations";

export type SharedModuleImportStyle = "esm" | "cjs" | "project";

/** Valores alinhados a `secretRemediationMode` em `specs/plugin-contract.md`. */
export type SecretRemediationMode =
  | "suggest-only"
  | "placeholder-default"
  | "aggressive-autofix-opt-in";

/**
 * Valor injectado em `const NAME = "…"` quando o literal foi classificado como
 * segredo provável e `secretRemediationMode` é `placeholder-default`.
 * Não substitui documentação nem gestão de segredos em runtime.
 */
export const HCD_SECRET_PLACEHOLDER = "<HCD_SECRET_PLACEHOLDER>";

export type NoHardcodedStringsOptions = {
  remediationMode: RemediationMode;
  constantNamingConvention: "UPPER_SNAKE_CASE";
  dedupeWithinFile: boolean;
  remediationIncludeGlobs: string[];
  remediationExcludeGlobs: string[];
  envDefaultLiteralPolicy: EnvDefaultLiteralPolicy;
  /** R2 — destino do módulo partilhado (futuro autofix); opcional na detecção por índice. */
  sharedConstantsModule?: string;
  sharedModuleImportStyle: SharedModuleImportStyle;
  literalIndexRebuildPolicy: LiteralIndexRebuildPolicy;
  parallelLintingCompatibility: ParallelLintingCompatibility;
  /** R3 — formatos de ficheiro de dados permitidos para merge. */
  dataFileFormats: DataFileFormat[];
  /** R3 — caminhos relativos ao cwd e/ou globs (ver contrato). */
  dataFileTargets: string[];
  /** R3 — estratégia de merge com ficheiros existentes. */
  dataFileMergeStrategy: DataFileMergeStrategy;
  /** M4 — política de remediação para candidatos a segredo (heurística interna). */
  secretRemediationMode: SecretRemediationMode;
  /**
   * Não reportar literais que são primeiro argumento de chamadas cujo callee
   * coincide com uma entrada (formato `objeto.método` ou identificador simples).
   */
  callSiteExceptions: string[];
};

const DEFAULT_OPTIONS: NoHardcodedStringsOptions = {
  remediationMode: "off",
  constantNamingConvention: "UPPER_SNAKE_CASE",
  dedupeWithinFile: true,
  remediationIncludeGlobs: [],
  remediationExcludeGlobs: [],
  envDefaultLiteralPolicy: "include",
  secretRemediationMode: "suggest-only",
  sharedModuleImportStyle: "project",
  literalIndexRebuildPolicy: "every-run",
  parallelLintingCompatibility: "documented-limitations",
  dataFileFormats: ["json", "yaml"],
  dataFileTargets: [],
  dataFileMergeStrategy: "merge-keys",
  callSiteExceptions: [],
};

const ALLOWED_DATA_FILE_FORMATS = new Set<DataFileFormat>([
  "json",
  "yaml",
  "yml",
  "toml",
  "properties",
]);

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

  const sharedConstantsModule =
    typeof o.sharedConstantsModule === "string" && o.sharedConstantsModule.length > 0
      ? o.sharedConstantsModule
      : undefined;

  const sharedModuleImportStyle =
    o.sharedModuleImportStyle === "esm" ||
    o.sharedModuleImportStyle === "cjs" ||
    o.sharedModuleImportStyle === "project"
      ? o.sharedModuleImportStyle
      : DEFAULT_OPTIONS.sharedModuleImportStyle;

  const literalIndexRebuildPolicy =
    o.literalIndexRebuildPolicy === "every-run"
      ? o.literalIndexRebuildPolicy
      : DEFAULT_OPTIONS.literalIndexRebuildPolicy;

  const parallelLintingCompatibility =
    o.parallelLintingCompatibility === "require-serial" ||
    o.parallelLintingCompatibility === "documented-limitations"
      ? o.parallelLintingCompatibility
      : DEFAULT_OPTIONS.parallelLintingCompatibility;

  const dataFileFormatsRaw = Array.isArray(o.dataFileFormats)
    ? o.dataFileFormats
    : DEFAULT_OPTIONS.dataFileFormats;
  const dataFileFormats = dataFileFormatsRaw.filter((x): x is DataFileFormat =>
    typeof x === "string" && ALLOWED_DATA_FILE_FORMATS.has(x as DataFileFormat),
  );

  const dataFileTargets = Array.isArray(o.dataFileTargets)
    ? o.dataFileTargets.filter((x): x is string => typeof x === "string")
    : DEFAULT_OPTIONS.dataFileTargets;

  const dataFileMergeStrategy =
    o.dataFileMergeStrategy === "merge-keys" ||
    o.dataFileMergeStrategy === "fail-on-conflict"
      ? o.dataFileMergeStrategy
      : DEFAULT_OPTIONS.dataFileMergeStrategy;

  const secretRemediationMode =
    o.secretRemediationMode === "suggest-only" ||
    o.secretRemediationMode === "placeholder-default" ||
    o.secretRemediationMode === "aggressive-autofix-opt-in"
      ? o.secretRemediationMode
      : DEFAULT_OPTIONS.secretRemediationMode;

  const callSiteExceptions = Array.isArray(o.callSiteExceptions)
    ? o.callSiteExceptions
        .filter((x): x is string => typeof x === "string")
        .map((s) => s.trim())
        .filter((s) => s.length > 0)
    : DEFAULT_OPTIONS.callSiteExceptions;

  return {
    remediationMode,
    constantNamingConvention,
    dedupeWithinFile,
    remediationIncludeGlobs,
    remediationExcludeGlobs,
    envDefaultLiteralPolicy,
    sharedConstantsModule,
    sharedModuleImportStyle,
    literalIndexRebuildPolicy,
    parallelLintingCompatibility,
    dataFileFormats:
      dataFileFormats.length > 0 ? dataFileFormats : DEFAULT_OPTIONS.dataFileFormats,
    dataFileTargets,
    dataFileMergeStrategy,
    secretRemediationMode,
    callSiteExceptions,
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

/** Inclui o literal em autofix/suggest R1 quando é segredo provável e o modo o permite. */
function isSecretEligibleForR1Remediation(
  mode: SecretRemediationMode,
  value: string,
): boolean {
  if (!looksLikeSecretCandidate(value)) {
    return true;
  }
  return (
    mode === "placeholder-default" || mode === "aggressive-autofix-opt-in"
  );
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

/** Serializa callee para `console.log`, `debug`, `this.logger.warn`, etc.; `null` se não suportado. */
function stringifyCalleeExpression(node: Expression): string | null {
  if (node.type === "Identifier") {
    return node.name;
  }
  if (node.type === "ThisExpression") {
    return "this";
  }
  if (node.type === "ChainExpression") {
    return stringifyCalleeExpression(node.expression as Expression);
  }
  if (node.type === "MemberExpression" && !node.computed) {
    if (node.property.type !== "Identifier") {
      return null;
    }
    const left = stringifyCalleeExpression(node.object as Expression);
    if (left === null) {
      return null;
    }
    return `${left}.${node.property.name}`;
  }
  return null;
}

function stringifyCallCallee(callee: Expression | Super): string | null {
  if (callee.type === "Super") {
    return null;
  }
  return stringifyCalleeExpression(callee);
}

function isLiteralIgnoredCallSite(
  literal: LiteralWithParent,
  exceptionSet: ReadonlySet<string>,
): boolean {
  if (exceptionSet.size === 0) {
    return false;
  }
  const parent = literal.parent;
  if (!parent || parent.type !== "CallExpression") {
    return false;
  }
  const call = parent as CallExpression;
  if (call.arguments[0] !== literal) {
    return false;
  }
  const name = stringifyCallCallee(call.callee);
  if (!name) {
    return false;
  }
  return exceptionSet.has(name);
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
  /** Valor na declaração `const` (placeholder para segredo + `placeholder-default`). */
  remediationValue: string;
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
      value: g.remediationValue,
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
          sharedConstantsModule: {
            description:
              "Caminho ou padrão do módulo partilhado para constantes R2 (futuro autofix).",
            type: "string",
          },
          sharedModuleImportStyle: {
            description: "Estilo de import ao referenciar sharedConstantsModule.",
            enum: ["esm", "cjs", "project"],
          },
          literalIndexRebuildPolicy: {
            description:
              "Política de reconstrução do índice de literais R2 (hoje só every-run).",
            enum: ["every-run"],
          },
          parallelLintingCompatibility: {
            description:
              "Compatibilidade com lint paralelo ESLint; ver documentação da regra e ADR.",
            enum: ["require-serial", "documented-limitations"],
          },
          dataFileFormats: {
            description:
              "R3: formatos de ficheiros de dados permitidos para merge (extensão vs lista).",
            type: "array",
            items: {
              enum: ["json", "yaml", "yml", "toml", "properties"],
            },
          },
          dataFileTargets: {
            description:
              "R3: caminhos relativos ao cwd do ESLint e/ou globs de ficheiros de dados.",
            type: "array",
            items: { type: "string" },
          },
          dataFileMergeStrategy: {
            description:
              "R3: merge com ficheiros existentes (merge-keys ou falha em conflito).",
            enum: ["merge-keys", "fail-on-conflict"],
          },
          secretRemediationMode: {
            description:
              "M4: candidatos a segredo — suggest-only (sem copiar valor), placeholder-default (const com sentinel), aggressive-autofix-opt-in (copia literal; R3 nunca grava segredos em ficheiros de dados).",
            enum: [
              "suggest-only",
              "placeholder-default",
              "aggressive-autofix-opt-in",
            ],
          },
          callSiteExceptions: {
            description:
              "Lista de callees (objeto.metodo ou identificador): ignorar literal string no primeiro argumento.",
            type: "array",
            items: { type: "string" },
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
        sharedModuleImportStyle: DEFAULT_OPTIONS.sharedModuleImportStyle,
        literalIndexRebuildPolicy: DEFAULT_OPTIONS.literalIndexRebuildPolicy,
        parallelLintingCompatibility:
          DEFAULT_OPTIONS.parallelLintingCompatibility,
        dataFileFormats: DEFAULT_OPTIONS.dataFileFormats,
        dataFileTargets: DEFAULT_OPTIONS.dataFileTargets,
        dataFileMergeStrategy: DEFAULT_OPTIONS.dataFileMergeStrategy,
        secretRemediationMode: DEFAULT_OPTIONS.secretRemediationMode,
        callSiteExceptions: DEFAULT_OPTIONS.callSiteExceptions,
      },
    ],
    fixable: "code",
    hasSuggestions: true,
    messages: {
      hardcoded:
        "[HCD-ERR-SENIOR] Literal de string hardcoded detectado no código.\n[HCD-ERR-FIX] Extraia para constante, catálogo ou mecanismo de configuração apropriado.\n[HCD-ERR-OPS] Enquanto a correção definitiva não entra, rastreie e documente ocorrências para evitar novas cópias.",
      hardcodedEnvDefault:
        "[HCD-ERR-SENIOR] Literal hardcoded usado como fallback de process.env (?? ou ||).\n[HCD-ERR-FIX] Mova o fallback para constante/catálogo e padronize a leitura de configuração.\n[HCD-ERR-OPS] Até corrigir, mantenha o fallback explicitamente documentado e sob revisão.",
      hardcodedDuplicateCrossFile:
        "[HCD-ERR-SENIOR] Mesmo valor normalizado já apareceu noutro ficheiro no mesmo lint (trilha R2).\n[HCD-ERR-FIX] Centralize em módulo partilhado ou catálogo único para eliminar duplicação.\n[HCD-ERR-OPS] Como contorno, rastreie os pontos duplicados e evite introduzir novos até a centralização.",
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

    const r3Reg =
      options.remediationMode === "r3" ? getR3ConstRegistry(context) : null;

    const excludedRemediation = isExcludedByGlobs(
      relativePath,
      options.remediationExcludeGlobs,
    );
    const includedRemediation = isIncludedByGlobs(
      relativePath,
      options.remediationIncludeGlobs,
    );

    const occurrences: Occurrence[] = [];
    const callSiteExceptionSet = new Set(options.callSiteExceptions);

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

        if (
          isLiteralIgnoredCallSite(node as LiteralWithParent, callSiteExceptionSet)
        ) {
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
          const rawVal = ocs[0].value;
          const constName = r3Reg
            ? stableConstNameForGroup(
                ocs[0].value,
                ocs[0].isEnvDefault,
                r3Reg,
              )
            : uniqueConstantName(ocs[0].value, usedNames);
          const isSec = looksLikeSecretCandidate(rawVal);
          let remediationValue = rawVal;
          if (isSec && options.secretRemediationMode === "placeholder-default") {
            remediationValue = HCD_SECRET_PLACEHOLDER;
          }
          groups.push({
            key,
            occurrences: ocs,
            constName,
            remediationValue,
          });
        }

        const replaceTargets: { node: Literal; constName: string }[] = [];
        for (const g of groups) {
          for (const occ of g.occurrences) {
            replaceTargets.push({ node: occ.node, constName: g.constName });
          }
        }

        const replaceTargetsSafe = replaceTargets.filter((t) =>
          isSecretEligibleForR1Remediation(
            options.secretRemediationMode,
            t.node.value as string,
          ),
        );
        const groupsSafe = groups.filter((g) =>
          isSecretEligibleForR1Remediation(
            options.secretRemediationMode,
            g.occurrences[0].value,
          ),
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

        const crossFileIndex =
          options.remediationMode === "r2"
            ? getCrossFileLiteralIndex(context)
            : null;

        const resolveMessageId = (
          occ: Occurrence,
        ):
          | "hardcoded"
          | "hardcodedEnvDefault"
          | "hardcodedDuplicateCrossFile" => {
          if (crossFileIndex) {
            const normKey = r2NormalizedLiteralKey(occ.value, occ.isEnvDefault);
            const filesFor = crossFileIndex.get(normKey);
            const cross =
              filesFor !== undefined &&
              [...filesFor].some((p) => p !== relativePath);
            if (cross) {
              return "hardcodedDuplicateCrossFile";
            }
          }
          if (
            occ.isEnvDefault &&
            options.envDefaultLiteralPolicy === "report-separate"
          ) {
            return "hardcodedEnvDefault";
          }
          return "hardcoded";
        };

        for (let i = 0; i < occurrences.length; i++) {
          const occ = occurrences[i];
          const messageId = resolveMessageId(occ);

          const secret = looksLikeSecretCandidate(occ.value);
          const secretBlocksAutofix =
            secret && options.secretRemediationMode === "suggest-only";
          const riskyPath = looksRiskyFilePath(relativePath);
          const noAutofixContext =
            !r1Active ||
            !includedRemediation ||
            excludedRemediation ||
            secretBlocksAutofix ||
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

        if (crossFileIndex) {
          const keys = new Set(
            occurrences.map((o) =>
              r2NormalizedLiteralKey(o.value, o.isEnvDefault),
            ),
          );
          for (const k of keys) {
            if (!crossFileIndex.has(k)) {
              crossFileIndex.set(k, new Set());
            }
            crossFileIndex.get(k)!.add(relativePath);
          }
        }

        const r3Eligible =
          options.remediationMode === "r3" &&
          options.dataFileTargets.length > 0 &&
          includedRemediation &&
          !excludedRemediation &&
          !looksRiskyFilePath(relativePath);

        const groupsR3DataWrite = groups.filter(
          (g) => !looksLikeSecretCandidate(g.occurrences[0].value),
        );

        if (r3Eligible && groupsR3DataWrite.length > 0) {
          const strings: Record<string, string> = {};
          for (const g of groupsR3DataWrite) {
            strings[g.constName] = g.occurrences[0]!.value;
          }
          writeR3PatchesToDataFiles({
            cwd,
            dataFileFormats: options.dataFileFormats,
            dataFileTargets: options.dataFileTargets,
            dataFileMergeStrategy: options.dataFileMergeStrategy,
            patch: { hardcodeDetect: { strings } },
          });
        }
      },
    };
  },
};

export default rule;
