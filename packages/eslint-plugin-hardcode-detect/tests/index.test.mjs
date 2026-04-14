import assert from "node:assert/strict";
import { RuleTester } from "eslint";
import { test } from "node:test";
import hardcodeDetect from "../dist/index.js";

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2022, sourceType: "module" },
});

test("hello-world: relatório único por arquivo (sem casos válidos quando a regra está ativa)", () => {
  ruleTester.run("hello-world", hardcodeDetect.rules["hello-world"], {
    valid: [],
    invalid: [
      {
        code: "export const x = 1;",
        errors: [{ messageId: "hello" }],
      },
      {
        code: "// apenas comentário",
        errors: [{ messageId: "hello" }],
      },
    ],
  });
});

test("no-hardcoded-strings", () => {
  ruleTester.run(
    "no-hardcoded-strings",
    hardcodeDetect.rules["no-hardcoded-strings"],
    {
      valid: [
        'const a = "x";',
        "const n = 42;",
        'const empty = "";',
      ],
      invalid: [
        {
          code: 'const s = "ab";',
          errors: [{ messageId: "hardcoded" }],
        },
      ],
    },
  );
});

test("no-hardcoded-strings: mensagens usam tripla HCD-ERR", () => {
  const rule = hardcodeDetect.rules["no-hardcoded-strings"];
  const ids = [
    "hardcoded",
    "hardcodedEnvDefault",
    "hardcodedDuplicateCrossFile",
  ];

  for (const id of ids) {
    const message = rule.meta.messages[id];
    assert.equal(typeof message, "string");

    const parts = message.split("\n");
    assert.equal(parts.length, 3);
    assert.ok(parts[0].startsWith("[HCD-ERR-SENIOR]"));
    assert.ok(parts[1].startsWith("[HCD-ERR-FIX]"));
    assert.ok(parts[2].startsWith("[HCD-ERR-OPS]"));
  }
});
