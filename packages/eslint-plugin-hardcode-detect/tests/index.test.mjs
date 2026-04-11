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
