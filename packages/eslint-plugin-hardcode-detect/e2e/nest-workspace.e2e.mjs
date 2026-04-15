import assert from "node:assert/strict";
import { readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import { ESLint } from "eslint";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fixtureDir = path.join(__dirname, "..", "..", "e2e-fixture-nest");

// Contagens por ficheiro + total (ver specs/e2e-fixture-nest.md); falhas localizam alterações na massa.
const RULE_ID = "hardcode-detect/no-hardcoded-strings";
const EXPECTED = {
  fixtureFileCount: 5,
  noHardcodedStrings: 31,
  /** @type {Record<string, number>} */
  noHardcodedByBasename: {
    "catalog.ts": 7,
    "create-item.dto.ts": 7,
    "hardcoded-seed.controller.ts": 9,
    "hardcoded-seed.module.ts": 3,
    "hardcoded-seed.service.ts": 5,
  },
};

function countRuleHits(results, ruleId) {
  let count = 0;
  for (const fileResult of results) {
    for (const message of fileResult.messages) {
      if (message.ruleId === ruleId) {
        count += 1;
      }
    }
  }
  return count;
}

test("e2e nest workspace: ESLint API + flat config na massa Nest (fixture-hardcodes)", async () => {
  const eslint = new ESLint({ cwd: fixtureDir });
  const results = await eslint.lintFiles(["src/fixture-hardcodes/**/*.ts"]);

  assert.equal(results.length, EXPECTED.fixtureFileCount);
  const byBase = Object.fromEntries(
    results.map((r) => [path.basename(r.filePath), r]),
  );
  for (const [basename, expectedHits] of Object.entries(
    EXPECTED.noHardcodedByBasename,
  )) {
    assert.ok(byBase[basename], `falta resultado para ${basename}`);
    const hits = countRuleHits([byBase[basename]], RULE_ID);
    assert.equal(
      hits,
      expectedHits,
      `${basename}: alinhar contagens com specs/e2e-fixture-nest.md`,
    );
  }
  const noHardcoded = countRuleHits(results, RULE_ID);
  assert.equal(noHardcoded, EXPECTED.noHardcodedStrings);
});

test("e2e nest workspace: fix=true aplica autofix R1 em arquivo temporário", async () => {
  const targetRelativePath = "src/autofix-smoke.e2e.ts";
  const targetPath = path.join(fixtureDir, targetRelativePath);
  const originalCode = [
    "export function autofixSmoke(flag) {",
    "  if (flag) {",
    '    return "Hello from fixture smoke";',
    "  }",
    '  return "Hello from fixture smoke";',
    "}",
    "",
  ].join("\n");

  try {
    writeFileSync(targetPath, originalCode, "utf8");

    const overrideConfig = [
      {
        files: [targetRelativePath],
        rules: {
          "hardcode-detect/no-hardcoded-strings": [
            "error",
            { remediationMode: "r1" },
          ],
        },
      },
    ];

    const eslintBaseline = new ESLint({ cwd: fixtureDir, overrideConfig });
    const baselineResults = await eslintBaseline.lintFiles([targetRelativePath]);
    const baselineNoHardcoded = countRuleHits(
      baselineResults,
      "hardcode-detect/no-hardcoded-strings",
    );
    assert.ok(baselineNoHardcoded >= 1);

    const eslintFix = new ESLint({
      cwd: fixtureDir,
      fix: true,
      overrideConfig,
    });
    const fixResults = await eslintFix.lintFiles([targetRelativePath]);
    await ESLint.outputFixes(fixResults);

    assert.equal(fixResults.length, 1);
    assert.equal(typeof fixResults[0]?.output, "string");

    const fixedCode = readFileSync(targetPath, "utf8");
    assert.notEqual(fixedCode, originalCode);
    assert.match(fixedCode, /const [A-Z0-9_]+ = ['"]Hello from fixture smoke['"];/);
    assert.match(fixedCode, /return [A-Z0-9_]+;/);

    const eslintVerify = new ESLint({ cwd: fixtureDir, overrideConfig });
    const verifyResults = await eslintVerify.lintFiles([targetRelativePath]);
    const noHardcoded = countRuleHits(
      verifyResults,
      "hardcode-detect/no-hardcoded-strings",
    );

    assert.ok(noHardcoded < baselineNoHardcoded);
  } finally {
    rmSync(targetPath, { force: true });
  }
});
