import path from "node:path";
import type { Rule } from "eslint";
import ruleMessagesJson from "./no-hardcoded-strings.messages.json" with {
  type: "json",
};
import type { Literal, Program } from "estree"; // eslint-disable-line n/no-missing-import -- módulo de tipos only
import { uniqueConstantName } from "../utils/constant-name.js";
import {
  getCrossFileLiteralIndex,
  r2NormalizedLiteralKey,
} from "../utils/r2-literal-index.js";
import {
  getR3ConstRegistry,
  stableConstNameForGroup,
} from "../utils/r3-const-registry.js";
import { writeR3PatchesToDataFiles } from "../utils/r3-write-data-files.js";
import {
  DEFAULT_OPTIONS,
  HCD_SECRET_PLACEHOLDER,
  buildFullFileR1Fix,
  effectiveRemediationMode,
  getInsertPositionAfterImports,
  getRelativePath,
  matchesSharedConstantsModule,
  isEnvDefaultLiteral,
  isExcludedByGlobs,
  isIncludedByGlobs,
  isLiteralIgnoredCallSite,
  isSecretEligibleForR1Remediation,
  looksLikeSecretCandidate,
  looksRiskyFilePath,
  normalizeNoHardcodedStringsOptions,
} from "./no-hardcoded-strings.rule-core.js";
import type { GroupInfo, LiteralWithParent, Occurrence } from "./no-hardcoded-strings.rule-core.js";

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
              "Glob do caminho relativo ao cwd do módulo/ficheiro partilhado de constantes (mensagem dedicada; futuro autofix R2).",
            type: "string",
          },
          crossFileDuplicateDetection: {
            description:
              "Se true, índice de literais entre ficheiros na mesma execução lintFiles e relatório hardcodedDuplicateCrossFile quando aplicável.",
            type: "boolean",
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
        crossFileDuplicateDetection:
          DEFAULT_OPTIONS.crossFileDuplicateDetection,
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
    messages: ruleMessagesJson as NonNullable<
      Rule.RuleModule["meta"]
    > extends { messages?: infer M }
      ? M
      : Record<string, string>,
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

        const crossFileIndex = options.crossFileDuplicateDetection
          ? getCrossFileLiteralIndex(context)
          : null;

        const intraDupOccurrences = new Set<Occurrence>();
        for (const g of groups) {
          if (g.occurrences.length > 1) {
            for (const o of g.occurrences) {
              intraDupOccurrences.add(o);
            }
          }
        }

        const inSharedConstantsPath = matchesSharedConstantsModule(
          relativePath,
          options.sharedConstantsModule,
        );

        const resolveMessageId = (
          occ: Occurrence,
        ):
          | "hardcoded"
          | "hardcodedEnvDefault"
          | "hardcodedDuplicateCrossFile"
          | "hardcodedDuplicateWithinFile"
          | "hardcodedInSharedConstantsModule" => {
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
          if (intraDupOccurrences.has(occ)) {
            return "hardcodedDuplicateWithinFile";
          }
          if (inSharedConstantsPath) {
            return "hardcodedInSharedConstantsModule";
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
