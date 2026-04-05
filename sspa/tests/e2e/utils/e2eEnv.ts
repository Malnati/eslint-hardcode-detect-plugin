// tests/e2e/utils/e2eEnv.ts
import fs from 'fs';
import path from 'path';

let dotEnvLoaded = false;

/** Caminho absoluto de `tests/.env` (relativo a este ficheiro). */
export function getTestsDotEnvPath(): string {
  return path.resolve(__dirname, '../../.env');
}

/**
 * Carrega variáveis de `tests/.env` para `process.env` (sem sobrescrever chaves já definidas no ambiente).
 * Idempotente.
 */
export function loadTestsDotEnv(): void {
  if (dotEnvLoaded) {
    return;
  }
  dotEnvLoaded = true;
  const envPath = getTestsDotEnvPath();
  if (!fs.existsSync(envPath)) {
    return;
  }
  const raw = fs.readFileSync(envPath, 'utf8');
  for (const line of raw.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }
    const eq = trimmed.indexOf('=');
    if (eq === -1) {
      continue;
    }
    const key = trimmed.slice(0, eq).trim();
    if (!key) {
      continue;
    }
    let val = trimmed.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (process.env[key] === undefined) {
      process.env[key] = val;
    }
  }
}

export function e2eConfigError(cause: string, suggest: string): Error {
  return new Error(`ERROR: ${cause}\nSUGGEST: ${suggest}`);
}

/** Hostname é domínio nip.io (inclui subdomínios). */
function isNipIoHostname(hostname: string): boolean {
  const h = hostname.toLowerCase();
  return h === 'nip.io' || h.endsWith('.nip.io');
}

/**
 * Em macOS (Darwin), a suíte Playwright no host não deve usar nip.io como URL do browser;
 * usar túnel ngrok (`E2E_BASE_URL` via Makefile `test-e2e-ngrok*`).
 * Ignorado se `E2E_ALLOW_NIPIO_ON_DARWIN` for `1` ou `true`.
 */
export function assertNoNipioBrowserBaseUrlOnDarwin(url: string): void {
  if (process.platform !== 'darwin') {
    return;
  }
  loadTestsDotEnv();
  const allow =
    process.env.E2E_ALLOW_NIPIO_ON_DARWIN === '1' ||
    process.env.E2E_ALLOW_NIPIO_ON_DARWIN === 'true';
  if (allow) {
    return;
  }
  try {
    const host = new URL(url).hostname;
    if (isNipIoHostname(host)) {
      throw e2eConfigError(
        `Em macOS (Darwin), URL E2E não deve usar hostname nip.io: ${url}`,
        `Use URL pública ngrok (ex.: make print-e2e-ngrok-url, alvos make test-e2e-ngrok*). Para diagnóstico excecional, defina E2E_ALLOW_NIPIO_ON_DARWIN=1.`,
      );
    }
  } catch (e) {
    if (e instanceof Error && e.message.startsWith('ERROR:')) {
      throw e;
    }
  }
}

/**
 * Variável obrigatória: tem de existir em tests/.env (ou ambiente) e não pode ser só espaços.
 */
export function requireNonEmptyEnv(name: string): string {
  loadTestsDotEnv();
  const raw = process.env[name];
  if (raw === undefined || raw.trim() === '') {
    throw e2eConfigError(
      `Variável de ambiente obrigatória ausente ou vazia: ${name}.`,
      `Defina ${name} em tests/.env (sem valor em branco) com o valor correto para o stack E2E.`,
    );
  }
  return raw.trim();
}

/**
 * Valor opcional: se a chave existir mas estiver em branco, falha (não utiliza valor por omissão para strings vazias).
 */
export function getEnvOrDefault(name: string, defaultValue: string): string {
  loadTestsDotEnv();
  if (process.env[name] === undefined) {
    return defaultValue;
  }
  const v = process.env[name]?.trim();
  if (v === '') {
    throw e2eConfigError(
      `Variável ${name} está definida mas vazia em tests/.env.`,
      `Remova a linha ou preencha com um valor válido; não use strings vazias.`,
    );
  }
  return v as string;
}

export function requirePositiveIntEnv(name: string): number {
  const raw = requireNonEmptyEnv(name);
  const n = Number(raw);
  if (!Number.isFinite(n) || n <= 0 || !Number.isInteger(n)) {
    throw e2eConfigError(
      `Variável ${name} deve ser um inteiro positivo; recebido: ${raw}.`,
      `Corrija ${name} em tests/.env (ex.: TTL em segundos).`,
    );
  }
  return n;
}

/** URLs base do Playwright / shell integrado (import map, rotas relativas). */
export function assertShellE2eEnv(): void {
  requireNonEmptyEnv('E2E_BASE_URL');
  requireNonEmptyEnv('E2E_DOMAIN');
}

/** Hosts mock vs real para parity de bundles e contratos. */
export function assertParityHostsE2eEnv(): void {
  requireNonEmptyEnv('E2E_PARITY_MOCK_URL');
  requireNonEmptyEnv('E2E_PARITY_REAL_URL');
}

/** Gateway (E2E_BASE_URL), domínio nip.io e origem do login standalone. */
export function assertLoginStandaloneE2eEnv(): void {
  requireNonEmptyEnv('E2E_BASE_URL');
  requireNonEmptyEnv('E2E_DOMAIN');
  requireNonEmptyEnv('E2E_LOGIN_ORIGIN');
}

/** Subdomínio do serviço de login (host sem esquema). */
export function assertLoginDomainE2eEnv(): void {
  requireNonEmptyEnv('LOGIN_DOMAIN');
}

/**
 * True quando `E2E_LOGIN_ORIGIN` usa hostname `login.<nip>` (standalone no Caddy).
 * Com túnel ngrok único ao shell (`NGROK_TUNNEL_HOST` omisso → `<NIPIO_IP>.nip.io`), o origin público não tem prefixo `login.` — os specs «login nip.io» não aplicam; use `NGROK_TUNNEL_HOST=login.<NIPIO_IP>.nip.io` ou `test-e2e-nipio` no servidor.
 */
export function isLoginNipioStyleStandaloneOrigin(): boolean {
  loadTestsDotEnv();
  const o = process.env.E2E_LOGIN_ORIGIN?.trim();
  if (!o) {
    return false;
  }
  try {
    return new URL(o).hostname.startsWith('login.');
  } catch {
    return false;
  }
}

/**
 * Mensagem para `test.skip` quando o login standalone exige `login.<nip>` no Caddy.
 * Com URL pública ngrok única ao shell, `E2E_LOGIN_ORIGIN` aponta para o hostname ngrok (não `login.*`);
 * nesse caso use `test-e2e-login-ngrok` ou um túnel dedicado (`NGROK_TUNNEL_HOST`). Ver docs/stack-edge.md.
 */
export const E2E_SKIP_MFE_LOGIN_STANDALONE_UNLESS_LOGIN_NIPIO_HOST =
  'MFE login standalone (#login-user) é servido em login.<NIPIO_IP>.nip.io. Com túnel ngrok único (Makefile → E2E_LOGIN_ORIGIN = URL ngrok), o upstream usa Host <NIPIO>.nip.io (shell), não o bloco login.* — ver isLoginNipioStyleStandaloneOrigin e test-e2e-login-ngrok.';

/**
 * Origem do shell SSPA (rota `/login` com tema/design-system).
 * Quando `E2E_BASE_URL` aponta só para `login.<nip>` (parity do build do mfe-login),
 * defina `E2E_SHELL_BASE_URL=https://<IP>.nip.io` para estes testes.
 */
export function getShellBaseUrlForE2E(): string {
  loadTestsDotEnv();
  const shell = process.env.E2E_SHELL_BASE_URL?.trim();
  if (shell) {
    return shell.replace(/\/$/, '');
  }
  return requireNonEmptyEnv('E2E_BASE_URL').replace(/\/$/, '');
}

/** Gateway auth: TTL do token e IP para URL do MFE login no runtime-config. */
export function assertGatewayAuthE2eEnv(): void {
  assertParityHostsE2eEnv();
  requireNonEmptyEnv('NIPIO_IP');
  requirePositiveIntEnv('API_AUTH_E2E_TOKEN_TTL_SECONDS');
}

/** CORS / Origin nip.io alinhado ao gateway. */
export function assertTookynOriginE2eEnv(): void {
  assertParityHostsE2eEnv();
  requireNonEmptyEnv('E2E_NIPIO_ORIGIN');
}

/** Ruta: domínios e URL opcional para health interno (porta direta). */
export function assertRutaAuthE2eEnv(): void {
  requireNonEmptyEnv('E2E_DOMAIN');
  requireNonEmptyEnv('PROD_DOMAIN');
  requireNonEmptyEnv('E2E_PROD_DIRECT_HEALTH_URL');
}

/** Pedidos HTTP ao host principal (sspa-health, login-mfe assets). */
export function assertBaseUrlE2eEnv(): void {
  requireNonEmptyEnv('E2E_BASE_URL');
}

/** Tenant mock / gateway no mesmo domínio. */
export function assertTenantMockE2eEnv(): void {
  requireNonEmptyEnv('E2E_DOMAIN');
}
