// core/sspa/tests/playwright.config.ts
import { defineConfig, devices } from '@playwright/test';
import { assertNoNipioBrowserBaseUrlOnDarwin, requireNonEmptyEnv } from './e2e/utils/e2eEnv';
import { authorizationHeaderBasic, resolveKongCredentialsForE2E } from './e2e/utils/kongSecrets';

const BASE_URL = requireNonEmptyEnv('E2E_BASE_URL');
assertNoNipioBrowserBaseUrlOnDarwin(BASE_URL);
requireNonEmptyEnv('E2E_DOMAIN');
requireNonEmptyEnv('PROD_DOMAIN');
requireNonEmptyEnv('E2E_LOCAL_HOST');
const CHROMIUM_HOST_RESOLVER_RULES = `EXCLUDE localhost`;
const IGNORE_TLS = process.env.NODE_TLS_REJECT_UNAUTHORIZED === '0';

/** ngrok free: sem isto, GET /build-number.json e a app devolvem HTML de aviso em vez de JSON. */
const NGROK_SKIP_BROWSER_WARNING =
  process.env.E2E_NGROK_SKIP_BROWSER_WARNING === '1' ||
  process.env.E2E_NGROK_SKIP_BROWSER_WARNING === 'true';

/** Shell/Caddy (Kong Basic Auth): sem Authorization nas navegações, o browser é redirecionado para /login e rotas /mfe/* falham. */
function defaultBrowserExtraHeaders(): Record<string, string> {
  const h: Record<string, string> = {};
  if (NGROK_SKIP_BROWSER_WARNING) {
    h['ngrok-skip-browser-warning'] = 'true';
  }
  try {
    const creds = resolveKongCredentialsForE2E();
    h.Authorization = authorizationHeaderBasic(creds);
  } catch {
    /* sem _secrets nem KONG_BASIC_AUTH_* — alguns fluxos ainda podem correr */
  }
  return h;
}

const sharedUse = {
  baseURL: BASE_URL,
  trace: 'on-first-retry' as const,
  ignoreHTTPSErrors: true,
  extraHTTPHeaders: defaultBrowserExtraHeaders(),
};

export default defineConfig({
  /** Toda a suíte falha se o build em runtime não coincidir com build-number.json (ver também E2E_BUILD_CHECK_BASE_URLS). */
  globalSetup: './global-setup.ts',
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  outputDir: requireNonEmptyEnv('E2E_OUTPUT_DIR'),
  reporter: [
    ['html', { open: 'never', outputFolder: requireNonEmptyEnv('E2E_REPORT_DIR') }],
  ],
  use: sharedUse,
  projects: [
    {
      name: 'chromium-stack',
      testMatch: 'browser/*.spec.ts',
      use: {
        ...devices['Desktop Chrome'],
        ...sharedUse,
        launchOptions: {
          args: [
            `--host-resolver-rules=${CHROMIUM_HOST_RESOLVER_RULES}`,
            ...(IGNORE_TLS ? ['--ignore-certificate-errors'] : []),
          ],
        },
        contextOptions: {
          ignoreHTTPSErrors: true,
        },
      },
    },
    {
      name: 'chromium-standalone',
      testMatch: 'browser/standalone/**/*.spec.ts',
      use: {
        ...devices['Desktop Chrome'],
        ...sharedUse,
        launchOptions: {
          args: [
            `--host-resolver-rules=${CHROMIUM_HOST_RESOLVER_RULES}`,
            ...(IGNORE_TLS ? ['--ignore-certificate-errors'] : []),
          ],
        },
        contextOptions: {
          ignoreHTTPSErrors: true,
        },
      },
    },
    {
      name: 'chromium-integrated',
      testMatch: 'browser/integrated/**/*.spec.ts',
      use: {
        ...devices['Desktop Chrome'],
        ...sharedUse,
        launchOptions: {
          args: [
            `--host-resolver-rules=${CHROMIUM_HOST_RESOLVER_RULES}`,
            ...(IGNORE_TLS ? ['--ignore-certificate-errors'] : []),
          ],
        },
        contextOptions: {
          ignoreHTTPSErrors: true,
        },
      },
    },
  ],
});
