/**
 * Fixture e2e: mesmo padrão de código que call-site-exceptions, sem callSiteExceptions (baseline).
 */
import hardcodeDetect from "../../../dist/index.js";

export default [
  {
    files: ["**/*.mjs"],
    plugins: {
      "hardcode-detect": hardcodeDetect,
    },
    settings: {
      hardcodeDetect: {},
    },
    rules: {
      "hardcode-detect/no-hardcoded-strings": ["error", { remediationMode: "off" }],
    },
  },
];
