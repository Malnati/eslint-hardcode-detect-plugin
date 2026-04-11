import path from "node:path";
import { fileURLToPath } from "node:url";
import eslint from "@eslint/js";
import eslintPluginEslintPlugin from "eslint-plugin-eslint-plugin";
import n from "eslint-plugin-n";
import tseslint from "typescript-eslint";

const tsconfigRootDir = path.dirname(fileURLToPath(import.meta.url));

/** ESLint 9 flat config: `eslint-plugin-eslint-plugin` v7 usa `configs.recommended` (objeto único). */
export default tseslint.config(
  { ignores: ["dist/**", "e2e/fixtures/**"] },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ...eslintPluginEslintPlugin.configs.recommended,
    files: ["src/**/*.ts"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir,
      },
    },
  },
  {
    files: ["tests/**/*.mjs", "e2e/**/*.mjs", "eslint.config.mjs"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
    },
  },
  {
    ...n.configs["flat/recommended-module"],
    files: [
      "src/**/*.ts",
      "tests/**/*.mjs",
      "e2e/**/*.mjs",
      "eslint.config.mjs",
    ],
  },
);
