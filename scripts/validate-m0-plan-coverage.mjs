#!/usr/bin/env node
/**
 * Valida o manifesto de cobertura M0: ficheiros micro existem, micro_id no conteúdo,
 * e nenhum M0-*.md em tasks/m0-baseline/micro/ fica órfão do manifesto.
 *
 * Executar na raiz do repositório: node scripts/validate-m0-plan-coverage.mjs
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, "..");

const MANIFEST_REL = "docs/distribution-milestones/tasks/m0-baseline/coverage-manifest.json";
const MICRO_DIR_REL = "docs/distribution-milestones/tasks/m0-baseline/micro";

function expectedMicroIdFromFilename(filename) {
  if (!filename.startsWith("M0-") || !filename.endsWith(".md")) {
    return null;
  }
  const base = filename.slice(0, -3);
  const m = base.match(/^(M0-A[1-5]-\d{2})/u);
  return m ? m[1] : null;
}

function main() {
  const manifestPath = join(repoRoot, MANIFEST_REL);
  if (!existsSync(manifestPath)) {
    console.error(`validate-m0-plan-coverage: manifest em falta: ${MANIFEST_REL}`);
    process.exitCode = 1;
    return;
  }

  /** @type {{ requirements: { id: string; micro_files: string[] }[]; external_gates?: unknown[] }} */
  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));

  const referenced = new Set();
  const errors = [];

  for (const req of manifest.requirements) {
    if (!req.micro_files?.length) {
      errors.push(`Requisito "${req.id}" sem micro_files.`);
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

  const microDir = join(repoRoot, MICRO_DIR_REL);
  const onDisk = readdirSync(microDir).filter(
    (f) => f.startsWith("M0-") && f.endsWith(".md"),
  );
  const referencedBases = new Set(
    [...referenced].map((p) => p.split("/").pop()),
  );
  for (const f of onDisk) {
    if (!referencedBases.has(f)) {
      errors.push(`Ficheiro micro não referenciado no manifesto: ${MICRO_DIR_REL}/${f}`);
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

  if (errors.length) {
    console.error("validate-m0-plan-coverage: falhas:\n");
    for (const e of errors) {
      console.error(`  - ${e}`);
    }
    process.exitCode = 1;
    return;
  }

  console.log(
    `validate-m0-plan-coverage: OK (${referenced.size} micro-ficheiros, ${manifest.requirements.length} requisitos, ${manifest.external_gates?.length ?? 0} gates externos).`,
  );
}

main();
