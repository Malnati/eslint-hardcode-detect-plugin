// sspa/tests/e2e/browser/standalone/import-map-error-standalone.spec.ts
import { test, expect } from '@playwright/test';
import { assertLoginStandaloneE2eEnv, requireNonEmptyEnv } from '../../utils/e2eEnv';
import { applyBasicAuthToPage } from '../../utils/mfeHybridE2e';

test.beforeEach(() => {
  assertLoginStandaloneE2eEnv();
});

const LOGIN_STANDALONE_URL = () => `${requireNonEmptyEnv('E2E_LOGIN_ORIGIN').replace(/\/$/, '')}/`;

test.describe('Standalone Import Map Error Coverage', () => {
  test('should not have import map or SystemJS errors in standalone login', async ({ page }) => {
    await applyBasicAuthToPage(page);
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    await page.goto(LOGIN_STANDALONE_URL());
    await page.waitForLoadState('networkidle');
    const importMapError = errors.find(
      (e) =>
        e.includes('bare specifier') ||
        e.includes('SystemJS Error#8') ||
        e.includes('Unable to resolve bare specifier') ||
        e.includes('import map'),
    );
    expect(
      importMapError,
      'ERROR: Erro de import map ou SystemJS detetado na consola.\nSUGGEST: Rebuild do MFE standalone, alinhar import maps com o bundle e E2E_LOGIN_ORIGIN em tests/.env.',
    ).toBeFalsy();
  });
});
