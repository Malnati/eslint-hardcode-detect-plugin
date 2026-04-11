import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import { ESLint } from "eslint";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fixtureDir = path.join(__dirname, "..", "..", "e2e-fixture-nest");

// Contagens estáveis para o glob fixture-hardcodes (ver specs/e2e-fixture-nest.md)
const EXPECTED = {
  fixtureFileCount: 5,
  helloWorld: 5,
  noHardcodedStrings: 31,
};

test("e2e nest workspace: ESLint API + flat config na massa Nest (fixture-hardcodes)", async () => {
  const eslint = new ESLint({ cwd: fixtureDir });
  const results = await eslint.lintFiles(["src/fixture-hardcodes/**/*.ts"]);

  assert.equal(results.length, EXPECTED.fixtureFileCount);

  let helloWorld = 0;
  let noHardcoded = 0;
  for (const fileResult of results) {
    for (const m of fileResult.messages) {
      if (m.ruleId === "hardcode-detect/hello-world") {
        helloWorld += 1;
      }
      if (m.ruleId === "hardcode-detect/no-hardcoded-strings") {
        noHardcoded += 1;
      }
    }
  }

  assert.equal(helloWorld, EXPECTED.helloWorld);
  assert.equal(noHardcoded, EXPECTED.noHardcodedStrings);
});
