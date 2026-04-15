/**
 * e2e: callSiteExceptions — motor ESLint + flat config + dist do plugin (cobertura profunda).
 */
import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import { ESLint } from "eslint";
import { __resetR2FallbackIndexForTests } from "../dist/utils/r2-literal-index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fixtureDir = path.join(__dirname, "fixtures", "call-site-exceptions");
const fixtureR2Dir = path.join(__dirname, "fixtures", "call-site-exceptions-r2");
const fixtureBaselineDir = path.join(__dirname, "fixtures", "call-site-baseline");

test("e2e call-site-exceptions: baseline sem lista reporta console.log", async () => {
  const eslint = new ESLint({ cwd: fixtureBaselineDir });
  const results = await eslint.lintFiles(["log-without-exception.mjs"]);
  assert.equal(results.length, 1);
  assert.equal(results[0].messages.length, 1);
  assert.equal(results[0].messages[0].messageId, "hardcoded");
});

test("e2e call-site-exceptions: ficheiros só com callee coberto têm zero mensagens", async () => {
  const eslint = new ESLint({ cwd: fixtureDir });
  const onlySuppressed = [
    "log-suppressed.mjs",
    "optional-chain.mjs",
    "debug-call.mjs",
  ];
  const results = await eslint.lintFiles(onlySuppressed);
  assert.equal(results.length, 3);
  for (const r of results) {
    assert.equal(
      r.messages.length,
      0,
      `${path.basename(r.filePath)} deve ficar limpo`,
    );
  }
});

test("e2e call-site-exceptions: lint conjunto — três literais ainda reportáveis", async () => {
  const eslint = new ESLint({ cwd: fixtureDir });
  const files = [
    "log-suppressed.mjs",
    "mixed-report.mjs",
    "second-arg.mjs",
    "optional-chain.mjs",
    "debug-call.mjs",
    "env-nested.mjs",
  ];
  const results = await eslint.lintFiles(files);
  const total = results.flatMap((r) => r.messages).length;
  assert.equal(total, 3, "mixed + segundo arg + env nested");

  const counts = Object.fromEntries(
    results.map((r) => [path.basename(r.filePath), r.messages.length]),
  );
  assert.equal(counts["log-suppressed.mjs"], 0);
  assert.equal(counts["mixed-report.mjs"], 1);
  assert.equal(counts["second-arg.mjs"], 1);
  assert.equal(counts["optional-chain.mjs"], 0);
  assert.equal(counts["debug-call.mjs"], 0);
  assert.equal(counts["env-nested.mjs"], 1);
});

test("e2e call-site-exceptions: messageIds esperados nos casos que reportam", async () => {
  const eslint = new ESLint({ cwd: fixtureDir });
  const results = await eslint.lintFiles([
    "mixed-report.mjs",
    "second-arg.mjs",
    "env-nested.mjs",
  ]);
  const msgs = results.flatMap((r) => r.messages);
  assert.equal(msgs.length, 3);
  for (const m of msgs) {
    assert.equal(m.messageId, "hardcoded");
  }
});

test("e2e call-site-exceptions-r2: console.log ignorado não alimenta índice R2", async () => {
  const eslint = new ESLint({ cwd: fixtureR2Dir });
  const results = await eslint.lintFiles([
    "a-log.mjs",
    "b-const.mjs",
    "c-const.mjs",
  ]);
  __resetR2FallbackIndexForTests(fixtureR2Dir);

  assert.equal(results.length, 3);
  const byBase = Object.fromEntries(
    results.map((r) => [path.basename(r.filePath), r]),
  );
  assert.equal(byBase["a-log.mjs"].messages.length, 0);
  assert.equal(byBase["b-const.mjs"].messages.length, 1);
  assert.equal(byBase["b-const.mjs"].messages[0].messageId, "hardcoded");
  assert.equal(byBase["c-const.mjs"].messages.length, 1);
  assert.equal(byBase["c-const.mjs"].messages[0].messageId, "hardcodedDuplicateCrossFile");

  const all = results.flatMap((r) => r.messages);
  assert.equal(
    all.filter((m) => m.messageId === "hardcoded").length,
    1,
  );
  assert.equal(
    all.filter((m) => m.messageId === "hardcodedDuplicateCrossFile").length,
    1,
  );
});
