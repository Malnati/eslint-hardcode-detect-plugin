import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import { ESLint } from "eslint";
import hardcodeDetect from "../dist/index.js";
import { withTempFixtureCopy } from "./helpers/temp-fixture.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fixtureDir = path.join(__dirname, "fixtures", "r2-dup");

test("e2e R2: dois ficheiros, mesmo literal normalizado (hardcodedDuplicateCrossFile)", async () => {
  await withTempFixtureCopy(fixtureDir, "hcd-e2e-r2-dup-", async (cwd) => {
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
              { remediationMode: "r2" },
            ],
          },
        },
      ],
    });
    const results = await eslint.lintFiles(["one.mjs", "two.mjs"]);

    assert.equal(results.length, 2);
    const all = results.flatMap((r) => r.messages);
    const r2 = all.filter((m) => m.messageId === "hardcodedDuplicateCrossFile");
    const plain = all.filter((m) => m.messageId === "hardcoded");
    assert.ok(r2.length >= 1, "esperado pelo menos um diagnóstico R2 (2.º ficheiro)");
    assert.ok(plain.length >= 1, "esperado hardcoded no 1.º ficheiro processado");
  });
});
