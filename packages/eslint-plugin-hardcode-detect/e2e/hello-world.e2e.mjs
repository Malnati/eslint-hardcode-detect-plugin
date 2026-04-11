import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import { ESLint } from "eslint";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fixtureDir = path.join(__dirname, "fixtures", "hello-world");

test("e2e hello-world: ESLint API + flat config carregam o plugin", async () => {
  const eslint = new ESLint({ cwd: fixtureDir });
  const results = await eslint.lintFiles(["sample.mjs"]);

  assert.equal(results.length, 1);
  const [fileResult] = results;
  assert.ok(fileResult.messages.length >= 1, "esperado ao menos um diagnóstico");

  const [first] = fileResult.messages;
  assert.equal(first.ruleId, "hardcode-detect/hello-world");
  assert.equal(first.messageId, "hello");
});
