/**
 * Writers e merge determinístico para ficheiros de dados R3 (JSON / YAML).
 * Ver specs/plugin-contract.md — dataFileMergeStrategy.
 */

import { parse as parseYaml, stringify as stringifyYaml } from "yaml";

export type DataFileMergeStrategy = "merge-keys" | "fail-on-conflict";

export type MergePlainObjectResult =
  | { ok: true; merged: Record<string, unknown> }
  | {
      ok: false;
      conflictPath: string[];
      message: string;
    };

function isPlainObject(x: unknown): x is Record<string, unknown> {
  return typeof x === "object" && x !== null && !Array.isArray(x);
}

function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) {
    return true;
  }
  if (typeof a !== typeof b) {
    return false;
  }
  if (a === null || b === null) {
    return a === b;
  }
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) {
      return false;
    }
    return a.every((v, i) => deepEqual(v, b[i]!));
  }
  if (isPlainObject(a) && isPlainObject(b)) {
    const ka = Object.keys(a).sort();
    const kb = Object.keys(b).sort();
    if (ka.length !== kb.length) {
      return false;
    }
    return ka.every((k, i) => kb[i] === k && deepEqual(a[k], b[k]));
  }
  return false;
}

/**
 * Ordena chaves recursivamente para serialização JSON estável.
 */
export function sortKeysDeep(data: unknown): unknown {
  if (Array.isArray(data)) {
    return data.map(sortKeysDeep);
  }
  if (isPlainObject(data)) {
    const out: Record<string, unknown> = {};
    for (const k of Object.keys(data).sort()) {
      out[k] = sortKeysDeep(data[k]);
    }
    return out;
  }
  return data;
}

/**
 * JSON com indentação e chaves ordenadas (UTF-8; `\n` final).
 */
export function stableStringifyJson(data: unknown): string {
  return `${JSON.stringify(sortKeysDeep(data), null, 2)}\n`;
}

/**
 * Parse YAML para valor JS (mapas → objectos).
 */
export function parseYamlToJs(content: string): unknown {
  return parseYaml(content);
}

/**
 * Serialização YAML determinística (ordenação de chaves em mapas).
 */
export function stableStringifyYaml(data: unknown): string {
  return `${stringifyYaml(data, {
    sortMapEntries: true,
    lineWidth: 0,
  })}\n`;
}

/**
 * Fusão profunda de dois objectos planos aninhados.
 * - `merge-keys`: chaves novas são adicionadas; objectos aninhados fundem-se; folhas em conflito são substituídas pelo patch.
 * - `fail-on-conflict`: folhas ou vectores diferentes no mesmo caminho → erro.
 */
export function mergePlainObjectDeep(
  base: Record<string, unknown>,
  patch: Record<string, unknown>,
  strategy: DataFileMergeStrategy,
  path: string[] = [],
): MergePlainObjectResult {
  const merged: Record<string, unknown> = { ...base };
  const patchKeys = Object.keys(patch).sort();

  for (const key of patchKeys) {
    const pv = patch[key];
    if (!Object.prototype.hasOwnProperty.call(merged, key)) {
      merged[key] = pv;
      continue;
    }
    const bv = merged[key];
    if (isPlainObject(bv) && isPlainObject(pv)) {
      const sub = mergePlainObjectDeep(bv, pv, strategy, [...path, key]);
      if (!sub.ok) {
        return sub;
      }
      merged[key] = sub.merged;
      continue;
    }
    if (deepEqual(bv, pv)) {
      continue;
    }
    if (strategy === "merge-keys") {
      merged[key] = pv;
      continue;
    }
    return {
      ok: false,
      conflictPath: [...path, key],
      message: `Conflito de merge em "${[...path, key].join(".")}" com estratégia fail-on-conflict.`,
    };
  }

  return { ok: true, merged };
}

/**
 * Parse JSON com validação de objecto raiz (para merge R3).
 */
export function parseJsonRootObject(content: string): Record<string, unknown> | null {
  const trimmed = content.trim();
  if (trimmed.length === 0) {
    return {};
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(trimmed) as unknown;
  } catch {
    return null;
  }
  return isPlainObject(parsed) ? parsed : null;
}

/**
 * Parse YAML com validação de objecto raiz.
 */
export function parseYamlRootObject(content: string): Record<string, unknown> | null {
  const trimmed = content.trim();
  if (trimmed.length === 0) {
    return {};
  }
  let parsed: unknown;
  try {
    parsed = parseYaml(trimmed) as unknown;
  } catch {
    return null;
  }
  return isPlainObject(parsed) ? parsed : null;
}
