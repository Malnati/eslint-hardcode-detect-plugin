import path from "node:path";
import type { Rule } from "eslint";
import type { SourceCode } from "eslint";
// Tipos ESTree via `@types/estree` (resolução TypeScript; não é pacote runtime).
import type {
  CallExpression,
  Comment,
  Expression,
  Literal,
  Node,
  Program,
  Super,
} from "estree"; // eslint-disable-line n/no-missing-import -- módulo de tipos only
import { globMatch } from "../utils/glob-match.js";
import type { DataFileMergeStrategy } from "../utils/r3-data-file-writers.js";
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

export const DEFAULT_OPTIONS: NoHardcodedStringsOptions = {
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
export function effectiveRemediationMode(mode: RemediationMode): "off" | "r1" {
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

export function getRelativePath(filename: string, cwd: string): string {
  const rel = path.relative(cwd, filename);
  return rel.split(path.sep).join("/");
}

export function isExcludedByGlobs(
  relativePath: string,
  patterns: string[],
): boolean {
  return patterns.some((p) => globMatch(relativePath, p));
}

export function isIncludedByGlobs(
  relativePath: string,
  patterns: string[],
): boolean {
  if (patterns.length === 0) {
    return true;
  }
  return patterns.some((p) => globMatch(relativePath, p));
}

export function looksRiskyFilePath(relativePath: string): boolean {
  const lower = relativePath.toLowerCase();
  return (
    lower.includes("/__tests__/") ||
    lower.includes("/test/") ||
    lower.includes(".test.") ||
    lower.includes(".spec.") ||
    lower.includes(".i18n.")
  );
}

export function looksLikeSecretCandidate(value: string): boolean {
  if (value.length < 24) {
    return false;
  }
  return /^[A-Za-z0-9+/=_-]+$/.test(value);
}

/** Inclui o literal em autofix/suggest R1 quando é segredo provável e o modo o permite. */
export function isSecretEligibleForR1Remediation(
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

export type LiteralWithParent = Literal & { parent?: Node };

export function isEnvDefaultLiteral(node: LiteralWithParent): boolean {
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

export function isLiteralIgnoredCallSite(
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

export function getInsertPositionAfterImports(
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

export type Occurrence = {
  node: Literal;
  value: string;
  isEnvDefault: boolean;
};

export type GroupInfo = {
  key: string;
  occurrences: Occurrence[];
  constName: string;
  /** Valor na declaração `const` (placeholder para segredo + `placeholder-default`). */
  remediationValue: string;
};

export function buildFullFileR1Fix(
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
