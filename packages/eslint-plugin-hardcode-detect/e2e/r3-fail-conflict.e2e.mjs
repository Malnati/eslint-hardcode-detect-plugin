import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import { ESLint } from "eslint";
import { loadRegistryPlugin } from "./helpers/registry-plugin.mjs";
import {
  createTempFixtureCopy,
  removeTempFixtureSync,
} from "./helpers/temp-fixture.mjs";

const hardcodeDetect = await loadRegistryPlugin();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fixtureDir = path.join(__dirname, "fixtures", "r3-fail-conflict");

test("e2e R3 fail-on-conflict: conflito não reescreve ficheiro-alvo", async () => {
  const cwd = createTempFixtureCopy(fixtureDir, "hcd-e2e-r3-conflict-");
  try {
    const target = "sample.mjs";
    const outputPath = path.join(cwd, "r3-out", "strings.json");
    const initialJson = `${JSON.stringify(
      {
        hardcodeDetect: {
          strings: {
            HELLO_R3_CONFLICT: "previous-r3-value",
          },
        },
      },
      null,
      2,
    )}\n`;

    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, initialJson, "utf8");

    const eslint = new ESLint({
      cwd,
      overrideConfigFile: true,
      overrideConfig: [
        {
          name: "hcd-r3-fail-on-conflict-e2e",
          files: ["**/*.mjs"],
          plugins: { "hardcode-detect": hardcodeDetect },
          settings: { hardcodeDetect: {} },
          rules: {
            "hardcode-detect/no-hardcoded-strings": [
              "error",
              {
                remediationMode: "r3",
                dataFileTargets: ["r3-out/strings.json"],
                dataFileFormats: ["json"],
                dataFileMergeStrategy: "fail-on-conflict",
              },
            ],
          },
        },
      ],
    });

    const results = await eslint.lintFiles([target]);

    assert.equal(results.length, 1);
    assert.equal(results[0].messages.length, 1);
    assert.equal(results[0].messages[0]?.messageId, "hardcoded");

    const afterJson = fs.readFileSync(outputPath, "utf8");
    assert.equal(afterJson, initialJson);

    const parsed = JSON.parse(afterJson);
    assert.equal(
      parsed.hardcodeDetect?.strings?.HELLO_R3_CONFLICT,
      "previous-r3-value",
    );
  } finally {
    removeTempFixtureSync(cwd);
  }
});
