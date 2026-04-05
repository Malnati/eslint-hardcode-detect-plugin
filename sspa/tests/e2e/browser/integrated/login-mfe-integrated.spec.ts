// core/sspa/tests/e2e/browser/integrated/login-mfe-integrated.spec.ts
import { test, expect } from '@playwright/test';
import { assertBaseUrlE2eEnv, requireNonEmptyEnv } from '../../utils/e2eEnv';

test.beforeEach(() => {
  assertBaseUrlE2eEnv();
});

const getBaseUrl = () => requireNonEmptyEnv('E2E_BASE_URL');

const REQUIRED_MFES = [
  { name: '@mfe/account', path: '/mfe/account/spa.js' },
  { name: '@mfe/authtorization', path: '/mfe/authtorization/spa.js' },
  { name: '@mfe/config', path: '/mfe/config/spa.js' },
  { name: '@mfe/key', path: '/mfe/key/spa.js' },
  { name: '@mfe/login', path: '/api/login/mfe-app/spa.js' },
  { name: '@mfe/proxy', path: '/mfe/proxy/spa.js' },
  { name: '@mfe/usage', path: '/mfe/usage/spa.js' },
  { name: '@mfe/profile', path: '/mfe/profile/spa.js' },
  { name: '@mfe/design-system', path: '/mfe/design-system/spa.js' },
  { name: '@mfe/api', path: '/mfe/api/spa.js' },
  { name: '@mfe/auth', path: '/assets/auth-service.js' },
];

const SHARED_MODULES = [
  'react',
  'react-dom',
  'single-spa',
  'react-router-dom',
  'axios',
];

const REQUIRED_CSS_CLASSES = [
  'ds-login-wrapper',
  'ds-login-card',
  'ds-login-title',
  'ds-css-verification-badge',
  'ds-dashboard-container',
  'ds-panel',
  'ds-menu-wrapper',
  'ds-page-container',
  'ds-form',
  'ds-input',
  'ds-button',
  'ds-button-primary',
  'ds-error',
];

const REQUIRED_CSS_TOKENS = [
  '--background',
  '--foreground',
  '--card',
  '--card-foreground',
  '--primary',
  '--primary-foreground',
  '--secondary',
  '--secondary-foreground',
  '--muted',
  '--muted-foreground',
  '--accent',
  '--accent-foreground',
  '--destructive',
  '--destructive-foreground',
  '--border',
  '--input',
  '--ring',
  '--space-1',
  '--space-2',
  '--space-3',
  '--space-4',
  '--space-6',
  '--space-8',
  '--font-headline',
  '--font-subtitle',
  '--font-body',
  '--font-caption',
  '--radius-sm',
  '--radius-md',
  '--radius-lg',
  '--shadow-sm',
];

test.describe('Login MFE — integrated (CSS, import map, SystemJS)', () => {
  test.describe('MFE module fetch verification', () => {
    test('all MFE spa.js bundles are reachable and valid', async ({ request }) => {
      for (const mfe of REQUIRED_MFES) {
        const response = await request.get(`${getBaseUrl()}${mfe.path}`);
        expect(response.status(), `${mfe.name} (${mfe.path}) should return 200`).toBe(200);

        const contentType = response.headers()['content-type'];
        expect(contentType, `${mfe.name} should have javascript content-type`).toMatch(/javascript|application\/octet-stream/);

        const text = await response.text();
        expect(text.length, `${mfe.name} bundle should not be empty`).toBeGreaterThan(100);
        expect(text, `${mfe.name} should not be an HTML error page`).not.toContain('<!DOCTYPE html>');
        expect(text, `${mfe.name} should not contain uncompiled export keyword`).not.toMatch(/^export\s/m);
      }
    });

    test('login MFE bundle exposes single-spa lifecycle methods', async ({ request }) => {
      const response = await request.get(`${getBaseUrl()}/api/login/mfe-app/spa.js`);
      expect(response.ok()).toBe(true);
      const text = await response.text();
      expect(text).toContain('mount');
      expect(text).toContain('unmount');
      expect(text).toContain('bootstrap');
    });

    test('auth-service.js is reachable and exports completeLogin', async ({ request }) => {
      const response = await request.get(`${getBaseUrl()}/assets/auth-service.js`);
      expect(response.ok()).toBe(true);
      const text = await response.text();
      expect(text).toContain('completeLogin');
    });

    test('global CSS file is reachable and contains required classes', async ({ request }) => {
      const response = await request.get(`${getBaseUrl()}/mfe/design-system/style.css`);
      expect(response.status()).toBe(200);
      const text = await response.text();

      for (const cls of REQUIRED_CSS_CLASSES) {
        expect(text, `CSS should contain class ${cls}`).toContain(cls);
      }
    });

    test('global CSS contains all required design tokens', async ({ request }) => {
      const response = await request.get(`${getBaseUrl()}/mfe/design-system/style.css`);
      expect(response.status()).toBe(200);
      const text = await response.text();

      for (const token of REQUIRED_CSS_TOKENS) {
        expect(text, `CSS should define token ${token}`).toContain(token);
      }
    });
  });

  test.describe('Login page rendered with CSS applied', () => {
    test('login page should render with design system classes', async ({ page }) => {
      const failedRequests: string[] = [];
      const consoleErrors: string[] = [];

      page.on('requestfailed', request => {
        const url = request.url();
        if (!url.includes('favicon')) {
          failedRequests.push(`${request.method()} ${url}: ${request.failure()?.errorText}`);
        }
      });
      page.on('response', response => {
        if (response.status() >= 400) {
          failedRequests.push(`${response.request().method()} ${response.url()}: ${response.status()}`);
        }
      });
      page.on('console', msg => {
        if (msg.type() === 'error') consoleErrors.push(msg.text());
      });
      page.on('pageerror', err => consoleErrors.push(err.message));

      await page.goto('/login');

      await expect(page.locator('.ds-dashboard-container')).toBeVisible();
      await expect(page.locator('.ds-login-card')).toBeVisible();
      await expect(page.locator('.ds-login-title')).toBeVisible();
      await expect(page.locator('.ds-login-wrapper')).toBeVisible();

      expect(consoleErrors, `Detected console errors: ${consoleErrors.join(', ')}`).toHaveLength(0);
    });

    test('login form should use design system input and button classes', async ({ page }) => {
      await page.goto('/login');

      const usernameInput = page.locator('.ds-input[name="username"]');
      const passwordInput = page.locator('.ds-input[name="password"]');
      const submitButton = page.locator('.ds-button.ds-button-primary[type="submit"]');

      await expect(usernameInput).toBeVisible();
      await expect(passwordInput).toBeVisible();
      await expect(submitButton).toBeVisible();
      await expect(submitButton).toContainText('Entrar');
    });

    test('login form labels should use ds-form-label class', async ({ page }) => {
      await page.goto('/login');
      const labels = page.locator('.ds-form-label');
      await expect(labels).toHaveCount(2);
    });

    test('login form should be wrapped in ds-form class', async ({ page }) => {
      await page.goto('/login');
      const form = page.locator('form.ds-form');
      await expect(form).toBeVisible();
    });
  });

  test.describe('CSS token application verification', () => {
    test('CSS custom properties should be applied to root element', async ({ page }) => {
      await page.goto('/login');
      await page.waitForSelector('.ds-login-card', { state: 'visible', timeout: 10000 });

      const tokens = await page.evaluate(() => {
        const style = getComputedStyle(document.documentElement);
        const tokens: Record<string, string> = {};
        const tokenNames = [
          '--background', '--foreground', '--primary', '--primary-foreground',
          '--card', '--card-foreground', '--border', '--input', '--ring',
          '--space-4', '--font-body', '--radius-md', '--shadow-sm',
        ];
        for (const name of tokenNames) {
          tokens[name] = style.getPropertyValue(name).trim();
        }
        return tokens;
      });

      expect(tokens['--background']).not.toBe('');
      expect(tokens['--foreground']).not.toBe('');
      expect(tokens['--primary']).not.toBe('');
      expect(tokens['--primary-foreground']).not.toBe('');
      expect(tokens['--card']).not.toBe('');
      expect(tokens['--card-foreground']).not.toBe('');
      expect(tokens['--border']).not.toBe('');
      expect(tokens['--input']).not.toBe('');
      expect(tokens['--ring']).not.toBe('');
      expect(tokens['--space-4']).not.toBe('');
      expect(tokens['--font-body']).not.toBe('');
      expect(tokens['--radius-md']).not.toBe('');
      expect(tokens['--shadow-sm']).not.toBe('');
    });

    test('login card should have computed styles from design tokens', async ({ page }) => {
      await page.goto('/login');
      await page.waitForSelector('.ds-login-card', { state: 'visible', timeout: 10000 });

      const cardStyles = await page.evaluate(() => {
        const card = document.querySelector('.ds-login-card');
        if (!card) return null;
        const style = getComputedStyle(card);
        return {
          borderRadius: style.borderRadius,
          boxShadow: style.boxShadow,
          padding: style.padding,
          backgroundColor: style.backgroundColor,
        };
      });

      expect(cardStyles).not.toBeNull();
      expect(cardStyles?.borderRadius).not.toBe('0px');
      expect(cardStyles?.padding).not.toBe('0px');
    });

    test('login button should have computed background color from primary token', async ({ page }) => {
      await page.goto('/login');
      await page.waitForSelector('.ds-button-primary', { state: 'visible', timeout: 10000 });

      const buttonStyles = await page.evaluate(() => {
        const button = document.querySelector('.ds-button.ds-button-primary');
        if (!button) return null;
        const style = getComputedStyle(button);
        return {
          backgroundColor: style.backgroundColor,
          color: style.color,
          fontWeight: style.fontWeight,
          borderRadius: style.borderRadius,
        };
      });

      expect(buttonStyles).not.toBeNull();
      expect(buttonStyles?.backgroundColor).not.toBe('transparent');
      expect(buttonStyles?.fontWeight).toMatch(/700|bold/);
    });

    test('login inputs should have computed border and padding from tokens', async ({ page }) => {
      await page.goto('/login');
      await page.waitForSelector('.ds-input', { state: 'visible', timeout: 10000 });

      const inputStyles = await page.evaluate(() => {
        const input = document.querySelector('.ds-input');
        if (!input) return null;
        const style = getComputedStyle(input);
        return {
          borderWidth: style.borderWidth,
          borderRadius: style.borderRadius,
          padding: style.padding,
          backgroundColor: style.backgroundColor,
          color: style.color,
        };
      });

      expect(inputStyles).not.toBeNull();
      expect(inputStyles?.borderRadius).not.toBe('0px');
      expect(inputStyles?.padding).not.toBe('0px');
      expect(inputStyles?.backgroundColor).not.toBe('transparent');
      expect(inputStyles?.backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
    });

    test('login inputs should be visible with readable text contrast', async ({ page }) => {
      await page.goto('/login');
      await page.waitForSelector('.ds-input', { state: 'visible', timeout: 10000 });

      const inputVisibility = await page.evaluate(() => {
        const input = document.querySelector('.ds-input') as HTMLInputElement;
        if (!input) return null;
        const style = getComputedStyle(input);
        const bgColor = style.backgroundColor;
        const textColor = style.color;
        const borderColor = style.borderColor;
        return {
          visible: input.offsetParent !== null,
          width: input.offsetWidth,
          height: input.offsetHeight,
          bgColor,
          textColor,
          borderColor,
          borderWidth: style.borderWidth,
        };
      });

      expect(inputVisibility).not.toBeNull();
      expect(inputVisibility?.visible).toBe(true);
      expect(inputVisibility?.width).toBeGreaterThan(50);
      expect(inputVisibility?.height).toBeGreaterThan(20);
      expect(inputVisibility?.bgColor).not.toBe('transparent');
      expect(inputVisibility?.bgColor).not.toBe('rgba(0, 0, 0, 0)');
      expect(inputVisibility?.borderColor).not.toBe('transparent');
    });

    test('login form labels should be visible and readable', async ({ page }) => {
      await page.goto('/login');
      await page.waitForSelector('.ds-form-label', { state: 'visible', timeout: 10000 });

      const labels = page.locator('.ds-form-label');
      await expect(labels).toHaveCount(2);

      const labelStyles = await page.evaluate(() => {
        const labelElements = document.querySelectorAll('.ds-form-label');
        return Array.from(labelElements).map(label => {
          const style = getComputedStyle(label);
          return {
            color: style.color,
            fontSize: style.fontSize,
            visible: (label as HTMLElement).offsetParent !== null,
          };
        });
      });

      expect(labelStyles).toHaveLength(2);
      for (const ls of labelStyles) {
        expect(ls.visible).toBe(true);
        expect(ls.color).not.toBe('transparent');
        expect(ls.color).not.toBe('rgba(0, 0, 0, 0)');
      }
    });
  });

  test.describe('OKLCH theme token validation', () => {
    test('root element should have oklch-based background token', async ({ page }) => {
      await page.goto('/login');
      await page.waitForSelector('.ds-login-card', { state: 'visible', timeout: 10000 });

      const background = await page.evaluate(() => {
        return getComputedStyle(document.documentElement).getPropertyValue('--background').trim();
      });

      expect(background).toMatch(/oklch/);
    });

    test('root element should have oklch-based foreground token', async ({ page }) => {
      await page.goto('/login');
      await page.waitForSelector('.ds-login-card', { state: 'visible', timeout: 10000 });

      const foreground = await page.evaluate(() => {
        return getComputedStyle(document.documentElement).getPropertyValue('--foreground').trim();
      });

      expect(foreground).toMatch(/oklch/);
    });

    test('root element should have oklch-based primary token', async ({ page }) => {
      await page.goto('/login');
      await page.waitForSelector('.ds-login-card', { state: 'visible', timeout: 10000 });

      const primary = await page.evaluate(() => {
        return getComputedStyle(document.documentElement).getPropertyValue('--primary').trim();
      });

      expect(primary).toMatch(/oklch/);
    });

    test('root element should have oklch-based border token', async ({ page }) => {
      await page.goto('/login');
      await page.waitForSelector('.ds-login-card', { state: 'visible', timeout: 10000 });

      const border = await page.evaluate(() => {
        return getComputedStyle(document.documentElement).getPropertyValue('--border').trim();
      });

      expect(border).toMatch(/oklch/);
    });

    test('root element should have oklch-based card token', async ({ page }) => {
      await page.goto('/login');
      await page.waitForSelector('.ds-login-card', { state: 'visible', timeout: 10000 });

      const card = await page.evaluate(() => {
        return getComputedStyle(document.documentElement).getPropertyValue('--card').trim();
      });

      expect(card).toMatch(/oklch/);
    });

    test('computed body background should resolve oklch background to visible color', async ({ page }) => {
      await page.goto('/login');
      await page.waitForSelector('.ds-login-card', { state: 'visible', timeout: 10000 });

      const bodyBg = await page.evaluate(() => {
        return getComputedStyle(document.body).backgroundColor;
      });

      expect(bodyBg).not.toBe('transparent');
      expect(bodyBg).not.toBe('rgba(0, 0, 0, 0)');
    });

    test('computed login card background should resolve oklch card to visible color', async ({ page }) => {
      await page.goto('/login');
      await page.waitForSelector('.ds-login-card', { state: 'visible', timeout: 10000 });

      const cardBg = await page.evaluate(() => {
        const card = document.querySelector('.ds-login-card');
        if (!card) return '';
        return getComputedStyle(card).backgroundColor;
      });

      expect(cardBg).not.toBe('transparent');
      expect(cardBg).not.toBe('rgba(0, 0, 0, 0)');
    });

    test('computed login button background should resolve oklch primary to visible color', async ({ page }) => {
      await page.goto('/login');
      await page.waitForSelector('.ds-button.ds-button-primary', { state: 'visible', timeout: 10000 });

      const btnBg = await page.evaluate(() => {
        const btn = document.querySelector('.ds-button.ds-button-primary');
        if (!btn) return '';
        return getComputedStyle(btn).backgroundColor;
      });

      expect(btnBg).not.toBe('transparent');
      expect(btnBg).not.toBe('rgba(0, 0, 0, 0)');
    });

    test('computed input background should resolve oklch input/card to visible color', async ({ page }) => {
      await page.goto('/login');
      await page.waitForSelector('.ds-input', { state: 'visible', timeout: 10000 });

      const inputBg = await page.evaluate(() => {
        const input = document.querySelector('.ds-input');
        if (!input) return '';
        return getComputedStyle(input).backgroundColor;
      });

      expect(inputBg).not.toBe('transparent');
      expect(inputBg).not.toBe('rgba(0, 0, 0, 0)');
    });

    test('computed input border should resolve oklch border/input to visible color', async ({ page }) => {
      await page.goto('/login');
      await page.waitForSelector('.ds-input', { state: 'visible', timeout: 10000 });

      const inputBorder = await page.evaluate(() => {
        const input = document.querySelector('.ds-input');
        if (!input) return '';
        return getComputedStyle(input).borderColor;
      });

      expect(inputBorder).not.toBe('transparent');
      expect(inputBorder).not.toBe('rgba(0, 0, 0, 0)');
    });

    test('computed text color should resolve oklch foreground to visible color', async ({ page }) => {
      await page.goto('/login');
      await page.waitForSelector('.ds-login-title', { state: 'visible', timeout: 10000 });

      const titleColor = await page.evaluate(() => {
        const title = document.querySelector('.ds-login-title');
        if (!title) return '';
        return getComputedStyle(title).color;
      });

      expect(titleColor).not.toBe('transparent');
      expect(titleColor).not.toBe('rgba(0, 0, 0, 0)');
    });
  });

  test.describe('Import map and SystemJS module loading', () => {
    test('import map should declare all required MFE modules', async ({ page }) => {
      await page.goto('/login');
      await page.waitForSelector('.ds-login-card', { state: 'visible', timeout: 10000 });

      const importMap = await page.evaluate(() => {
        const script = document.getElementById('sspa-static-import-map');
        if (!script?.textContent) return null;
        return JSON.parse(script.textContent) as { imports?: Record<string, string> };
      });

      expect(importMap).not.toBeNull();
      const imports = importMap?.imports ?? {};

      for (const mfe of REQUIRED_MFES) {
        expect(imports[mfe.name], `Import map should declare ${mfe.name}`).toBeTruthy();
      }
    });

    test('import map should declare shared modules', async ({ page }) => {
      await page.goto('/login');
      await page.waitForSelector('.ds-login-card', { state: 'visible', timeout: 10000 });

      const importMap = await page.evaluate(() => {
        const script = document.getElementById('sspa-static-import-map');
        if (!script?.textContent) return null;
        return JSON.parse(script.textContent) as { imports?: Record<string, string> };
      });

      expect(importMap).not.toBeNull();
      const imports = importMap?.imports ?? {};

      for (const mod of SHARED_MODULES) {
        expect(imports[mod], `Import map should declare ${mod}`).toBeTruthy();
      }
    });

    test('SystemJS should be available and load design-system module', async ({ page }) => {
      await page.goto('/login');

      const result = await page.evaluate(async () => {
        const system = (window as unknown as { System?: { import: (specifier: string) => Promise<unknown> } }).System;
        if (!system) return { systemAvailable: false, designSystemLoaded: false };

        try {
          await system.import('@mfe/design-system');
          return { systemAvailable: true, designSystemLoaded: true };
        } catch {
          return { systemAvailable: true, designSystemLoaded: false };
        }
      });

      expect(result.systemAvailable).toBe(true);
      expect(result.designSystemLoaded).toBe(true);
    });

    test('SystemJS should load auth module', async ({ page }) => {
      await page.goto('/login');

      const result = await page.evaluate(async () => {
        const system = (window as unknown as { System?: { import: (specifier: string) => Promise<unknown> } }).System;
        if (!system) return false;

        try {
          const mod = await system.import('@mfe/auth');
          return typeof mod?.completeLogin === 'function';
        } catch {
          return false;
        }
      });

      expect(result).toBe(true);
    });
  });

  test.describe('Runtime config and MFE URL resolution', () => {
    test('runtime-config should declare mfeUrls for all required MFEs', async ({ request }) => {
      const response = await request.get(`${getBaseUrl()}/runtime-config`);
      expect(response.ok()).toBe(true);

      const body = await response.json();
      const mfeUrls = body.mfeUrls as Record<string, string> | undefined;
      expect(mfeUrls).toBeDefined();

      const requiredKeys = ['account', 'authtorization', 'config', 'key', 'login', 'proxy', 'usage', 'profile', 'designSystem', 'api'];
      for (const key of requiredKeys) {
        expect(mfeUrls?.[key], `runtime-config should declare mfeUrls.${key}`).toBeTruthy();
        expect(mfeUrls?.[key]?.length).toBeGreaterThan(1);
      }
    });

    test('login MFE URL from runtime-config should be reachable', async ({ request }) => {
      const configResponse = await request.get(`${getBaseUrl()}/runtime-config`);
      const config = await configResponse.json();
      const loginUrl = config.mfeUrls?.login ?? '/api/login/mfe-app/spa.js';

      const resolvedPath = loginUrl.startsWith('http') ? new URL(loginUrl).pathname : loginUrl;
      const response = await request.get(`${getBaseUrl()}${resolvedPath}`);
      expect(response.ok()).toBe(true);
    });
  });

  test.describe('No uncompiled export keywords in served bundles', () => {
    test('no MFE bundle should start with export keyword', async ({ request }) => {
      for (const mfe of REQUIRED_MFES) {
        const response = await request.get(`${getBaseUrl()}${mfe.path}`);
        expect(response.ok()).toBe(true);
        const text = await response.text();
        const hasExportKeyword = /^export\s/m.test(text) || /\bexport\s+\{/.test(text);
        expect(hasExportKeyword, `${mfe.name} should not contain uncompiled export keyword`).toBe(false);
      }
    });
  });
});
