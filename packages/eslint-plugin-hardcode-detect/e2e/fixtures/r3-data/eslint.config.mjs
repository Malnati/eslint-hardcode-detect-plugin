/**
 * Fixture R3: merge de literais em ficheiros JSON/YAML (trilha r3).
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
          remediationMode: "r3",
          dataFileTargets: ["r3-out/strings.json", "r3-out/strings.yml"],
          dataFileFormats: ["json", "yaml", "yml"],
          dataFileMergeStrategy: "merge-keys",
        },
      ],
    },
  },
];
