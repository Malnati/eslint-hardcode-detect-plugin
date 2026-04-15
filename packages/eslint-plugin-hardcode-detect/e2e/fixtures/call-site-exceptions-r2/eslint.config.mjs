/**
 * Fixture e2e: R2 + callSiteExceptions (literal em console.log não entra no índice).
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
      "hardcode-detect/no-hardcoded-strings": [
        "error",
        {
          remediationMode: "r2",
          callSiteExceptions: ["console.log"],
        },
      ],
    },
  },
];
