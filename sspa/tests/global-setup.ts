// core/sspa/tests/global-setup.ts
import { chromium, type FullConfig } from '@playwright/test';
import { assertNoNipioBrowserBaseUrlOnDarwin, requireNonEmptyEnv } from './e2e/utils/e2eEnv';
import { checkBuildNumber } from './e2e/utils/buildNumberCheck';
import { authorizationHeaderBasic, resolveKongCredentialsForE2E } from './e2e/utils/kongSecrets';

/**
 * Toda a suíte E2E depende desta verificação: o ambiente em execução deve expor
 * o mesmo `build` que o build-number.json local (por defeito core/sspa/build-number.json).
 */
export default async function globalSetup(config: FullConfig): Promise<void> {
  const skip =
    process.env.E2E_SKIP_GLOBAL_BUILD_CHECK === '1' || process.env.E2E_SKIP_GLOBAL_BUILD_CHECK === 'true';
  if (skip) {
    console.warn(
      '[global-setup] E2E_SKIP_GLOBAL_BUILD_CHECK: verificação de build-number ignorada (use apenas para diagnóstico; preferir ambiente com GET /build-number.json JSON alinhado ao repo).',
    );
    return;
  }

  const baseURL =
    (config.projects[0]?.use?.baseURL as string | undefined) || requireNonEmptyEnv('E2E_BASE_URL');

  const urls = new Set<string>([baseURL]);
  const extraList = process.env.E2E_BUILD_CHECK_BASE_URLS;
  if (extraList) {
    const trimmedExtra = extraList.trim();
    if (trimmedExtra === '') {
      throw new Error(
        'ERROR: E2E_BUILD_CHECK_BASE_URLS está definida mas vazia.\nSUGGEST: Remova a variável ou preencha com URLs separadas por vírgula.',
      );
    }
    for (const u of extraList.split(',')) {
      const t = u.trim();
      if (t) {
        urls.add(t);
      }
    }
  }
  for (const key of ['E2E_PARITY_MOCK_URL', 'E2E_PARITY_REAL_URL'] as const) {
    const v = process.env[key]?.trim();
    if (v) {
      urls.add(v);
    }
  }

  for (const url of urls) {
    assertNoNipioBrowserBaseUrlOnDarwin(url);
  }

  const basicAuthCreds = resolveKongCredentialsForE2E();
  const authorizationHeader = authorizationHeaderBasic(basicAuthCreds);
  const ngrokSkip =
    process.env.E2E_NGROK_SKIP_BROWSER_WARNING === '1' ||
    process.env.E2E_NGROK_SKIP_BROWSER_WARNING === 'true';

  const browser = await chromium.launch();
  try {
    for (const url of urls) {
      const context = await browser.newContext({
        baseURL: url,
        ignoreHTTPSErrors: true,
        extraHTTPHeaders: {
          Authorization: authorizationHeader,
          ...(ngrokSkip ? { 'ngrok-skip-browser-warning': 'true' } : {}),
        },
      });
      try {
        const page = await context.newPage();
        try {
          await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30_000 });
        } catch {
          // Se o HTML não carregar, tenta o fallback via endpoint JSON.
        }

        const buildInput = page.locator('input#build-number').first();
        const inputCount = await buildInput.count();
        if (inputCount > 0) {
          await checkBuildNumber(page, { selector: 'input#build-number' });
        } else {
          await checkBuildNumber(context.request, {
            apiEndpoint: '/build-number.json',
            originUrl: url,
          });
        }
      } finally {
        await context.close();
      }
    }
  } finally {
    await browser.close();
  }
}
