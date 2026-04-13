#!/usr/bin/env node
/**
 * Valida manifestos de cobertura dos marcos de distribuição (M0, M1, M2, …):
 * ficheiros micro existem, micro_id no conteúdo, e nenhum ficheiro micro órfão.
 *
 * Executar na raiz do repositório: node scripts/validate-milestone-plan-coverage.mjs
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, "..");

/** @type {{ manifestRel: string; microDirRel: string; filePrefix: string }[]} */
const MILESTONE_CONFIG = [
  {
    manifestRel: "docs/distribution-milestones/tasks/m0-baseline/coverage-manifest.json",
    microDirRel: "docs/distribution-milestones/tasks/m0-baseline/micro",
    filePrefix: "M0-",
  },
  {
    manifestRel: "docs/distribution-milestones/tasks/m1-channel-t1-t2/coverage-manifest.json",
    microDirRel: "docs/distribution-milestones/tasks/m1-channel-t1-t2/micro",
    filePrefix: "M1-",
  },
  {
    manifestRel: "docs/distribution-milestones/tasks/m2-channel-t3-ci/coverage-manifest.json",
    microDirRel: "docs/distribution-milestones/tasks/m2-channel-t3-ci/micro",
    filePrefix: "M2-",
  },
];

/**
 * @param {string} filename
 * @returns {string | null}
 */
function expectedMicroIdFromFilename(filename) {
  if (!filename.endsWith(".md")) {
    return null;
  }
  const base = filename.slice(0, -3);
  const m = base.match(/^(M\d+-A\d+-\d{2})/u);
  return m ? m[1] : null;
}

/**
 * @param {{ manifestRel: string; microDirRel: string; filePrefix: string }} cfg
 */
function validateOne(cfg) {
  const manifestPath = join(repoRoot, cfg.manifestRel);
  const label = cfg.manifestRel;

  const errors = [];

  if (!existsSync(manifestPath)) {
    return [`Manifest em falta: ${label}`];
  }

  /** @type {{ requirements: { id: string; micro_files: string[] }[]; external_gates?: { id: string; documented_in?: string }[] }} */
  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));

  const referenced = new Set();

  for (const req of manifest.requirements) {
    if (!req.micro_files?.length) {
      errors.push(`[${label}] Requisito "${req.id}" sem micro_files.`);
      continue;
    }
    for (const rel of req.micro_files) {
      referenced.add(rel);
      const abs = join(repoRoot, rel);
      if (!existsSync(abs)) {
        errors.push(`[${req.id}] ficheiro em falta: ${rel}`);
        continue;
      }
      const base = rel.split("/").pop() ?? "";
      const microId = expectedMicroIdFromFilename(base);
      if (!microId) {
        errors.push(`[${req.id}] nome inválido para micro-tarefa: ${rel}`);
        continue;
      }
      const body = readFileSync(abs, "utf8");
      const idLine = new RegExp(
        `\\|\\s*micro_id\\s*\\|\\s*${microId.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&")}\\s*\\|`,
        "u",
      );
      if (!idLine.test(body)) {
        errors.push(`[${req.id}] ${rel} deve conter "| micro_id | ${microId} |" na tabela de metadados.`);
      }
    }
  }

  const microDir = join(repoRoot, cfg.microDirRel);
  if (!existsSync(microDir)) {
    errors.push(`Diretório micro em falta: ${cfg.microDirRel}`);
    return errors;
  }

  const onDisk = readdirSync(microDir).filter(
    (f) => f.startsWith(cfg.filePrefix) && f.endsWith(".md"),
  );
  const referencedBases = new Set([...referenced].map((p) => p.split("/").pop()));
  for (const f of onDisk) {
    if (!referencedBases.has(f)) {
      errors.push(`Ficheiro micro não referenciado no manifesto (${label}): ${cfg.microDirRel}/${f}`);
    }
  }

  if (manifest.external_gates?.length) {
    for (const gate of manifest.external_gates) {
      const g = /** @type {{ id: string; documented_in?: string }} */ (gate);
      if (g.documented_in) {
        const p = join(repoRoot, g.documented_in);
        if (!existsSync(p)) {
          errors.push(`external_gate ${g.id}: documented_in em falta: ${g.documented_in}`);
        }
      }
    }
  }

  return errors;
}

function main() {
  const allErrors = [];
  let totalMicro = 0;
  let totalReq = 0;
  let totalGates = 0;

  for (const cfg of MILESTONE_CONFIG) {
    const errs = validateOne(cfg);
    allErrors.push(...errs);

    const manifestPath = join(repoRoot, cfg.manifestRel);
    if (existsSync(manifestPath)) {
      const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
      totalReq += manifest.requirements?.length ?? 0;
      totalGates += manifest.external_gates?.length ?? 0;
      const referenced = new Set();
      for (const req of manifest.requirements ?? []) {
        for (const rel of req.micro_files ?? []) {
          referenced.add(rel);
        }
      }
      totalMicro += referenced.size;
    }
  }

  if (allErrors.length) {
    console.error("validate-milestone-plan-coverage: falhas:\n");
    for (const e of allErrors) {
      console.error(`  - ${e}`);
    }
    process.exitCode = 1;
    return;
  }

  console.log(
    `validate-milestone-plan-coverage: OK (${MILESTONE_CONFIG.length} manifestos, ${totalMicro} referências micro-ficheiros únicas nos manifests, ${totalReq} requisitos, ${totalGates} gates externos).`,
  );
}

main();
