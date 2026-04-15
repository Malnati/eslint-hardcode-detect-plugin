import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import { ESLint } from "eslint";
import hardcodeDetect from "../dist/index.js";
import { withTempFixtureCopy } from "./helpers/temp-fixture.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fixtureDir = path.join(__dirname, "fixtures", "r3-data");

test("e2e R3: gera .json e .yml com hardcodeDetect.strings", async () => {
  await withTempFixtureCopy(fixtureDir, "hcd-e2e-r3-data-", async (cwd) => {
    const outDir = path.join(cwd, "r3-out");
    fs.rmSync(outDir, { recursive: true, force: true });
    fs.mkdirSync(outDir, { recursive: true });

    const eslint = new ESLint({
      cwd,
      overrideConfigFile: true,
      overrideConfig: [
        {
          files: ["**/*.mjs"],
          plugins: { "hardcode-detect": hardcodeDetect },
          settings: { hardcodeDetect: {} },
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
      ],
    });
    await eslint.lintFiles(["sample.mjs"]);

    const jsonPath = path.join(outDir, "strings.json");
    const ymlPath = path.join(outDir, "strings.yml");
    assert.ok(fs.existsSync(jsonPath), "strings.json criado");
    assert.ok(fs.existsSync(ymlPath), "strings.yml criado");

    const j = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
    assert.ok(j.hardcodeDetect?.strings);
    assert.equal(j.hardcodeDetect.strings.HELLO_R3, "hello-r3");

    const yRaw = fs.readFileSync(ymlPath, "utf8");
    assert.ok(yRaw.includes("HELLO_R3"));
    assert.ok(yRaw.includes("hello-r3"));
  });
});
