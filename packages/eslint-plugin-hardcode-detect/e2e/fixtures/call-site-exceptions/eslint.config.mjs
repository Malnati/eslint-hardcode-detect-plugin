/**
 * Fixture e2e: callSiteExceptions com remediationMode off (só detecção).
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
          remediationMode: "off",
          callSiteExceptions: ["console.log", "debug"],
        },
      ],
    },
  },
];
