/**
 * Ponto de entrada do plugin publicável.
 * Comportamento das regras: ver ../../../specs/plugin-contract.md
 */

import { readFileSync } from "node:fs";
import helloWorld from "./rules/hello-world.js";
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
    "hello-world": helloWorld,
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
      rules: {
        "hardcode-detect/no-hardcoded-strings": "warn",
      },
    },
  ],
});

export const rules = plugin.rules;
export default plugin;
