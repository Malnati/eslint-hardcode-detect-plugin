/**
 * Fixture mínimo: consome o plugin compilado como um projeto real faria (flat config).
 */
import hardcodeDetect from "../../../dist/index.js";

export default [
  {
    files: ["**/*.mjs"],
    plugins: {
      "hardcode-detect": hardcodeDetect,
    },
    rules: {
      "hardcode-detect/hello-world": "error",
    },
  },
];
