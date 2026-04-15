/**
 * Ponto de entrada do plugin publicável.
 * Comportamento das regras: ver ../../../specs/plugin-contract.md
 */

import { readFileSync } from "node:fs";
import noHardcodedStrings from "./rules/no-hardcoded-strings.js";

const pkg = JSON.parse(
  readFileSync(new URL("../package.json", import.meta.url), "utf8"),
) as { name: string; version: string };

const plugin = {
  meta: {
    name: pkg.name,
    version: pkg.version,
    namespace: "hardcode-detect",
  },
  configs: {} as Record<string, unknown>,
  rules: {
    "no-hardcoded-strings": noHardcodedStrings,
  },
};

Object.assign(plugin.configs, {
  recommended: [
    {
      name: "hardcode-detect/recommended",
      plugins: {
        "hardcode-detect": plugin,
      },
      settings: {
        // Objecto mutável partilhado entre ficheiros na mesma invocação lintFiles (índice R2).
        hardcodeDetect: {},
      },
      rules: {
        "hardcode-detect/no-hardcoded-strings": "warn",
      },
    },
  ],
});

export const rules = plugin.rules;
export default plugin;

export {
  mergePlainObjectDeep,
  parseJsonRootObject,
  parseYamlRootObject,
  parseYamlToJs,
  sortKeysDeep,
  stableStringifyJson,
  stableStringifyYaml,
} from "./utils/r3-data-file-writers.js";
export type {
  DataFileMergeStrategy,
  MergePlainObjectResult,
} from "./utils/r3-data-file-writers.js";
export type {
  NoHardcodedStringsOptions,
  SecretRemediationMode,
} from "./rules/no-hardcoded-strings.js";
export { HCD_SECRET_PLACEHOLDER } from "./rules/no-hardcoded-strings.js";
