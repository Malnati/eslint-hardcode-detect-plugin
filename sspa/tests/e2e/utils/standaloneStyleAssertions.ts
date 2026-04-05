// tests/e2e/utils/standaloneStyleAssertions.ts
import type { Page } from '@playwright/test';
import { applyBasicAuthToPage } from './mfeHybridE2e';
import { requireNonEmptyEnv } from './e2eEnv';

/** Snapshot de estilos no MFE standalone (política estilo externo — comparar com UA via iframe). */
export type StandaloneStyleSnapshot = {
  linkedStyleSheets: number;
  inlineStyleTags: number;
  rootBackgroundColor: string;
  rootFontFamily: string;
  rootDisplay: string;
  browserDefaultBackgroundColor: string;
  browserDefaultFontFamily: string;
  browserDefaultDisplay: string;
};

const baseUrl = (): string => requireNonEmptyEnv('E2E_BASE_URL');

/**
 * Navega para `E2E_BASE_URL` + path e recolhe métricas de CSS (folhas ligadas, estilo do nó raiz vs probe UA).
 * @param rootSelector — por omissão `#root`; ex.: `#mfe-navigation` para o MFE navigation.
 */
export async function collectStandaloneStyleSnapshot(
  page: Page,
  relativePath: string,
  rootSelector: string = '#root',
): Promise<StandaloneStyleSnapshot> {
  await applyBasicAuthToPage(page);
  const target = `${baseUrl()}${relativePath}`;
  const response = await page.goto(target, { waitUntil: 'networkidle' });
  const status = response?.status() ?? 0;
  if (status >= 400) {
    throw new Error(
      `ERROR: Pedido standalone falhou (HTTP ${status}) para ${target}.\nSUGGEST: Confirme Host/ngrok (NGROK_CADDY_HOST_HEADER / NIPIO_IP), make standalone-sspa e logs do sspa e do MFE.`,
    );
  }
  await page.waitForSelector(rootSelector, { state: 'attached', timeout: 90_000 });

  return page.evaluate((selector) => {
    const root = document.querySelector(selector);
    if (!root || !(root instanceof HTMLElement)) {
      throw new Error(
        `ERROR: Elemento raiz standalone (${selector}) não encontrado.\nSUGGEST: Confirme o path do MFE standalone e que o bundle monta o nó raiz; verifique Basic Auth e URL em E2E_BASE_URL (tests/.env).`,
      );
    }

    /** Corpo: herança de fonte para o nó raiz; `div` nu para display/background UA típicos de bloco. */
    const bodyStyles = window.getComputedStyle(document.body);
    const probe = document.createElement('div');
    probe.setAttribute('data-e2e-ua-probe', 'true');
    document.body.appendChild(probe);
    const rootStyles = window.getComputedStyle(root);
    const probeStyles = window.getComputedStyle(probe);
    probe.remove();
    const linkedStyleSheets = Array.from(document.styleSheets).filter((sheet) => {
      const ownerNode = sheet.ownerNode;
      return ownerNode instanceof HTMLLinkElement || ownerNode instanceof HTMLStyleElement;
    }).length;

    const normalizeBg = (raw: string) => {
      const x = raw.trim().toLowerCase();
      if (x === '' || x === 'transparent' || x === 'rgba(0, 0, 0, 0)' || x === 'rgba(0,0,0,0)') {
        return 'transparent';
      }
      return x;
    };

    const normalizeDisplay = (raw: string) => {
      const x = raw.trim();
      return x === '' ? 'block' : x;
    };

    const snapshot = {
      linkedStyleSheets,
      inlineStyleTags: document.querySelectorAll('style').length,
      rootBackgroundColor: normalizeBg(rootStyles.backgroundColor),
      rootFontFamily: rootStyles.fontFamily,
      rootDisplay: normalizeDisplay(rootStyles.display),
      browserDefaultBackgroundColor: normalizeBg(probeStyles.backgroundColor),
      browserDefaultFontFamily: bodyStyles.fontFamily,
      browserDefaultDisplay: normalizeDisplay(probeStyles.display),
    };

    return snapshot;
  }, rootSelector);
}
