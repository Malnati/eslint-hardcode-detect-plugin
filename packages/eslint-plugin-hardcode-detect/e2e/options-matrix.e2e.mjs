import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import { ESLint } from "eslint";
import { loadRegistryPlugin } from "./helpers/registry-plugin.mjs";
import { createTempFixtureCopy } from "./helpers/temp-fixture.mjs";

const hardcodeDetect = await loadRegistryPlugin();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fixtureRoot = path.join(__dirname, "fixtures", "options-matrix");

const SECRET_LIKE_LITERAL = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890ABCDEF";
const SECRET_PLACEHOLDER = "<HCD_SECRET_PLACEHOLDER>";

function createLintConfig(ruleOptions) {
  return [
    {
      name: "hcd-options-matrix-e2e",
      files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
      plugins: { "hardcode-detect": hardcodeDetect },
      settings: { hardcodeDetect: {} },
      rules: {
        "hardcode-detect/no-hardcoded-strings": ["error", ruleOptions],
      },
    },
  ];
}

function createTempFixtureDir(fixtureName) {
  const sourceDir = path.join(fixtureRoot, fixtureName);
  return createTempFixtureCopy(sourceDir, "hcd-e2e-options-");
}

function countRuleHits(results, ruleId) {
  let count = 0;
  for (const result of results) {
    for (const message of result.messages) {
      if (message.ruleId === ruleId) {
        count += 1;
      }
    }
  }
  return count;
}

test("e2e options: remediationMode auto segue trilha R1 com autofix", async () => {
  const cwd = createTempFixtureDir("auto");
  const target = "entry.mjs";
  const ruleOptions = { remediationMode: "auto" };

  const baselineLint = new ESLint({
    cwd,
    overrideConfigFile: true,
    overrideConfig: createLintConfig(ruleOptions),
  });
  const baselineResults = await baselineLint.lintFiles([target]);
  const baselineCount = countRuleHits(
    baselineResults,
    "hardcode-detect/no-hardcoded-strings",
  );
  assert.ok(baselineCount >= 1);

  const fixLint = new ESLint({
    cwd,
    fix: true,
    overrideConfigFile: true,
    overrideConfig: createLintConfig(ruleOptions),
  });
  const fixResults = await fixLint.lintFiles([target]);
  await ESLint.outputFixes(fixResults);

  const fixedCode = fs.readFileSync(path.join(cwd, target), "utf8");
  assert.match(fixedCode, /const AUTO_MODE_VALUE = ['"]auto-mode-value['"];/);
  assert.match(fixedCode, /return AUTO_MODE_VALUE;/);

  const verifyLint = new ESLint({
    cwd,
    overrideConfigFile: true,
    overrideConfig: createLintConfig(ruleOptions),
  });
  const verifyResults = await verifyLint.lintFiles([target]);
  const verifyCount = countRuleHits(
    verifyResults,
    "hardcode-detect/no-hardcoded-strings",
  );
  assert.ok(verifyCount < baselineCount);
});

test("e2e options: envDefaultLiteralPolicy inclui, separa e ignora fallback", async () => {
  const cwd = createTempFixtureDir("env");
  const target = "entry.mjs";

  async function runWithPolicy(envDefaultLiteralPolicy) {
    const eslint = new ESLint({
      cwd,
      overrideConfigFile: true,
      overrideConfig: createLintConfig({
        remediationMode: "off",
        envDefaultLiteralPolicy,
      }),
    });
    return eslint.lintFiles([target]);
  }

  const includeResults = await runWithPolicy("include");
  const includeMessages = includeResults.flatMap((r) => r.messages);
  assert.equal(includeMessages.length, 1);
  assert.equal(includeMessages[0]?.messageId, "hardcoded");

  const separateResults = await runWithPolicy("report-separate");
  const separateMessages = separateResults.flatMap((r) => r.messages);
  assert.equal(separateMessages.length, 1);
  assert.equal(separateMessages[0]?.messageId, "hardcodedEnvDefault");

  const ignoreResults = await runWithPolicy("ignore");
  const ignoreMessages = ignoreResults.flatMap((r) => r.messages);
  assert.equal(ignoreMessages.length, 0);
});

test("e2e options: remediationIncludeGlobs restringe autofix ao caminho incluído", async () => {
  const cwd = createTempFixtureDir("globs");
  const included = "src/included.mjs";
  const outside = "lib/outside.mjs";
  const ruleOptions = {
    remediationMode: "r1",
    remediationIncludeGlobs: ["src/**/*.mjs"],
  };

  const eslint = new ESLint({
    cwd,
    fix: true,
    overrideConfigFile: true,
    overrideConfig: createLintConfig(ruleOptions),
  });

  const results = await eslint.lintFiles([included, outside]);
  await ESLint.outputFixes(results);

  const includedCode = fs.readFileSync(path.join(cwd, included), "utf8");
  const outsideCode = fs.readFileSync(path.join(cwd, outside), "utf8");

  assert.match(
    includedCode,
    /const INCLUDE_GLOB_LITERAL = ['"]include-glob-literal['"];/,
  );
  assert.match(includedCode, /return INCLUDE_GLOB_LITERAL;/);
  assert.match(outsideCode, /['"]outside-glob-literal['"]/);

  const outsideResult = results.find((r) => r.filePath.endsWith(outside));
  assert.ok(outsideResult);
  assert.ok(outsideResult.messages.length >= 1);
  assert.equal(outsideResult.messages[0]?.messageId, "hardcoded");
});

test("e2e options: remediationExcludeGlobs bloqueia autofix e mantém diagnóstico", async () => {
  const cwd = createTempFixtureDir("globs-exclude");
  const target = "src/excluded.mjs";
  const originalCode = fs.readFileSync(path.join(cwd, target), "utf8");

  const eslint = new ESLint({
    cwd,
    fix: true,
    overrideConfigFile: true,
    overrideConfig: createLintConfig({
      remediationMode: "r1",
      remediationExcludeGlobs: ["src/**"],
    }),
  });

  const results = await eslint.lintFiles([target]);
  await ESLint.outputFixes(results);

  const currentCode = fs.readFileSync(path.join(cwd, target), "utf8");
  assert.equal(currentCode, originalCode);
  assert.equal(results.length, 1);
  assert.ok(results[0].messages.length >= 1);
  assert.equal(results[0].messages[0]?.messageId, "hardcoded");
});

test("e2e options: secretRemediationMode suggest-only não aplica autofix", async () => {
  const cwd = createTempFixtureDir("secret");
  const target = "entry.mjs";
  const originalCode = fs.readFileSync(path.join(cwd, target), "utf8");

  const eslint = new ESLint({
    cwd,
    fix: true,
    overrideConfigFile: true,
    overrideConfig: createLintConfig({
      remediationMode: "r1",
      secretRemediationMode: "suggest-only",
    }),
  });

  const results = await eslint.lintFiles([target]);
  await ESLint.outputFixes(results);
  const currentCode = fs.readFileSync(path.join(cwd, target), "utf8");

  assert.equal(currentCode, originalCode);
  assert.equal(results.length, 1);
  assert.equal(results[0].messages.length, 1);
  assert.equal(results[0].messages[0]?.messageId, "hardcoded");
  assert.equal(results[0].messages[0]?.fix, undefined);
});

test("e2e options: secretRemediationMode placeholder-default usa sentinel", async () => {
  const cwd = createTempFixtureDir("secret");
  const target = "entry.mjs";

  const eslint = new ESLint({
    cwd,
    fix: true,
    overrideConfigFile: true,
    overrideConfig: createLintConfig({
      remediationMode: "r1",
      secretRemediationMode: "placeholder-default",
    }),
  });

  const results = await eslint.lintFiles([target]);
  await ESLint.outputFixes(results);
  const currentCode = fs.readFileSync(path.join(cwd, target), "utf8");

  assert.equal(results.length, 1);
  assert.equal(results[0].messages.length, 1);
  assert.match(
    currentCode,
    new RegExp(
      `const [A-Z0-9_]+ = ['"]${SECRET_PLACEHOLDER}['"];`,
    ),
  );
  assert.match(currentCode, /return [A-Z0-9_]+;/);
});

test("e2e options: secretRemediationMode aggressive-autofix-opt-in copia literal", async () => {
  const cwd = createTempFixtureDir("secret");
  const target = "entry.mjs";

  const eslint = new ESLint({
    cwd,
    fix: true,
    overrideConfigFile: true,
    overrideConfig: createLintConfig({
      remediationMode: "r1",
      secretRemediationMode: "aggressive-autofix-opt-in",
    }),
  });

  const results = await eslint.lintFiles([target]);
  await ESLint.outputFixes(results);
  const currentCode = fs.readFileSync(path.join(cwd, target), "utf8");

  assert.equal(results.length, 1);
  assert.equal(results[0].messages.length, 1);
  assert.match(
    currentCode,
    new RegExp(
      `const [A-Z0-9_]+ = ['"]${SECRET_LIKE_LITERAL}['"];`,
    ),
  );
  assert.match(currentCode, /return [A-Z0-9_]+;/);
});
