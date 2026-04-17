/**
 * Diagnósticos: recorrência intra-ficheiro, zona sharedConstantsModule, e opção crossFileDuplicateDetection.
 */
import assert from "node:assert/strict";
import { RuleTester } from "eslint";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { test } from "node:test";
import { ESLint } from "eslint";
import hardcodeDetect from "../dist/index.js";
import { __resetR2FallbackIndexForTests } from "../dist/utils/r2-literal-index.js";

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2022, sourceType: "module" },
});

test("RuleTester — mesmo literal duas vezes no mesmo ficheiro (hardcodedDuplicateWithinFile)", () => {
  ruleTester.run(
    "no-hardcoded-strings",
    hardcodeDetect.rules["no-hardcoded-strings"],
    {
      valid: [],
      invalid: [
        {
          code: 'const a = "dup-intra";\nconst b = "dup-intra";\n',
          errors: [
            { messageId: "hardcodedDuplicateWithinFile" },
            { messageId: "hardcodedDuplicateWithinFile" },
          ],
        },
      ],
    },
  );
});

test("RuleTester — ficheiro na zona sharedConstantsModule (hardcodedInSharedConstantsModule)", () => {
  ruleTester.run(
    "no-hardcoded-strings",
    hardcodeDetect.rules["no-hardcoded-strings"],
    {
      valid: [],
      invalid: [
        {
          code: 'export const DOMAIN = "my-catalog-value";\n',
          filename: "src/config/catalog.ts",
          options: [
            {
              crossFileDuplicateDetection: false,
              sharedConstantsModule: "**/config/catalog.ts",
            },
          ],
          errors: [{ messageId: "hardcodedInSharedConstantsModule" }],
        },
      ],
    },
  );
});

test("ESLint API — cross-file com remediationMode off e índice por defeito", async () => {
  const dir = mkdtempSync(path.join(tmpdir(), "hcd-r2-off-"));
  const a = path.join(dir, "a.mjs");
  const b = path.join(dir, "b.mjs");
  writeFileSync(a, 'export const x = "shared-off-mode";\n', "utf8");
  writeFileSync(b, 'export const y = "shared-off-mode";\n', "utf8");

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
            { remediationMode: "off" },
          ],
        },
        settings: { hardcodeDetect: {} },
      },
    ],
  });

  const results = await eslint.lintFiles([a, b]);
  __resetR2FallbackIndexForTests(dir);

  const msgs = results.flatMap((r) => r.messages);
  assert.equal(
    msgs.filter((m) => m.messageId === "hardcodedDuplicateCrossFile").length,
    1,
  );
  assert.equal(msgs.filter((m) => m.messageId === "hardcoded").length, 1);
});

test("ESLint API — crossFileDuplicateDetection false não emite duplicate cross-file", async () => {
  const dir = mkdtempSync(path.join(tmpdir(), "hcd-r2-off-index-"));
  const a = path.join(dir, "a.mjs");
  const b = path.join(dir, "b.mjs");
  writeFileSync(a, 'export const x = "no-index-value";\n', "utf8");
  writeFileSync(b, 'export const y = "no-index-value";\n', "utf8");

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
            {
              remediationMode: "r2",
              crossFileDuplicateDetection: false,
            },
          ],
        },
        settings: { hardcodeDetect: {} },
      },
    ],
  });

  const results = await eslint.lintFiles([a, b]);
  __resetR2FallbackIndexForTests(dir);

  const msgs = results.flatMap((r) => r.messages);
  assert.equal(
    msgs.filter((m) => m.messageId === "hardcodedDuplicateCrossFile").length,
    0,
  );
  assert.equal(msgs.filter((m) => m.messageId === "hardcoded").length, 2);
});
