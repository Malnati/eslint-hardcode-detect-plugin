#!/usr/bin/env node
/**
 * Gera sub-micro-tarefas por papel em docs/remediation-milestones/tasks (pastas micro).
 * Execução única após alteração do plano; não faz parte do npm test por defeito.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, "..");

const ROLES = [
  {
    slug: "arquiteto",
    title: "Arquiteto",
    focus: (ctx) =>
      `Define impacto em CI, \`npm test -w eslint-plugin-hardcode-detect\` e limites de ambiente; **não** edita ficheiros em ${ctx.codePaths}.`,
  },
  {
    slug: "analista-negocio",
    title: "Analista de negócio",
    focus: (ctx) =>
      `Especifica critérios de aceitação e inputs/outputs alinhados a ${ctx.contractHint}; **não** implementa código.`,
  },
  {
    slug: "revisor-negocio",
    title: "Revisor de negócio",
    focus: () =>
      `Valida a especificação contra \`specs/plugin-contract.md\` e \`docs/architecture.md\`; **não** escreve testes nem produção.`,
  },
  {
    slug: "desenvolvedor",
    title: "Desenvolvedor",
    focus: (ctx) =>
      `Implementa ou altera artefactos em ${ctx.codePaths}; **não** redefine o contrato sem passar pelo analista de negócio.`,
  },
  {
    slug: "revisor-desenvolvimento",
    title: "Revisor de desenvolvimento",
    focus: () =>
      `Revisa diffs (estilo, segurança, escopo); **não** adiciona funcionalidade nova.`,
  },
  {
    slug: "analista-testes",
    title: "Analista de testes",
    focus: () =>
      `Documenta matriz de casos RuleTester/e2e e critérios de evidência; **não** aprova o merge sozinho.`,
  },
  {
    slug: "revisor-testes",
    title: "Revisor de testes",
    focus: () =>
      `Revisa o plano de testes e os critérios de log/artefactos; **não** executa a suíte no lugar do testador.`,
  },
  {
    slug: "testador",
    title: "Testador",
    focus: () =>
      `Executa \`npm test -w eslint-plugin-hardcode-detect\` e regista evidências; **não** edita \`src/\` salvo instrução explícita.`,
  },
  {
    slug: "dev-especialista-correcoes",
    title: "Desenvolvedor especialista em correcções",
    focus: () =>
      `Actua **após** falha reproduzível: analisa logs, propõe patch mínimo, valida re-execução; **não** duplica o papel do desenvolvedor na entrega inicial.`,
  },
];

/**
 * @typedef {{ milestone: string; dir: string; planFile: string; githubMilestone: string; tasks: { parent: string; taskSlug: string; fileSlug: string; parentTokens: number; labels: string; outputs: string; criterion: string; deps: string; inputs: string; codePaths: string; contractHint: string; }[] }} MilestoneCfg
 */

/** @type {MilestoneCfg[]} */
const MILESTONES = [
  {
    milestone: "M1",
    dir: "m1-remediation-r1",
    planFile: "docs/remediation-milestones/m1-remediation-r1.md",
    githubMilestone: "remediation-m1-r1",
    tasks: [
      {
        parent: "A1",
        taskSlug: "Suite RuleTester R1",
        fileSlug: "ruletester-r1-suite",
        parentTokens: 35_000,
        labels: "`type/feature`, `area/remediation-R1`",
        outputs:
          "Ficheiros em `packages/eslint-plugin-hardcode-detect/tests/` cobrindo happy path e exclusões R1.",
        criterion: "`npm test -w eslint-plugin-hardcode-detect` com todos os casos R1 a passar.",
        deps: "Marco M0 entregue.",
        inputs:
          "Contrato pós-M0; `reference/Clippings/` (ESLint fix / RuleTester).",
        codePaths: "`packages/eslint-plugin-hardcode-detect/tests/`",
        contractHint: "`specs/plugin-contract.md` e M0",
      },
      {
        parent: "A2",
        taskSlug: "Política suggest vs fix (R1)",
        fileSlug: "suggest-vs-fix-policy",
        parentTokens: 15_000,
        labels: "`type/docs`, `area/remediation-R1`",
        outputs:
          "Documentação da regra / README do pacote com critérios reproducíveis para `suggest` vs `fix`.",
        criterion:
          "Comportamento `suggest` vs `fix` reproduzível nos testes ou documentação normativa.",
        deps: "Sub-micro-tarefas de A1 concluídas (suite RuleTester).",
        inputs:
          "Resultado da suite A1; `docs/hardcode-remediation-macro-plan.md` (contexto segredos).",
        codePaths:
          "`packages/eslint-plugin-hardcode-detect/docs/rules/`, `packages/eslint-plugin-hardcode-detect/README.md` e alinhamento com `tests/`",
        contractHint: "`specs/plugin-contract.md`",
      },
    ],
  },
  {
    milestone: "M2",
    dir: "m2-remediation-r2-global",
    planFile: "docs/remediation-milestones/m2-remediation-r2-global.md",
    githubMilestone: "remediation-m2-r2-global",
    tasks: [
      {
        parent: "A1",
        taskSlug: "Normalização e chave de duplicado (R2)",
        fileSlug: "normalization-dup-key",
        parentTokens: 14_000,
        labels: "`type/feature`, `area/remediation-R2`",
        outputs:
          "Especificação e implementação coerentes: normalização e chave para «mesmo valor» em R2.",
        criterion: "Comportamento único e testável para «mesmo valor» em R2.",
        deps: "Marco M1 concluído.",
        inputs: "`docs/hardcode-remediation-macro-plan.md` (verificação global).",
        codePaths: "`packages/eslint-plugin-hardcode-detect/src/` e comentários normativos em `specs/` se aplicável",
        contractHint: "`specs/plugin-contract.md`",
      },
      {
        parent: "A3",
        taskSlug: "Fixture e2e multi-ficheiro (R2)",
        fileSlug: "e2e-multi-file-fixture",
        parentTokens: 40_000,
        labels: "`type/feature`, `area/remediation-R2`",
        outputs:
          "Massa em `packages/e2e-fixture-*` ou extensão do e2e do plugin com dois ou mais ficheiros.",
        criterion: "Runner e2e associado com exit 0.",
        deps: "Sub-micro-tarefas de A1 e A2 (ADR) concluídas.",
        inputs:
          "`specs/e2e-fixture-nest.md` como referência de massa; decisões de A1/A2.",
        codePaths:
          "`packages/eslint-plugin-hardcode-detect/e2e/`, `packages/e2e-fixture-*/` (se criado)",
        contractHint: "`specs/plugin-contract.md` e `specs/e2e-fixture-nest.md`",
      },
    ],
  },
  {
    milestone: "M3",
    dir: "m3-remediation-r3-data-files",
    planFile: "docs/remediation-milestones/m3-remediation-r3-data-files.md",
    githubMilestone: "remediation-m3-r3-data",
    tasks: [
      {
        parent: "A1",
        taskSlug: "Writers JSON/YAML (MVP R3)",
        fileSlug: "writers-json-yaml",
        parentTokens: 45_000,
        labels: "`type/feature`, `area/remediation-R3`",
        outputs:
          "Módulo em `packages/eslint-plugin-hardcode-detect/src/` + testes unitários dos writers.",
        criterion: "Merge determinístico para casos MVP acordados.",
        deps: "Marco M2 concluído.",
        inputs: "Requisitos do plano M3; testes de merge e encoding.",
        codePaths:
          "`packages/eslint-plugin-hardcode-detect/src/`, `packages/eslint-plugin-hardcode-detect/tests/`",
        contractHint: "`specs/plugin-contract.md`",
      },
      {
        parent: "A3",
        taskSlug: "Fixture e2e R3 (ficheiros de dados)",
        fileSlug: "e2e-fixture-r3",
        parentTokens: 35_000,
        labels: "`type/feature`, `area/remediation-R3`",
        outputs:
          "Massa `packages/e2e-fixture-*` ou cenário e2e que gera `.json`/`.yml`.",
        criterion: "e2e verde com geração de ficheiros de configuração.",
        deps: "Sub-micro-tarefas de A1 (writers) concluídas.",
        inputs: "Writers A1; macro-plan (fixtures adicionais).",
        codePaths: "`packages/eslint-plugin-hardcode-detect/e2e/`, fixtures permitidas",
        contractHint: "`specs/plugin-contract.md`",
      },
    ],
  },
  {
    milestone: "M4",
    dir: "m4-secrets-remediation",
    planFile: "docs/remediation-milestones/m4-secrets-remediation.md",
    githubMilestone: "remediation-m4-secrets",
    tasks: [
      {
        parent: "A1",
        taskSlug: "RuleTester segredos (defaults seguros)",
        fileSlug: "ruletester-secrets-safe-defaults",
        parentTokens: 30_000,
        labels: "`type/feature`, `area/remediation-secrets`",
        outputs:
          "Casos de teste que garantem que outputs de fix não reproduzem tokens sensíveis em claro.",
        criterion: "Todos os casos passam; revisão manual de diffs.",
        deps: "Marco M3 concluído.",
        inputs: "`docs/hardcoding-map.md` (nível L1).",
        codePaths: "`packages/eslint-plugin-hardcode-detect/tests/`",
        contractHint: "`specs/plugin-contract.md` e política de segredos no macro-plan",
      },
    ],
  },
];

function microTokenBudget(parentTokens, roleSlug) {
  const weights = {
    arquiteto: 0.08,
    "analista-negocio": 0.12,
    "revisor-negocio": 0.08,
    desenvolvedor: 0.28,
    "revisor-desenvolvimento": 0.1,
    "analista-testes": 0.12,
    "revisor-testes": 0.08,
    testador: 0.08,
    "dev-especialista-correcoes": 0.06,
  };
  return Math.round(parentTokens * weights[roleSlug]);
}

function dependsOnLine(milestone, task, index) {
  if (index === 0) {
    if (milestone.milestone === "M1" && task.parent === "A1") return "M0 concluído.";
    if (milestone.milestone === "M1" && task.parent === "A2")
      return "Última sub-micro-tarefa de A1 (testador ou pipeline verde).";
    if (milestone.milestone === "M2" && task.parent === "A1") return "M1 concluído.";
    if (milestone.milestone === "M2" && task.parent === "A3")
      return "Sub-micro-tarefas M2-A1 e tarefa A2 (ADR) concluídas.";
    if (milestone.milestone === "M3" && task.parent === "A1") return "M2 concluído.";
    if (milestone.milestone === "M3" && task.parent === "A3")
      return "Sub-micro-tarefas M3-A1 concluídas.";
    if (milestone.milestone === "M4" && task.parent === "A1") return "M3 concluído.";
  }
  const prev = `${milestone.milestone}-${task.parent}-${String(index).padStart(2, "0")}`;
  return `Sub-micro-tarefa \`${prev}\` concluída.`;
}

function buildMarkdown(milestone, task, role, roleIndex) {
  const yy = String(roleIndex + 1).padStart(2, "0");
  const microId = `${milestone.milestone}-${task.parent}-${yy}`;
  const filename = `${microId}-papel-${role.slug}-${task.fileSlug}.md`;
  const ctx = {
    codePaths: task.codePaths,
    contractHint: task.contractHint,
  };
  const focus = role.focus(ctx);

  return {
    filename,
    body: `# ${microId} — ${role.title} — ${task.taskSlug}

| Campo | Valor |
|-------|--------|
| micro_id | ${microId} |
| milestone | ${milestone.milestone} |
| github_milestone | ${milestone.githubMilestone} |
| parent_task | ${task.parent} |
| role | ${role.slug} |
| labels_sugeridas | ${task.labels} |
| token_budget_estimate | ${microTokenBudget(task.parentTokens, role.slug)} |
| single_focus | ${focus} |
| depends_on | ${dependsOnLine(milestone, task, roleIndex)} |

## Plano do marco

- [\`${milestone.planFile}\`](../../../${milestone.planFile.replace(/^docs\/remediation-milestones\//u, "")}) — secção 7 (Camada A).

## Inputs

${task.inputs}

## Outputs

${role.slug === "desenvolvedor" || role.slug === "testador" || role.slug === "dev-especialista-correcoes" ? task.outputs : `Contribuição do papel **${role.title}** para os outputs agregados de ${task.parent}: ${task.outputs}`}

## Critério de conclusão

${role.slug === "testador" ? task.criterion : `Papel **${role.title}**: entregáveis deste ficheiro concluídos; alinhado ao critério global de ${task.parent}: ${task.criterion}`}

## Dependências

${dependsOnLine(milestone, task, roleIndex)}

## Paths principais

${task.codePaths}

`,
  };
}

function microReadme(milestone, entries) {
  const lines = [
    `# ${milestone.milestone} — Sub-micro-tarefas por papel (Camada A)`,
    "",
    `Âncoras: plano [\`${milestone.planFile}\`](../../../${milestone.planFile.replace(/^docs\/remediation-milestones\//u, "")}).`,
    "",
    "## Grafo sugerido (por tarefa-mãe)",
    "",
    "Por cada `A{x}`, a ordem típica é: arquiteto → analista de negócio → revisor de negócio → desenvolvedor → revisor de desenvolvimento → analista de testes → revisor de testes → testador → (condicional) dev especialista em correcções.",
    "",
    "## Índice",
    "",
    "| micro_id | Papel | parent_task | Ficheiro |",
    "|------------|-------|-------------|----------|",
  ];
  for (const e of entries) {
    lines.push(
      `| ${e.microId} | ${e.roleTitle} | ${e.parent} | [${e.filename}](${e.filename}) |`,
    );
  }
  lines.push("");
  return lines.join("\n");
}

function coverageManifest(milestone, allRelPaths, planFile) {
  const byParent = {};
  for (const p of allRelPaths) {
    const m = p.match(/M\d+-A(\d+)-\d{2}/u);
    const parent = m ? `A${m[1]}` : "A?";
    if (!byParent[parent]) byParent[parent] = [];
    byParent[parent].push(p);
  }
  const requirements = [];
  for (const [parent, micro_files] of Object.entries(byParent)) {
    requirements.push({
      id: `${milestone.dir}-sec7-${parent}`,
      description: `Camada A §7 — ${parent}: sub-micro-tarefas por papel`,
      micro_files,
    });
  }
  return {
    manifest_version: "1",
    milestone: milestone.milestone,
    plan_file: planFile,
    requirements,
  };
}

const allManifestPaths = [];

for (const ms of MILESTONES) {
  const baseDir = join(
    repoRoot,
    "docs/remediation-milestones/tasks",
    ms.dir,
    "micro",
  );
  mkdirSync(baseDir, { recursive: true });
  const readmeEntries = [];

  for (const task of ms.tasks) {
    for (let i = 0; i < ROLES.length; i++) {
      const role = ROLES[i];
      const { filename, body } = buildMarkdown(ms, task, role, i);
      const abs = join(baseDir, filename);
      writeFileSync(abs, body, "utf8");
      const microId = `${ms.milestone}-${task.parent}-${String(i + 1).padStart(2, "0")}`;
      readmeEntries.push({
        microId,
        roleTitle: role.title,
        parent: task.parent,
        filename,
      });
      allManifestPaths.push(
        `docs/remediation-milestones/tasks/${ms.dir}/micro/${filename}`,
      );
    }
  }

  const manifest = coverageManifest(
    ms,
    allManifestPaths.filter((p) => p.includes(`/${ms.dir}/micro/`)),
    ms.planFile,
  );
  writeFileSync(
    join(repoRoot, "docs/remediation-milestones/tasks", ms.dir, "coverage-manifest.json"),
    `${JSON.stringify(manifest, null, 2)}\n`,
    "utf8",
  );

  writeFileSync(join(baseDir, "README.md"), microReadme(ms, readmeEntries), "utf8");
}

console.log(
  `Gerados ficheiros em docs/remediation-milestones/tasks/*/micro/ e coverage-manifest.json (${allManifestPaths.length} ficheiros micro).`,
);
