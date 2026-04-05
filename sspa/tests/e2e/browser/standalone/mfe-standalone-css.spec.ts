// core/sspa/tests/e2e/browser/standalone/mfe-standalone-css.spec.ts
import { test, expect } from '@playwright/test';
import {
  assertLoginStandaloneE2eEnv,
  E2E_SKIP_MFE_LOGIN_STANDALONE_UNLESS_LOGIN_NIPIO_HOST,
  isLoginNipioStyleStandaloneOrigin,
} from '../../utils/e2eEnv';
import {
  applyBasicAuthToPage,
  E2E_SKIP_MINIMAL_GATEWAY,
  getLoginE2eOriginUrl,
  snapshotLoginStandaloneFieldsVersusUa,
} from '../../utils/mfeHybridE2e';
import { collectStandaloneStyleSnapshot } from '../../utils/standaloneStyleAssertions';

test.beforeEach(() => {
  assertLoginStandaloneE2eEnv();
});

test.describe('Standalone Mode — CSS ausente (estilo externo)', () => {
  test.describe.configure({ timeout: 120_000 });

  test('mfe-account standalone should render without custom CSS', async ({ page }) => {
    test.skip(process.env.E2E_LOGIN_SUITE_MINIMAL === '1', E2E_SKIP_MINIMAL_GATEWAY);
    const snapshot = await collectStandaloneStyleSnapshot(page, '/mfe/account/');
    expect(snapshot.linkedStyleSheets).toBe(0);
    expect(snapshot.inlineStyleTags).toBe(0);
    expect(snapshot.rootBackgroundColor).toBe(snapshot.browserDefaultBackgroundColor);
    expect(snapshot.rootFontFamily).toBe(snapshot.browserDefaultFontFamily);
    expect(snapshot.rootDisplay).toBe(snapshot.browserDefaultDisplay);
  });

  test('mfe-navigation standalone should render without custom CSS', async ({ page }) => {
    test.skip(process.env.E2E_LOGIN_SUITE_MINIMAL === '1', E2E_SKIP_MINIMAL_GATEWAY);
    const snapshot = await collectStandaloneStyleSnapshot(page, '/mfe/navigation/', '#mfe-navigation');
    expect(snapshot.linkedStyleSheets).toBe(0);
    expect(snapshot.inlineStyleTags).toBe(0);
    expect(snapshot.rootBackgroundColor).toBe(snapshot.browserDefaultBackgroundColor);
    expect(snapshot.rootFontFamily).toBe(snapshot.browserDefaultFontFamily);
    expect(snapshot.rootDisplay).toBe(snapshot.browserDefaultDisplay);
  });

  test('mfe-authtorization standalone should render without custom CSS', async ({ page }) => {
    test.skip(process.env.E2E_LOGIN_SUITE_MINIMAL === '1', E2E_SKIP_MINIMAL_GATEWAY);
    const snapshot = await collectStandaloneStyleSnapshot(page, '/mfe/authtorization/');
    expect(snapshot.linkedStyleSheets).toBe(0);
    expect(snapshot.inlineStyleTags).toBe(0);
    expect(snapshot.rootBackgroundColor).toBe(snapshot.browserDefaultBackgroundColor);
    expect(snapshot.rootFontFamily).toBe(snapshot.browserDefaultFontFamily);
    expect(snapshot.rootDisplay).toBe(snapshot.browserDefaultDisplay);
  });

  test('mfe-login standalone should render without custom CSS', async ({ page }) => {
    test.skip(!isLoginNipioStyleStandaloneOrigin(), E2E_SKIP_MFE_LOGIN_STANDALONE_UNLESS_LOGIN_NIPIO_HOST);
    await applyBasicAuthToPage(page);
    await page.goto(`${getLoginE2eOriginUrl()}/`);
    await page.waitForLoadState('networkidle');

    const snapshot = await snapshotLoginStandaloneFieldsVersusUa(page);

    expect(snapshot.linkedStyleSheets).toBe(0);
    expect(snapshot.inlineStyleTags).toBe(0);
    expect(snapshot.userDisplay).toBe(snapshot.probeDisplay);
    expect(snapshot.userBorderTopWidth).toBe(snapshot.probeBorderTopWidth);
    expect(snapshot.userBorderTopStyle).toBe(snapshot.probeBorderTopStyle);
  });
});
