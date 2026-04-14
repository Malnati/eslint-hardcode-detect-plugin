/**
 * Suite R2 — índice global no âmbito do lint (M2): duplicados cross-file com remediationMode r2.
 * Evidência / matriz: alinhado a docs/remediation-milestones/m2-remediation-r2-global.md (Camada A).
 */
import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { test } from "node:test";
import { ESLint } from "eslint";
import hardcodeDetect from "../dist/index.js";
import { __resetR2FallbackIndexForTests } from "../dist/utils/r2-literal-index.js";

test("R2 — mesmo valor normalizado em dois ficheiros (messageId hardcodedDuplicateCrossFile)", async () => {
  const dir = mkdtempSync(path.join(tmpdir(), "hcd-r2-"));
  const a = path.join(dir, "a.mjs");
  const b = path.join(dir, "b.mjs");
  writeFileSync(a, 'export const x = "shared-r2-value";\n', "utf8");
  writeFileSync(b, 'export const y = "shared-r2-value";\n', "utf8");

  const eslint = new ESLint({
    cwd: dir,
    overrideConfigFile: true,
    overrideConfig: [
      {
        name: "hcd-r2-test",
        plugins: { "hardcode-detect": hardcodeDetect },
        files: ["**/*.mjs"],
        rules: {
          "hardcode-detect/no-hardcoded-strings": [
            "error",
            { remediationMode: "r2" },
          ],
        },
        settings: { hardcodeDetect: {} },
      },
    ],
  });

  const results = await eslint.lintFiles([a, b]);
  __resetR2FallbackIndexForTests(dir);

  assert.equal(results.length, 2);
  const msgs = results.flatMap((r) => r.messages);
  const dup = msgs.filter((m) => m.messageId === "hardcodedDuplicateCrossFile");
  const plain = msgs.filter((m) => m.messageId === "hardcoded");
  assert.equal(
    dup.length,
    1,
    "o segundo ficheiro processado recebe hardcodedDuplicateCrossFile",
  );
  assert.equal(plain.length, 1, "o primeiro ficheiro mantém hardcoded");
});

test("R2 — valor único por ficheiro mantém hardcoded (sem cross-file)", async () => {
  const dir = mkdtempSync(path.join(tmpdir(), "hcd-r2-"));
  const a = path.join(dir, "only.mjs");
  writeFileSync(a, 'const u = "unique-value-xyz";\n', "utf8");

  const eslint = new ESLint({
    cwd: dir,
    overrideConfigFile: true,
    overrideConfig: [
      {
        plugins: { "hardcode-detect": hardcodeDetect },
        files: ["**/*.mjs"],
        rules: {
          "hardcode-detect/no-hardcoded-strings": [
            "error",
            { remediationMode: "r2" },
          ],
        },
        settings: { hardcodeDetect: {} },
      },
    ],
  });

  const results = await eslint.lintFiles([a]);
  __resetR2FallbackIndexForTests(dir);

  const [first] = results;
  assert.ok(first);
  assert.equal(first.messages.length, 1);
  assert.equal(first.messages[0].messageId, "hardcoded");
});
