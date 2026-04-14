import globals from "globals";
import hardcodeDetect from "eslint-plugin-hardcode-detect";
import tseslint from "typescript-eslint";

export default [
  {
    ignores: ["dist/**", "coverage/**", "node_modules/**"],
  },
  {
    files: ["{src,apps,libs,test,e2e}/**/*.ts"],
    languageOptions: {
      parser: tseslint.parser,
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.node,
      },
    },
    plugins: {
      "@typescript-eslint": tseslint.plugin,
      "hardcode-detect": hardcodeDetect,
    },
    rules: {
      "hardcode-detect/no-hardcoded-strings": "warn",
    },
  },
];
