import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const packageJsonPath = new URL(
  "../packages/eslint-plugin-hardcode-detect/package.json",
  import.meta.url,
);
const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"));
const packageName = packageJson.name;
const packageVersion = packageJson.version;

function fail(message) {
  console.error(message);
  process.exit(1);
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    stdio: "inherit",
    ...options,
  });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function runCapture(command, args, options = {}) {
  return spawnSync(command, args, {
    encoding: "utf8",
    ...options,
  });
}

function getTokenFromEnv() {
  const token = process.env.NPM_ACCESS_TOKEN ?? process.env.NODE_AUTH_TOKEN;
  if (token && token.trim().length > 0) {
    return token;
  }
  return null;
}

function verifyNpmSessionAuth() {
  console.log("Validando autenticacao npm pela sessao local...");
  run("npm", ["whoami"], { env: process.env });
}

function withTempNpmConfig(token, callback) {
  const tempDir = mkdtempSync(join(tmpdir(), "hcd-npm-release-"));
  const npmrcPath = join(tempDir, ".npmrc");
  writeFileSync(
    npmrcPath,
    "registry=https://registry.npmjs.org/\n//registry.npmjs.org/:_authToken=${NODE_AUTH_TOKEN}\nalways-auth=true\n",
    "utf8",
  );

  const env = {
    ...process.env,
    NODE_AUTH_TOKEN: token,
    NPM_CONFIG_USERCONFIG: npmrcPath,
  };

  try {
    callback(env);
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
}

function precheck() {
  const token = getTokenFromEnv();
  if (token) {
    withTempNpmConfig(token, (env) => {
      console.log("Validando autenticacao npm por NPM_ACCESS_TOKEN...");
      run("npm", ["whoami"], { env });
    });
    return;
  }
  verifyNpmSessionAuth();
}

function checkVersionNotPublished() {
  const spec = `${packageName}@${packageVersion}`;
  const result = runCapture("npm", ["view", spec, "version"], {
    env: process.env,
  });
  if (result.status === 0 && result.stdout.trim() === packageVersion) {
    fail(`Versao ja publicada no npm: ${spec}`);
  }
  console.log(`Versao disponivel para publicacao: ${spec}`);
}

function publish() {
  const token = getTokenFromEnv();
  const runPublish = (env) => {
    console.log(`Publicando ${packageName}@${packageVersion} no npm...`);
    const publishEnv = { ...env };
    const otp = process.env.NPM_OTP;
    if (otp && otp.trim().length > 0) {
      publishEnv.NPM_CONFIG_OTP = otp.trim();
    }
    const result = runCapture(
      "npm",
      ["run", "release:publish", "-w", "eslint-plugin-hardcode-detect"],
      { env: publishEnv },
    );

    process.stdout.write(result.stdout ?? "");
    process.stderr.write(result.stderr ?? "");

    if (result.status !== 0) {
      const combined = `${result.stdout ?? ""}\n${result.stderr ?? ""}`;
      if (combined.includes("E404") && combined.includes("Not Found - PUT")) {
        fail(
          `Publish recusado pelo registry para ${packageName}@${packageVersion}. ` +
            "Verifique permissao do token para criar/publicar este pacote e ownership do nome.",
        );
      }
      process.exit(result.status ?? 1);
    }
  };

  if (token) {
    withTempNpmConfig(token, (env) => {
      runPublish(env);
    });
    return;
  }

  verifyNpmSessionAuth();
  runPublish(process.env);
}

function sleep(ms) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

function smoke() {
  const testDir = mkdtempSync(join(tmpdir(), "hcd-npm-smoke-"));
  const spec = `${packageName}@${packageVersion}`;
  let installed = false;

  try {
    console.log(`Executando smoke do pacote publicado (${spec})...`);
    run("npm", ["init", "-y"], { cwd: testDir });

    for (let attempt = 1; attempt <= 5; attempt += 1) {
      const install = runCapture("npm", ["install", spec], {
        cwd: testDir,
        env: process.env,
      });
      if (install.status === 0) {
        process.stdout.write(install.stdout ?? "");
        installed = true;
        break;
      }
      process.stderr.write(install.stderr ?? "");
      if (attempt < 5) {
        console.log(`Pacote ainda nao propagou no registry. Nova tentativa ${attempt + 1}/5...`);
        sleep(4000);
      }
    }

    if (!installed) {
      fail(`Falha ao instalar ${spec} no smoke pos-publish.`);
    }

    run(
      "node",
      [
        "--input-type=module",
        "--eval",
        "import plugin from 'eslint-plugin-hardcode-detect'; if (!plugin || !plugin.rules || !plugin.meta?.version) { throw new Error('Plugin importado sem metadados esperados'); } console.log('Smoke import OK:', plugin.meta.version);",
      ],
      { cwd: testDir, env: process.env },
    );
  } finally {
    rmSync(testDir, { recursive: true, force: true });
  }
}

const mode = process.argv[2];

switch (mode) {
  case "precheck":
    precheck();
    break;
  case "check-version":
    checkVersionNotPublished();
    break;
  case "publish":
    publish();
    break;
  case "smoke":
    smoke();
    break;
  default:
    fail("Modo invalido. Use: precheck | check-version | publish | smoke");
}
