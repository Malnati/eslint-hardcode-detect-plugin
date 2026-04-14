import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import { ESLint } from "eslint";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fixtureDir = path.join(__dirname, "fixtures", "r3-data");
const outDir = path.join(fixtureDir, "r3-out");

test("e2e R3: gera .json e .yml com hardcodeDetect.strings", async () => {
  fs.rmSync(outDir, { recursive: true, force: true });
  fs.mkdirSync(outDir, { recursive: true });

  const eslint = new ESLint({ cwd: fixtureDir });
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
