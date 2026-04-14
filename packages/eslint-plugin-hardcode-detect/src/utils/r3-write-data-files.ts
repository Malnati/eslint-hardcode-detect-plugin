/**
 * Escrita em disco para remediação R3 (merge em JSON/YAML).
 */

import fs from "node:fs";
import path from "node:path";
import type { DataFileMergeStrategy } from "./r3-data-file-writers.js";
import {
  mergePlainObjectDeep,
  parseJsonRootObject,
  parseYamlRootObject,
  stableStringifyJson,
  stableStringifyYaml,
} from "./r3-data-file-writers.js";
import { resolveDataFileTargetPaths } from "./r3-resolve-targets.js";

export type DataFileFormat = "json" | "yaml" | "yml" | "toml" | "properties";

function formatForPath(filePath: string): DataFileFormat | null {
  const lower = filePath.toLowerCase();
  if (lower.endsWith(".json")) {
    return "json";
  }
  if (lower.endsWith(".yaml") || lower.endsWith(".yml")) {
    return "yaml";
  }
  if (lower.endsWith(".toml")) {
    return "toml";
  }
  if (lower.endsWith(".properties")) {
    return "properties";
  }
  return null;
}

function formatAllowed(
  fmt: DataFileFormat,
  allowed: DataFileFormat[],
): boolean {
  if (allowed.includes(fmt)) {
    return true;
  }
  if (fmt === "yaml") {
    return allowed.includes("yml") || allowed.includes("yaml");
  }
  return false;
}

/**
 * Funde `patch` em cada ficheiro alvo permitido pelo formato e pela lista `dataFileFormats`.
 * TOML e `.properties` não são escritos nesta versão (MVP JSON/YAML).
 */
export function writeR3PatchesToDataFiles(opts: {
  cwd: string;
  dataFileFormats: DataFileFormat[];
  dataFileTargets: string[];
  dataFileMergeStrategy: DataFileMergeStrategy;
  patch: Record<string, unknown>;
}): void {
  const paths = resolveDataFileTargetPaths(opts.cwd, opts.dataFileTargets);
  for (const abs of paths) {
    const fmt = formatForPath(abs);
    if (fmt === null) {
      continue;
    }
    if (!formatAllowed(fmt, opts.dataFileFormats)) {
      continue;
    }
    if (fmt === "toml" || fmt === "properties") {
      continue;
    }

    let base: Record<string, unknown> = {};
    if (fs.existsSync(abs)) {
      const text = fs.readFileSync(abs, "utf8");
      const parsed =
        fmt === "json" ? parseJsonRootObject(text) : parseYamlRootObject(text);
      if (parsed === null) {
        continue;
      }
      base = parsed;
    }

    const mergedResult = mergePlainObjectDeep(
      base,
      opts.patch,
      opts.dataFileMergeStrategy,
    );
    if (!mergedResult.ok) {
      continue;
    }

    const outText =
      fmt === "json"
        ? stableStringifyJson(mergedResult.merged)
        : stableStringifyYaml(mergedResult.merged);

    fs.mkdirSync(path.dirname(abs), { recursive: true });
    fs.writeFileSync(abs, outText, "utf8");
  }
}
