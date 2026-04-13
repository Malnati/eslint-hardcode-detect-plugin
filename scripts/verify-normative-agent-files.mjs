#!/usr/bin/env node
/**
 * Verifica presença dos ficheiros normativos T5 (Cursor + pontes Copilot).
 * Manter a lista sincronizada com:
 * docs/distribution-milestones/tasks/m4-channel-t5-agents/evidence/T5-normative-files-inventory.md
 *
 * Executar na raiz: node scripts/verify-normative-agent-files.mjs
 */
import { existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const repoRoot = join(__dirname, "..");

/** @type {string[]} paths relativos à raiz do repositório */
const NORMATIVE_AGENT_FILES = [
  // §1.1 Regras Cursor
  ".cursor/rules/agent-error-messaging-triple.mdc",
  ".cursor/rules/agent-ia-governance.mdc",
  ".cursor/rules/agent-integration-testing-policy.mdc",
  ".cursor/rules/agent-reference-agents.mdc",
  ".cursor/rules/agent-remediation-micro-roles.mdc",
  ".cursor/rules/agent-session.mdc",
  ".cursor/rules/clippings-official-docs.mdc",
  ".cursor/rules/documentation.mdc",
  ".cursor/rules/docker-compose-tooling.mdc",
  ".cursor/rules/e2e-nest-fixture.mdc",
  ".cursor/rules/git-versioning.mdc",
  ".cursor/rules/repo-layout.mdc",
  ".cursor/rules/repo-relative-paths.mdc",
  // §1.2 Skills
  ".cursor/skills/agent-error-messaging-triple/SKILL.md",
  ".cursor/skills/docker-compose-workflow/SKILL.md",
  ".cursor/skills/eslint-plugin-workflow/SKILL.md",
  ".cursor/skills/git-agent-workflow/SKILL.md",
  ".cursor/skills/github-markdown-docs/SKILL.md",
  ".cursor/skills/reference-agents-portfolio/SKILL.md",
  ".cursor/skills/reference-clippings-workflow/SKILL.md",
  ".cursor/skills/remediation-micro-roles-workflow/SKILL.md",
  // §1.3 Comandos
  ".cursor/commands/abrir-prompt-agente.md",
  ".cursor/commands/fechar-prompt-agente.md",
  ".cursor/commands/fechar-e2e-nest-fixture.md",
  // §1.4 Hooks
  ".cursor/hooks.json",
  ".cursor/hooks/hcd-err-triple-audit.sh",
  // §1.5 Agentes Copilot
  ".github/agents/docker-tooling.agent.md",
  ".github/agents/eslint-hardcode-plugin.agent.md",
  ".github/agents/hcd-err-messaging.agent.md",
  // §1.6 Instruções Copilot
  ".github/instructions/docker-compose.instructions.md",
  ".github/instructions/eslint-plugin-hardcode.instructions.md",
  ".github/instructions/milestones-planning.instructions.md",
];

const missing = NORMATIVE_AGENT_FILES.filter(
  (rel) => !existsSync(join(repoRoot, rel)),
);

if (missing.length > 0) {
  console.error(
    "verify-normative-agent-files: ficheiros normativos T5 em falta:",
  );
  for (const p of missing) {
    console.error(`  - ${p}`);
  }
  process.exit(1);
}

console.log(
  `verify-normative-agent-files: OK (${NORMATIVE_AGENT_FILES.length} ficheiros).`,
);
