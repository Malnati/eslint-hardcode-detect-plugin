import type { Rule } from "eslint";

/** Chave de equivalência R2: mesmo valor de string + mesma classificação de fallback de ambiente que em R1. */
export function r2NormalizedLiteralKey(value: string, isEnvDefault: boolean): string {
  return `${value}\0${isEnvDefault ? "1" : "0"}`;
}

const SETTINGS_BAG = "hardcodeDetect";

export type CrossFileLiteralIndex = Map<string, Set<string>>;

/**
 * Índice partilhado no âmbito da execução ESLint, via `context.settings` (objecto mutável
 * injectado pelo config recomendado ou pelo projecto). Fallback em memória de módulo
 * quando `settings` não é extensível.
 */
export function getCrossFileLiteralIndex(
  context: Rule.RuleContext,
): CrossFileLiteralIndex {
  const settings = context.settings as Record<string, unknown> | undefined;
  if (settings && typeof settings === "object") {
    try {
      const bag = (settings[SETTINGS_BAG] ??= {}) as Record<string, unknown>;
      if (!(bag.r2LiteralIndex instanceof Map)) {
        bag.r2LiteralIndex = new Map<string, Set<string>>();
      }
      return bag.r2LiteralIndex as CrossFileLiteralIndex;
    } catch {
      // settings pode ser selado
    }
  }
  return getFallbackCrossFileIndex(context);
}

const fallbackByCwd = new Map<string, CrossFileLiteralIndex>();

function getFallbackCrossFileIndex(context: Rule.RuleContext): CrossFileLiteralIndex {
  const cwd = context.cwd ?? process.cwd();
  let m = fallbackByCwd.get(cwd);
  if (!m) {
    m = new Map<string, Set<string>>();
    fallbackByCwd.set(cwd, m);
  }
  return m;
}

/** Apenas testes / diagnóstico: limpa o fallback por cwd. */
export function __resetR2FallbackIndexForTests(cwd: string): void {
  fallbackByCwd.delete(cwd);
}
