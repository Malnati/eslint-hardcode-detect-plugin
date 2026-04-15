/**
 * Preflight: instala `eslint-plugin-hardcode-detect@latest` em `e2e-registry-consumer/`,
 * deduplica execuções locais por (commit, versão npm), corre `node --test` só nos e2e
 * com HCD_E2E_REGISTRY_PLUGIN_ROOT definido e regista sucessos em `.e2e-registry-control.jsonl`.
 */
/* eslint-disable n/no-process-exit -- orquestrador CLI: códigos de saída explícitos */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const packageDir = path.resolve(__dirname, "..");
const repoRoot = path.resolve(packageDir, "../..");
const consumerDir = path.join(repoRoot, "e2e-registry-consumer");
const pluginPkgRoot = path.join(
  consumerDir,
  "node_modules",
  "eslint-plugin-hardcode-detect",
);
const controlFile = path.join(
  packageDir,
  "e2e",
  ".e2e-registry-control.jsonl",
);

const E2E_FILES = [
  "e2e/r2-multi-file.e2e.mjs",
  "e2e/r3-data-files.e2e.mjs",
  "e2e/call-site-exceptions.e2e.mjs",
  "e2e/options-matrix.e2e.mjs",
  "e2e/r3-fail-conflict.e2e.mjs",
  "e2e/nest-workspace.e2e.mjs",
];

function isDedupDisabled() {
  if (process.env.CI === "true" || process.env.GITHUB_ACTIONS === "true") {
    return true;
  }
  if (
    process.env.HCD_E2E_FORCE === "1" ||
    process.env.HCD_E2E_SKIP_REGISTRY_DEDUP === "1"
  ) {
    return true;
  }
  return false;
}

function runNpmInstallConsumer() {
  const r = spawnSync("npm", ["install"], {
    cwd: consumerDir,
    stdio: "inherit",
    encoding: "utf8",
    shell: false,
  });
  if (r.status !== 0) {
    console.error(
      "[e2e-registry] Falha ao executar `npm install` em e2e-registry-consumer/. Verifique rede e acesso ao npm registry.",
    );
    process.exit(r.status ?? 1);
  }
}

function readInstalledVersion() {
  const pkgJsonPath = path.join(pluginPkgRoot, "package.json");
  if (!fs.existsSync(pkgJsonPath)) {
    console.error(
      `[e2e-registry] Pacote instalado não encontrado em ${pluginPkgRoot}.`,
    );
    process.exit(1);
  }
  const v = JSON.parse(fs.readFileSync(pkgJsonPath, "utf8")).version;
  if (!v || typeof v !== "string") {
    console.error("[e2e-registry] Versão inválida no package.json instalado.");
    process.exit(1);
  }
  return v;
}

function getGitHead() {
  const r = spawnSync("git", ["rev-parse", "HEAD"], {
    cwd: repoRoot,
    encoding: "utf8",
    shell: false,
  });
  if (r.status !== 0 || !r.stdout) {
    console.error(
      "[e2e-registry] Não foi possível obter o commit atual (`git rev-parse HEAD`). Execute a partir de um clone git.",
    );
    process.exit(1);
  }
  return r.stdout.trim();
}

/**
 * @returns {Array<{ commit: string; npmVersion: string }>}
 */
function readControlEntries() {
  if (!fs.existsSync(controlFile)) {
    return [];
  }
  const lines = fs.readFileSync(controlFile, "utf8").split("\n");
  /** @type {Array<{ commit: string; npmVersion: string }>} */
  const out = [];
  for (const line of lines) {
    const t = line.trim();
    if (!t) continue;
    try {
      const o = JSON.parse(t);
      if (o && typeof o.commit === "string" && typeof o.npmVersion === "string") {
        out.push({ commit: o.commit, npmVersion: o.npmVersion });
      }
    } catch {
      // ignora linhas corrompidas
    }
  }
  return out;
}

function shouldAbortDuplicate(commit, npmVersion) {
  if (isDedupDisabled()) {
    return false;
  }
  const entries = readControlEntries();
  return entries.some(
    (e) => e.commit === commit && e.npmVersion === npmVersion,
  );
}

function appendControlRecord(commit, npmVersion) {
  const record = {
    commit,
    npmVersion,
    recordedAt: new Date().toISOString(),
  };
  fs.appendFileSync(controlFile, `${JSON.stringify(record)}\n`, "utf8");
}

function main() {
  if (!fs.existsSync(path.join(consumerDir, "package.json"))) {
    console.error(
      `[e2e-registry] Diretório e2e-registry-consumer em falta em ${consumerDir}.`,
    );
    process.exit(1);
  }

  runNpmInstallConsumer();

  const npmVersion = readInstalledVersion();
  const commit = getGitHead();

  if (shouldAbortDuplicate(commit, npmVersion)) {
    const controlRel = path.relative(repoRoot, controlFile);
    console.error(
      `[HCD-E2E-REGISTRY] Este par (commit + versão npm) já foi testado com sucesso anteriormente.`,
    );
    console.error(`  commit:     ${commit}`);
    console.error(`  npmVersion: ${npmVersion}`);
    console.error(`  controlo:   ${controlRel}`);
    console.error(
      `Para forçar nova execução local: HCD_E2E_FORCE=1 ou HCD_E2E_SKIP_REGISTRY_DEDUP=1`,
    );
    process.exit(1);
  }

  const env = {
    ...process.env,
    HCD_E2E_REGISTRY_PLUGIN_ROOT: pluginPkgRoot,
  };

  const args = ["--test", ...E2E_FILES.map((f) => path.join(packageDir, f))];
  const r = spawnSync(process.execPath, args, {
    cwd: packageDir,
    env,
    stdio: "inherit",
    shell: false,
  });

  if (r.status === 0) {
    appendControlRecord(commit, npmVersion);
  }

  process.exit(r.status ?? 1);
}

main();
