// tests/e2e/utils/mfeHybridE2e.ts
import { expect, type Page } from '@playwright/test';
import { authorizationHeaderBasic, resolveKongCredentialsForE2E } from './kongSecrets';
import { getShellBaseUrlForE2E, loadTestsDotEnv, requireNonEmptyEnv } from './e2eEnv';

/**
 * Helpers partilhados para E2E de MFEs em modo Standalone e Integrated (SSPA),
 * com acesso via nip.io ou ngrok (URLs definidas pelo Makefile / tests/.env — nunca localhost na app).
 */

/** Suite mínima (ex.: sspa-edge-login-up): sem rotas /mfe/* no host raiz. */
export const E2E_SKIP_MINIMAL_GATEWAY =
  'ERROR: Rotas /mfe/* no host raiz exigem o gateway/sspa completo.\nSUGGEST: Remova E2E_LOGIN_SUITE_MINIMAL ou execute `make test-e2e-nipio` com stack completa.';

/** Suite mínima: sem serviço sspa (dashboard) no host raiz. */
export const E2E_SKIP_MINIMAL_SHELL =
  'ERROR: Shell SSPA (dashboard) não está no pacote edge-login (sspa-edge-login-up).\nSUGGEST: Rode os testes integrados com `make test-e2e-nipio` ou stack que inclua o serviço `sspa`; ou aceite o skip quando E2E_LOGIN_SUITE_MINIMAL=1.';

/**
 * Origem HTTPS do MFE login standalone (alinha nip.io e ngrok).
 * Preferência: E2E_LOGIN_ORIGIN; senão https://LOGIN_DOMAIN
 */
export function getLoginE2eOriginUrl(): string {
  loadTestsDotEnv();
  const origin = process.env.E2E_LOGIN_ORIGIN?.trim();
  if (origin) {
    return origin.replace(/\/$/, '');
  }
  const domain = requireNonEmptyEnv('LOGIN_DOMAIN');
  return `https://${domain}`;
}

/** Alinhado a playwright.config.ts: ngrok free devolve HTML de aviso sem este header. */
function ngrokSkipBrowserWarningHeader(): Record<string, string> {
  if (
    process.env.E2E_NGROK_SKIP_BROWSER_WARNING === '1' ||
    process.env.E2E_NGROK_SKIP_BROWSER_WARNING === 'true'
  ) {
    return { 'ngrok-skip-browser-warning': 'true' };
  }
  return {};
}

/**
 * Headers para pedidos do browser com Basic Auth e, se aplicável, aviso ngrok.
 * `page.setExtraHTTPHeaders` substitui os headers do contexto — incluir sempre o par ngrok quando ativo.
 */
export function getE2eBrowserExtraHeaders(): Record<string, string> {
  const creds = resolveKongCredentialsForE2E();
  return {
    Authorization: authorizationHeaderBasic(creds),
    ...ngrokSkipBrowserWarningHeader(),
  };
}

export async function applyBasicAuthToPage(page: Page): Promise<void> {
  await page.setExtraHTTPHeaders(getE2eBrowserExtraHeaders());
}

export async function clearAuthIndexedDb(page: Page): Promise<void> {
  await page.evaluate(() => {
    return new Promise<void>((resolve) => {
      const req = indexedDB.deleteDatabase('auth_db');
      req.onsuccess = () => resolve();
      req.onerror = () => resolve();
      req.onblocked = () => resolve();
    });
  });
}

export type OpenShellIntegratedRouteOptions = {
  /** Se definido, espera o seletor após navegar para shell+route. */
  waitSelector?: string;
  waitTimeoutMs?: number;
};

/**
 * Abre o shell SSPA numa rota integrada (ex. /login, futuramente /proxy).
 * Limpa auth_db para evitar redirect com sessão antiga.
 */
export async function openShellIntegratedRoute(
  page: Page,
  route: string,
  options?: OpenShellIntegratedRouteOptions,
): Promise<void> {
  await applyBasicAuthToPage(page);
  const shell = getShellBaseUrlForE2E();
  const path = route.startsWith('/') ? route : `/${route}`;
  await page.goto(shell, { waitUntil: 'domcontentloaded' });
  await clearAuthIndexedDb(page);
  await page.goto(`${shell}${path}`, { waitUntil: 'networkidle' });
  const sel = options?.waitSelector;
  if (sel) {
    await page.waitForSelector(sel, {
      state: 'visible',
      timeout: options?.waitTimeoutMs ?? 60_000,
    });
  }
}

export async function openShellLoginPage(page: Page): Promise<void> {
  await openShellIntegratedRoute(page, '/login', {
    waitSelector: '[data-testid="login-user"]',
    waitTimeoutMs: 60_000,
  });
}

/** Contrato api-login: corpo de erro com ERROR e SUGGEST. */
export function expectApiLoginDevErrorPayload(data: unknown): void {
  expect(data).toEqual(
    expect.objectContaining({
      ERROR: expect.stringMatching(/^ERROR:/),
      SUGGEST: expect.stringMatching(/^SUGGEST:/),
    }),
  );
}

/** Lê JWT da sessão atual em auth_db (após login bem-sucedido). */
export async function readJwtFromAuthDbSession(page: Page): Promise<string | null> {
  return page.evaluate(async () => {
    return new Promise<string | null>((resolve) => {
      const req = indexedDB.open('auth_db', 1);
      req.onerror = () => resolve(null);
      req.onsuccess = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains('session')) {
          resolve(null);
          return;
        }
        const tx = db.transaction('session', 'readonly');
        const getReq = tx.objectStore('session').get('current');
        getReq.onsuccess = () => {
          const row = getReq.result as { token?: string } | undefined;
          resolve(typeof row?.token === 'string' ? row.token : null);
        };
        getReq.onerror = () => resolve(null);
      };
    });
  });
}

/**
 * Snapshot de estilo no login standalone: sem folhas ligadas, inputs alinhados a referência UA no mesmo documento.
 * Usado pela política “estilo externo” no modo standalone.
 */
export async function snapshotLoginStandaloneFieldsVersusUa(page: Page): Promise<{
  linkedStyleSheets: number;
  inlineStyleTags: number;
  userDisplay: string;
  userBorderTopWidth: string;
  userBorderTopStyle: string;
  probeDisplay: string;
  probeBorderTopWidth: string;
  probeBorderTopStyle: string;
}> {
  return page.evaluate(() => {
    const userField = document.querySelector('#login-user');
    if (!userField) {
      throw new Error(
        'ERROR: Campo #login-user não encontrado na página de login standalone.\nSUGGEST: Confirme E2E_LOGIN_ORIGIN / LOGIN_DOMAIN e o deploy do MFE login; valide Basic Auth e rotas no Caddy.',
      );
    }

    const ref = document.createElement('input');
    ref.type = 'text';
    ref.setAttribute('aria-hidden', 'true');
    document.body.appendChild(ref);

    const linkedStyleSheets = Array.from(document.styleSheets).filter((sheet) => {
      const ownerNode = sheet.ownerNode;
      return ownerNode instanceof HTMLLinkElement || ownerNode instanceof HTMLStyleElement;
    }).length;

    const userStyles = window.getComputedStyle(userField);
    const probeStyles = window.getComputedStyle(ref);

    const out = {
      linkedStyleSheets,
      inlineStyleTags: document.querySelectorAll('style').length,
      userDisplay: userStyles.display,
      userBorderTopWidth: userStyles.borderTopWidth,
      userBorderTopStyle: userStyles.borderTopStyle,
      probeDisplay: probeStyles.display,
      probeBorderTopWidth: probeStyles.borderTopWidth,
      probeBorderTopStyle: probeStyles.borderTopStyle,
    };

    ref.remove();
    return out;
  });
}
