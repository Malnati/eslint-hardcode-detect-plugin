/**
 * Registo de nomes de chave R3 estáveis entre ficheiros (via settings.hardcodeDetect).
 */

import type { Rule } from "eslint";
import { uniqueConstantName } from "./constant-name.js";
import { r2NormalizedLiteralKey } from "./r2-literal-index.js";

const SETTINGS_BAG = "hardcodeDetect";

export type R3ConstRegistry = {
  byLiteralKey: Map<string, string>;
  usedNames: Set<string>;
};

export function getR3ConstRegistry(context: Rule.RuleContext): R3ConstRegistry {
  const settings = context.settings as Record<string, unknown> | undefined;
  if (!settings || typeof settings !== "object") {
    return { byLiteralKey: new Map(), usedNames: new Set() };
  }
  try {
    const bag = (settings[SETTINGS_BAG] ??= {}) as Record<string, unknown>;
    if (!(bag.r3ConstByLiteralKey instanceof Map)) {
      bag.r3ConstByLiteralKey = new Map<string, string>();
    }
    if (!(bag.r3UsedConstNames instanceof Set)) {
      bag.r3UsedConstNames = new Set<string>();
    }
    return {
      byLiteralKey: bag.r3ConstByLiteralKey as Map<string, string>,
      usedNames: bag.r3UsedConstNames as Set<string>,
    };
  } catch {
    return { byLiteralKey: new Map(), usedNames: new Set() };
  }
}

export function stableConstNameForGroup(
  value: string,
  isEnvDefault: boolean,
  reg: R3ConstRegistry,
): string {
  const k = r2NormalizedLiteralKey(value, isEnvDefault);
  const existing = reg.byLiteralKey.get(k);
  if (existing) {
    return existing;
  }
  const name = uniqueConstantName(value, reg.usedNames);
  reg.byLiteralKey.set(k, name);
  return name;
}
