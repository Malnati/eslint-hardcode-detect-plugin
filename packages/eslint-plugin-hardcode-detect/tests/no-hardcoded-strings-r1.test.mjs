/**
 * Suite RuleTester R1 — M1-A1-04.
 * Revisão desenvolvimento: M1-A1-05 (estilo, escopo, segurança dos literais de teste).
 * Matriz técnica / evidência: docs/remediation-milestones/tasks/m1-remediation-r1/A1-test-analyst-ruletester-r1-matrix-evidence.md (M1-A1-06).
 * Política suggest vs fix — matriz P-SVF / evidência testes: docs/remediation-milestones/tasks/m1-remediation-r1/A2-testing-analyst-suggest-vs-fix-policy-matrix-evidence.md (M1-A2-06).
 * Revisão testes (suggest vs fix A2): docs/remediation-milestones/tasks/m1-remediation-r1/A2-test-reviewer-suggest-vs-fix-policy-signoff.md (M1-A2-07).
 * Revisão testes (suite R1 A1): docs/remediation-milestones/tasks/m1-remediation-r1/A1-test-reviewer-ruletester-r1-signoff.md (M1-A1-07).
 * Rastreabilidade negócio: docs/remediation-milestones/tasks/m1-remediation-r1/A1-business-analyst-ruletester-r1-acceptance.md (S-R1-*).
 */
import { RuleTester } from "eslint";
import { test } from "node:test";
import path from "node:path";
import hardcodeDetect from "../dist/index.js";

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2022, sourceType: "module" },
});

const SUGGEST_DESC = "Extrair para constante no topo do ficheiro";

/** Evita estado do índice R2 partilhado entre casos RuleTester no mesmo processo. */
const NO_CROSS_FILE = { crossFileDuplicateDetection: false };

/** @param {string} output */
function suggest(output) {
  return { desc: SUGGEST_DESC, output };
}

/**
 * Caminhos absolutos coerentes com `path.relative(process.cwd(), filename)`.
 * Exige `npm test` com cwd no pacote (ver A1-architect-ruletester-r1-ci-environment).
 */
function filePath(...segments) {
  return path.join(process.cwd(), ...segments);
}

/** 40 caracteres — casa com heurística de segredo da regra (sem autofix / suggest). */
const SECRET_LIKE_LITERAL =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890ABCDEF";

test("no-hardcoded-strings — remediação R1 (S-R1-01 … S-R1-08)", () => {
  ruleTester.run(
    "no-hardcoded-strings",
    hardcodeDetect.rules["no-hardcoded-strings"],
    {
      valid: [
        // S-R1-07 — envDefaultLiteralPolicy: ignore (??)
        {
          code: 'const x = process.env.FOO ?? "ab";',
          options: [
            {
              remediationMode: "r1",
              envDefaultLiteralPolicy: "ignore",
              ...NO_CROSS_FILE,
            },
          ],
        },
        // S-R1-07 — envDefaultLiteralPolicy: ignore (||)
        {
          code: 'const x = process.env.FOO || "ab";',
          options: [
            {
              remediationMode: "r1",
              envDefaultLiteralPolicy: "ignore",
              ...NO_CROSS_FILE,
            },
          ],
        },
      ],
      invalid: [
        // S-R1-01 — happy path + dedupeWithinFile true (recorrência intra-ficheiro)
        {
          code: 'const s = "ab";\nconst t = "ab";',
          options: [{ remediationMode: "r1", ...NO_CROSS_FILE }],
          errors: [
            { messageId: "hardcodedDuplicateWithinFile" },
            { messageId: "hardcodedDuplicateWithinFile" },
          ],
          output: 'const AB = "ab";\nconst s = AB;\nconst t = AB;',
        },
        // S-R1-01 — constantes após imports (ordem no topo)
        {
          code: 'import x from "y";\nconst s = "ab";',
          options: [{ remediationMode: "r1", ...NO_CROSS_FILE }],
          errors: [{ messageId: "hardcoded" }],
          output:
            'import x from "y";\nconst AB = "ab";\n\nconst s = AB;',
        },
        // S-R1-02 — UPPER_SNAKE_CASE derivado do literal (enum extra de convenção → A3 / contrato)
        {
          code: 'const s = "hello-world";',
          options: [{ remediationMode: "r1", ...NO_CROSS_FILE }],
          errors: [{ messageId: "hardcoded" }],
          output:
            'const HELLO_WORLD = "hello-world";\nconst s = HELLO_WORLD;',
        },
        // S-R1-03 — dedupeWithinFile: false (duas constantes por valor)
        {
          code: 'const s = "ab";\nconst t = "ab";',
          options: [
            { remediationMode: "r1", dedupeWithinFile: false, ...NO_CROSS_FILE },
          ],
          errors: [
            { messageId: "hardcoded" },
            { messageId: "hardcoded" },
          ],
          output:
            'const AB = "ab";\nconst AB_2 = "ab";\nconst s = AB;\nconst t = AB_2;',
        },
        // S-R1-04 — remediationMode: off (só detecção)
        {
          code: 'const s = "ab";',
          options: [{ remediationMode: "off", ...NO_CROSS_FILE }],
          errors: [{ messageId: "hardcoded" }],
        },
        // S-R1-05 — exclude glob: sem autofix R1; reporte mantém-se; suggest disponível
        {
          code: 'const x = "ab";',
          filename: filePath("src", "strings.i18n.ts"),
          options: [
            {
              remediationMode: "r1",
              remediationExcludeGlobs: ["**/*.i18n.ts"],
              ...NO_CROSS_FILE,
            },
          ],
          errors: [
            {
              messageId: "hardcoded",
              suggestions: [
                suggest('const AB = "ab";\nconst x = AB;'),
              ],
            },
          ],
        },
        // S-R1-06 — include glob: dentro de src/ recebe fix
        {
          code: 'const x = "ab";',
          filename: filePath("src", "included.ts"),
          options: [
            {
              remediationMode: "r1",
              remediationIncludeGlobs: ["src/**/*.ts"],
              ...NO_CROSS_FILE,
            },
          ],
          errors: [{ messageId: "hardcoded" }],
          output: 'const AB = "ab";\nconst x = AB;',
        },
        // S-R1-06 — include glob: fora de src/ sem autofix; suggest mantém-se
        {
          code: 'const x = "ab";',
          filename: filePath("lib", "outside.ts"),
          options: [
            {
              remediationMode: "r1",
              remediationIncludeGlobs: ["src/**/*.ts"],
              ...NO_CROSS_FILE,
            },
          ],
          errors: [
            {
              messageId: "hardcoded",
              suggestions: [
                suggest('const AB = "ab";\nconst x = AB;'),
              ],
            },
          ],
        },
        // S-R1-07 — include: fallback ?? com process.env
        {
          code: 'const x = process.env.FOO ?? "ab";',
          options: [
            {
              remediationMode: "r1",
              envDefaultLiteralPolicy: "include",
              ...NO_CROSS_FILE,
            },
          ],
          errors: [{ messageId: "hardcoded" }],
          output: 'const AB = "ab";\nconst x = process.env.FOO ?? AB;',
        },
        // S-R1-07 — report-separate: messageId distinto
        {
          code: 'const x = process.env.FOO ?? "ab";',
          options: [
            {
              remediationMode: "r1",
              envDefaultLiteralPolicy: "report-separate",
              ...NO_CROSS_FILE,
            },
          ],
          errors: [{ messageId: "hardcodedEnvDefault" }],
          output: 'const AB = "ab";\nconst x = process.env.FOO ?? AB;',
        },
        // S-R1-07 — include: fallback || com process.env
        {
          code: 'const x = process.env.FOO || "ab";',
          options: [
            {
              remediationMode: "r1",
              envDefaultLiteralPolicy: "include",
              ...NO_CROSS_FILE,
            },
          ],
          errors: [{ messageId: "hardcoded" }],
          output: 'const AB = "ab";\nconst x = process.env.FOO || AB;',
        },
        // S-R1-08 — caminho “arriscado”: suggest, sem autofix
        {
          code: 'const x = "ab";',
          filename: filePath("src", "foo.test.ts"),
          options: [{ remediationMode: "r1", ...NO_CROSS_FILE }],
          errors: [
            {
              messageId: "hardcoded",
              suggestions: [
                suggest('const AB = "ab";\nconst x = AB;'),
              ],
            },
          ],
        },
        // Segredo provável — sem fix automático nem suggestions
        {
          code: `const x = "${SECRET_LIKE_LITERAL}";`,
          options: [{ remediationMode: "r1", ...NO_CROSS_FILE }],
          errors: [{ messageId: "hardcoded" }],
        },
      ],
    },
  );
});
