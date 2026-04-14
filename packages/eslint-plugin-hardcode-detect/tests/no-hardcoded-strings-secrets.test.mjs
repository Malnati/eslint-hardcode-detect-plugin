/**
 * M4 — RuleTester: candidatos a segredo (L1) e `secretRemediationMode`.
 * Microtarefas: docs/remediation-milestones/tasks/m4-secrets-remediation/micro/
 */
import { RuleTester } from "eslint";
import { test } from "node:test";
import hardcodeDetect from "../dist/index.js";

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2022, sourceType: "module" },
});

/** 40 caracteres — casa com `looksLikeSecretCandidate` (sem reproduzir como segredo real). */
const SECRET_LIKE_LITERAL =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890ABCDEF";

const PLACEHOLDER = "<HCD_SECRET_PLACEHOLDER>";


test("M4 — suggest-only (default): sem autofix nem suggestions que exponham o token", () => {
  ruleTester.run(
    "no-hardcoded-strings",
    hardcodeDetect.rules["no-hardcoded-strings"],
    {
      valid: [],
      invalid: [
        {
          code: `const x = "${SECRET_LIKE_LITERAL}";`,
          options: [{ remediationMode: "r1" }],
          errors: [{ messageId: "hardcoded" }],
        },
        {
          code: `const a = "ab";\nconst x = "${SECRET_LIKE_LITERAL}";`,
          options: [{ remediationMode: "r1" }],
          errors: [
            { messageId: "hardcoded" },
            {
              messageId: "hardcoded",
              suggestions: [
                {
                  desc: "Extrair para constante no topo do ficheiro",
                  output: `const AB = "ab";\nconst a = AB;\nconst x = "${SECRET_LIKE_LITERAL}";`,
                },
              ],
            },
          ],
          output: `const AB = "ab";\nconst a = AB;\nconst x = "${SECRET_LIKE_LITERAL}";`,
        },
      ],
    },
  );
});

test("M4 — placeholder-default: const com sentinel, sem valor sensível na declaração injectada", () => {
  ruleTester.run(
    "no-hardcoded-strings",
    hardcodeDetect.rules["no-hardcoded-strings"],
    {
      valid: [],
      invalid: [
        {
          code: `const x = "${SECRET_LIKE_LITERAL}";`,
          options: [
            {
              remediationMode: "r1",
              secretRemediationMode: "placeholder-default",
            },
          ],
          errors: [{ messageId: "hardcoded" }],
          output: `const ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890ABCDEF = "${PLACEHOLDER}";\nconst x = ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890ABCDEF;`,
        },
      ],
    },
  );
});

test("M4 — aggressive-autofix-opt-in: autofix R1 pode incluir o literal no const (opt-in explícito)", () => {
  ruleTester.run(
    "no-hardcoded-strings",
    hardcodeDetect.rules["no-hardcoded-strings"],
    {
      valid: [],
      invalid: [
        {
          code: `const x = "${SECRET_LIKE_LITERAL}";`,
          options: [
            {
              remediationMode: "r1",
              secretRemediationMode: "aggressive-autofix-opt-in",
            },
          ],
          errors: [{ messageId: "hardcoded" }],
          output: `const ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890ABCDEF = "${SECRET_LIKE_LITERAL}";\nconst x = ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890ABCDEF;`,
        },
      ],
    },
  );
});
