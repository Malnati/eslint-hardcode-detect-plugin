// tests/e2e/utils/kongSecrets.ts
import './e2eEnv';
import * as fs from 'fs';
import * as path from 'path';
import { e2eConfigError, loadTestsDotEnv } from './e2eEnv';

export type KongCreds = { username: string; password: string };

/** Kong primeiro (bootstrap/sync gravam sempre); depois basic-auth legado. */
const SECRET_FILES = ['kong-credentials.json', 'basic-auth-creds.json'] as const;

function tryParse(raw: string): KongCreds | null {
  const parsed = JSON.parse(raw) as Record<string, unknown>;
  const basic = parsed.basic_auth as { username?: string; password?: string } | undefined;
  const username = (parsed.username ??
    basic?.username ??
    (parsed.basic_auth_credentials as { username?: string } | undefined)?.username) as string | null;
  const password = (parsed.password ??
    basic?.password ??
    (parsed.basic_auth_credentials as { password_raw?: string } | undefined)?.password_raw) as string | null;
  if (username && password) {
    return { username, password };
  }
  return null;
}

/**
 * Diretório `_secrets` na raiz do repositório.
 * Suporta `E2E_SECRETS_DIR`, `__dirname` (Playwright a partir de `tests/`) e fallbacks por `process.cwd()`.
 */
export function resolveSecretsBaseDir(): string {
  loadTestsDotEnv();
  const envDir = process.env.E2E_SECRETS_DIR?.trim();
  if (envDir) {
    return path.isAbsolute(envDir) ? envDir : path.resolve(process.cwd(), envDir);
  }

  const fromUtilsFile = path.resolve(__dirname, '../../..', '_secrets');
  const searchDirs = [
    fromUtilsFile,
    path.resolve(process.cwd(), '_secrets'),
    path.resolve(process.cwd(), '..', '_secrets'),
    path.resolve(process.cwd(), '../..', '_secrets'),
    path.resolve(process.cwd(), '../../..', '_secrets'),
  ];

  for (const dir of searchDirs) {
    try {
      for (const name of SECRET_FILES) {
        if (fs.existsSync(path.join(dir, name))) {
          return dir;
        }
      }
    } catch {
      /* continuar */
    }
  }

  return fromUtilsFile;
}

/**
 * Lê apenas `_secrets/` (automação Kong / sync-e2e-secrets / bootstrap).
 */
export function loadKongSecretsFromDisk(): KongCreds | null {
  const base = resolveSecretsBaseDir();
  for (const name of SECRET_FILES) {
    const credsPath = path.join(base, name);
    try {
      const raw = fs.readFileSync(credsPath, 'utf-8');
      const c = tryParse(raw);
      if (c) {
        return c;
      }
    } catch {
      /* tentar próximo ficheiro */
    }
  }
  return null;
}

/**
 * Ordem: ficheiros em `_secrets/` → `KONG_BASIC_AUTH_USER` / `KONG_BASIC_AUTH_PASSWORD` em tests/.env.
 */
export function resolveKongCredentialsForE2E(): KongCreds {
  loadTestsDotEnv();
  const fromDisk = loadKongSecretsFromDisk();
  if (fromDisk) {
    return fromDisk;
  }
  const username = process.env.KONG_BASIC_AUTH_USER?.trim();
  const password = process.env.KONG_BASIC_AUTH_PASSWORD?.trim();
  if (username && password) {
    return { username, password };
  }
  throw e2eConfigError(
    'Não foram encontradas credenciais Kong/Basic Auth: nenhum ficheiro legível em _secrets (kong-credentials.json / basic-auth-creds.json) e KONG_BASIC_AUTH_USER/KONG_BASIC_AUTH_PASSWORD ausentes ou vazios.',
    'Execute o alvo do Makefile que sincroniza segredos E2E ou defina KONG_BASIC_AUTH_USER e KONG_BASIC_AUTH_PASSWORD em tests/.env (sem committar segredos reais).',
  );
}

export function authorizationHeaderBasic(creds: KongCreds): string {
  return `Basic ${Buffer.from(`${creds.username}:${creds.password}`).toString('base64')}`;
}
