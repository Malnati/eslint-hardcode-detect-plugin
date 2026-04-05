// tests/e2e/utils/kongSecrets.spec.ts
import * as fs from 'fs';
import * as path from 'path';
import { expect, test } from '@playwright/test';
import './e2eEnv';
import {
  loadKongSecretsFromDisk,
  resolveKongCredentialsForE2E,
  resolveSecretsBaseDir,
} from './kongSecrets';

test.describe('kongSecrets (leitura de _secrets)', () => {
  test('resolveSecretsBaseDir é um caminho utilizável', () => {
    const dir = resolveSecretsBaseDir();
    expect(
      dir.length,
      'ERROR: resolveSecretsBaseDir devolveu caminho vazio.\nSUGGEST: Defina E2E_SECRETS_DIR em tests/.env ou mantenha _secrets na raiz do repositório.',
    ).toBeGreaterThan(0);
    expect(
      dir.includes('_secrets') || process.env.E2E_SECRETS_DIR,
      'ERROR: Pasta _secrets não detetada nem override E2E_SECRETS_DIR.\nSUGGEST: Sincronize segredos E2E ou aponte E2E_SECRETS_DIR para o diretório correto.',
    ).toBeTruthy();
  });

  test('com ficheiros em disco, load e resolve coincidem', () => {
    const dir = resolveSecretsBaseDir();
    const hasFile = ['kong-credentials.json', 'basic-auth-creds.json'].some((n) =>
      fs.existsSync(path.join(dir, n)),
    );
    if (!hasFile) {
      test.skip();
      return;
    }
    const fromDisk = loadKongSecretsFromDisk();
    expect(
      fromDisk,
      `ERROR: Não foi possível ler credenciais em ${dir}.\nSUGGEST: Verifique formato JSON dos ficheiros em _secrets.`,
    ).not.toBeNull();
    const resolved = resolveKongCredentialsForE2E();
    expect(resolved.username).toBe(fromDisk!.username);
    expect(resolved.password).toBe(fromDisk!.password);
  });
});
