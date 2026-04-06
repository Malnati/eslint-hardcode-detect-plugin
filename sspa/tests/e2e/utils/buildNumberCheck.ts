// tests/e2e/utils/buildNumberCheck.ts
import './e2eEnv';
import fs from 'fs';
import path from 'path';
import { Page, APIRequestContext } from '@playwright/test';
import { e2eConfigError, getEnvOrDefault, requireNonEmptyEnv } from './e2eEnv';

/** Raiz do monorepo (sspa/tests/e2e/utils → ../../../../..) */
const REPO_ROOT = path.resolve(__dirname, '../../../../..');

const ORIENTACAO_DEV = [
  'Orientação para o desenvolvedor (build e validação):',
  '• O ambiente de desenvolvimento reside num servidor remoto com Docker/Compose.',
  '• Use apenas o Makefile como ponto único de entrada do ciclo de vida (não execute docker, npm nem playwright diretamente no servidor).',
  '• Para reconstruir artefatos e atualizar contentores: `make build` e, em seguida, `make up` (ou os alvos definidos no Makefile do repositório).',
  '• Para correr os testes E2E: `make test-e2e`. Para diagnóstico: `make logs`, `make clean` quando aplicável.',
  '• Aceda sempre à aplicação pelos domínios/subdomínios nip.io servidos pelo Caddy (nunca use localhost nem 127.0.0.1). Ex.: `https://<serviço>.<IP>.nip.io`.',
  '• Confirme que o `build-number.json` local (ou `E2E_EXPECTED_BUILD_NUMBER_JSON`) corresponde ao que foi implantado após o último `make build` no ambiente remoto.',
].join('\n');

function resolveExpectedBuild(): { build: number; jsonPath: string } {
  const rel = getEnvOrDefault(
    'E2E_EXPECTED_BUILD_NUMBER_JSON',
    'sspa/build-number.json',
  );
  const jsonPath = path.isAbsolute(rel) ? rel : path.join(REPO_ROOT, rel);
  const raw = JSON.parse(fs.readFileSync(jsonPath, 'utf8')) as { build?: unknown };
  const build = raw.build;
  const increment = Number(getEnvOrDefault('E2E_BUILD_NUMBER_INCREMENT', '1'));
  if (typeof increment !== 'number' || !Number.isFinite(increment)) {
    throw e2eConfigError(
      `E2E_BUILD_NUMBER_INCREMENT inválido após conversão (esperado número finito). Valor: ${getEnvOrDefault('E2E_BUILD_NUMBER_INCREMENT', '1')}.`,
      'Defina E2E_BUILD_NUMBER_INCREMENT em tests/.env como inteiro (ex.: 1) alinhado ao incremento do build no Docker.',
    );
  }

  if (typeof build !== 'number' || !Number.isFinite(build)) {
    throw e2eConfigError(
      `O ficheiro de build esperado não contém um campo "build" numérico válido. Ficheiro: ${jsonPath}`,
      'Corrija o JSON de build ou ajuste E2E_EXPECTED_BUILD_NUMBER_JSON em tests/.env para apontar para o ficheiro correto.',
    );
  }
  return { build: build + increment, jsonPath };
}

function resolvedRequestUrl(originUrl: string | undefined, apiEndpoint: string): string {
  const base = originUrl || requireNonEmptyEnv('E2E_BASE_URL');
  try {
    return new URL(apiEndpoint.startsWith('/') ? apiEndpoint : `/${apiEndpoint}`, base).href;
  } catch {
    return `${base}${apiEndpoint.startsWith('/') ? '' : '/'}${apiEndpoint}`;
  }
}

function mensagemRespostaHttpInvalida(status: number, resolvedUrl: string, jsonPath: string, expectedBuild: number): Error {
  return e2eConfigError(
    `O endpoint de build não devolveu HTTP bem-sucedido; não foi possível comparar o build em runtime com o JSON local. HTTP ${status} ao pedir: ${resolvedUrl}. Ficheiro local: ${jsonPath} (build esperado: ${expectedBuild}).`,
    'Confirme que o gateway responde em /build-number.json, que o Basic Auth está correto e que a URL em E2E_BASE_URL/tests/.env corresponde ao stack implantado.',
  );
}

function mensagemBuildDivergente(
  runtimeValue: string | undefined,
  expectedBuild: number,
  jsonPath: string,
  resolvedUrl: string,
  fonteRuntime: string,
): Error {
  return e2eConfigError(
    `Divergência entre o build em execução e o ficheiro JSON local. Em runtime (${fonteRuntime}): ${runtimeValue ?? '(ausente ou inválido)'}; no repositório: ${jsonPath} → build = ${expectedBuild}; pedido: ${resolvedUrl}.`,
    'Alinhe o deploy remoto com `make build` / `make up` ou atualize o build-number local; confirme que corre os testes contra o mesmo ambiente definido em tests/.env.',
  );
}

export type CheckBuildNumberOptions = {
  apiEndpoint?: string;
  selector?: string;
  /** Origem base (ex.: https://host.nip.io) para mensagens de erro e resolução do URL do pedido */
  originUrl?: string;
};

/**
 * Confere se o build exposto em runtime (HTML hidden input ou GET JSON) é o mesmo
 * do build-number.json local usado no último build (por defeito o do shell SSPA,
 * servido em /build-number.json na origem E2E).
 */
export async function checkBuildNumber(
  page: Page | APIRequestContext,
  opts?: CheckBuildNumberOptions,
): Promise<void> {
  const apiEndpoint = opts?.apiEndpoint || '/build-number.json';
  const { build: expectedBuild, jsonPath } = resolveExpectedBuild();
  const expectedStr = expectedBuild.toString();
  const originUrl = opts?.originUrl;
  const resolvedUrl = resolvedRequestUrl(originUrl, apiEndpoint);

  if ('locator' in page) {
    const el = await page.locator(opts?.selector || 'input#build-number').first();
    if (await el.count()) {
      const found = await el.getAttribute('value');
      if (found !== expectedStr) {
        throw mensagemBuildDivergente(found, expectedBuild, jsonPath, resolvedUrl, 'input HTML (ex.: #build-number)');
      }
      return;
    }
    throw e2eConfigError(
      `Não foi encontrado o elemento HTML esperado para o número de build (ex.: input#build-number). Não foi possível comparar com ${jsonPath} (build esperado: ${expectedBuild}).`,
      'Confirme que a página shell injeta o input #build-number ou use o fallback GET /build-number.json no global-setup.',
    );
  }

  const resp = await page.get(apiEndpoint);
  if (!resp.ok()) {
    throw mensagemRespostaHttpInvalida(resp.status(), resolvedUrl, jsonPath, expectedBuild);
  }
  const data = (await resp.json()) as { build?: unknown };
  const found = data.build?.toString();
  if (found !== expectedStr) {
    throw mensagemBuildDivergente(found, expectedBuild, jsonPath, resolvedUrl, 'GET /build-number.json (corpo JSON)');
  }
}
