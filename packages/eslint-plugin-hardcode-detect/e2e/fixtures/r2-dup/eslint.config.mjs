/**
 * Fixture R2: dois ficheiros com o mesmo literal (trilha r2, índice global no âmbito do lint).
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
        { remediationMode: "r2" },
      ],
    },
  },
];
