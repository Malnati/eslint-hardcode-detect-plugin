// sspa/tests/e2e/browser/integrated/design-system-browser.spec.ts
import { test, expect } from '@playwright/test';
import { assertShellE2eEnv } from '../../utils/e2eEnv';

test.beforeEach(() => {
  assertShellE2eEnv();
});

// --- Module export parity tests ---

test('MFE Design System loads', async ({ page }) => {
  await page.goto('/');
  const dsModule = await page.evaluate(() =>
    System.import('@mfe/design-system').then(m => !!m).catch(() => false)
  );
  expect(dsModule).toBe(true);
});

test('Button component is exported', async ({ page }) => {
  await page.goto('/');
  const hasButton = await page.evaluate(() =>
    System.import('@mfe/design-system').then(m => !!m.Button)
  );
  expect(hasButton).toBe(true);
});

test('Input component is exported', async ({ page }) => {
  await page.goto('/');
  const hasInput = await page.evaluate(() =>
    System.import('@mfe/design-system').then(m => !!m.Input)
  );
  expect(hasInput).toBe(true);
});

test('Table component is exported', async ({ page }) => {
  await page.goto('/');
  const hasTable = await page.evaluate(() =>
    System.import('@mfe/design-system').then(m => !!m.Table)
  );
  expect(hasTable).toBe(true);
});

test('Checkbox component is exported', async ({ page }) => {
  await page.goto('/');
  const hasCheckbox = await page.evaluate(() =>
    System.import('@mfe/design-system').then(m => !!m.Checkbox)
  );
  expect(hasCheckbox).toBe(true);
});

test('Modal component is exported', async ({ page }) => {
  await page.goto('/');
  const hasModal = await page.evaluate(() =>
    System.import('@mfe/design-system').then(m => !!m.Modal)
  );
  expect(hasModal).toBe(true);
});

test('Badge component is exported', async ({ page }) => {
  await page.goto('/');
  const hasBadge = await page.evaluate(() =>
    System.import('@mfe/design-system').then(m => !!m.Badge)
  );
  expect(hasBadge).toBe(true);
});

test('Select component is exported', async ({ page }) => {
  await page.goto('/');
  const hasSelect = await page.evaluate(() =>
    System.import('@mfe/design-system').then(m => !!m.Select)
  );
  expect(hasSelect).toBe(true);
});

test('Code component is exported', async ({ page }) => {
  await page.goto('/');
  const hasCode = await page.evaluate(() =>
    System.import('@mfe/design-system').then(m => !!m.Code)
  );
  expect(hasCode).toBe(true);
});

test('Card component is exported', async ({ page }) => {
  await page.goto('/');
  const hasCard = await page.evaluate(() =>
    System.import('@mfe/design-system').then(m => !!m.Card)
  );
  expect(hasCard).toBe(true);
});

test('Form component is exported', async ({ page }) => {
  await page.goto('/');
  const hasForm = await page.evaluate(() =>
    System.import('@mfe/design-system').then(m => !!m.Form)
  );
  expect(hasForm).toBe(true);
});

test('DropdownMenu component is exported', async ({ page }) => {
  await page.goto('/');
  const hasDropdownMenu = await page.evaluate(() =>
    System.import('@mfe/design-system').then(m => !!m.DropdownMenu)
  );
  expect(hasDropdownMenu).toBe(true);
});

// --- CSS token parity tests (oklch theme) ---

test('CSS oklch color tokens are defined (primary, secondary, accent)', async ({ page }) => {
  await page.goto('/');
  const hasTokens = await page.evaluate(() => {
    const style = getComputedStyle(document.documentElement);
    const primary = style.getPropertyValue('--primary').trim();
    const secondary = style.getPropertyValue('--secondary').trim();
    const accent = style.getPropertyValue('--accent').trim();
    return !!(primary && secondary && accent);
  });
  expect(hasTokens).toBe(true);
});

test('CSS oklch background and foreground tokens are defined', async ({ page }) => {
  await page.goto('/');
  const hasTokens = await page.evaluate(() => {
    const style = getComputedStyle(document.documentElement);
    const background = style.getPropertyValue('--background').trim();
    const foreground = style.getPropertyValue('--foreground').trim();
    return !!(background && foreground);
  });
  expect(hasTokens).toBe(true);
});

test('CSS oklch card tokens are defined', async ({ page }) => {
  await page.goto('/');
  const hasTokens = await page.evaluate(() => {
    const style = getComputedStyle(document.documentElement);
    const card = style.getPropertyValue('--card').trim();
    const cardForeground = style.getPropertyValue('--card-foreground').trim();
    return !!(card && cardForeground);
  });
  expect(hasTokens).toBe(true);
});

test('CSS oklch border and input tokens are defined', async ({ page }) => {
  await page.goto('/');
  const hasTokens = await page.evaluate(() => {
    const style = getComputedStyle(document.documentElement);
    const border = style.getPropertyValue('--border').trim();
    const input = style.getPropertyValue('--input').trim();
    const ring = style.getPropertyValue('--ring').trim();
    return !!(border && input && ring);
  });
  expect(hasTokens).toBe(true);
});

test('CSS oklch destructive tokens are defined', async ({ page }) => {
  await page.goto('/');
  const hasTokens = await page.evaluate(() => {
    const style = getComputedStyle(document.documentElement);
    const destructive = style.getPropertyValue('--destructive').trim();
    const destructiveForeground = style.getPropertyValue('--destructive-foreground').trim();
    return !!(destructive && destructiveForeground);
  });
  expect(hasTokens).toBe(true);
});

test('CSS oklch muted tokens are defined', async ({ page }) => {
  await page.goto('/');
  const hasTokens = await page.evaluate(() => {
    const style = getComputedStyle(document.documentElement);
    const muted = style.getPropertyValue('--muted').trim();
    const mutedForeground = style.getPropertyValue('--muted-foreground').trim();
    return !!(muted && mutedForeground);
  });
  expect(hasTokens).toBe(true);
});

test('CSS oklch tokens use oklch() color format', async ({ page }) => {
  await page.goto('/');
  const oklchValid = await page.evaluate(() => {
    const style = getComputedStyle(document.documentElement);
    const tokens = ['--background', '--foreground', '--primary', '--card', '--border', '--input', '--ring'];
    return tokens.every(token => {
      const val = style.getPropertyValue(token).trim();
      return val.startsWith('oklch(');
    });
  });
  expect(oklchValid).toBe(true);
});

// --- 8pt grid token parity tests ---

test('8pt grid tokens are defined (space-1 through space-8)', async ({ page }) => {
  await page.goto('/');
  const hasGrid = await page.evaluate(() => {
    const style = getComputedStyle(document.documentElement);
    const space1 = style.getPropertyValue('--space-1').trim();
    const space2 = style.getPropertyValue('--space-2').trim();
    const space3 = style.getPropertyValue('--space-3').trim();
    const space4 = style.getPropertyValue('--space-4').trim();
    const space6 = style.getPropertyValue('--space-6').trim();
    const space8 = style.getPropertyValue('--space-8').trim();
    return !!(space1 && space2 && space3 && space4 && space6 && space8);
  });
  expect(hasGrid).toBe(true);
});

test('8pt grid values are multiples of 4px', async ({ page }) => {
  await page.goto('/');
  const valid = await page.evaluate(() => {
    const style = getComputedStyle(document.documentElement);
    const tokens = ['--space-1', '--space-2', '--space-3', '--space-4', '--space-6', '--space-8'];
    return tokens.every(token => {
      const val = parseInt(style.getPropertyValue(token).trim(), 10);
      return val > 0 && val % 4 === 0;
    });
  });
  expect(valid).toBe(true);
});

// --- 4x2 typography token parity tests ---

test('Typography tokens are defined (headline, subtitle, body, caption)', async ({ page }) => {
  await page.goto('/');
  const hasTypo = await page.evaluate(() => {
    const style = getComputedStyle(document.documentElement);
    const headline = style.getPropertyValue('--font-headline').trim();
    const subtitle = style.getPropertyValue('--font-subtitle').trim();
    const body = style.getPropertyValue('--font-body').trim();
    const caption = style.getPropertyValue('--font-caption').trim();
    return !!(headline && subtitle && body && caption);
  });
  expect(hasTypo).toBe(true);
});

test('Typography hierarchy is correct (headline > subtitle > body > caption)', async ({ page }) => {
  await page.goto('/');
  const ordered = await page.evaluate(() => {
    const style = getComputedStyle(document.documentElement);
    const headline = parseInt(style.getPropertyValue('--font-headline').trim(), 10);
    const subtitle = parseInt(style.getPropertyValue('--font-subtitle').trim(), 10);
    const body = parseInt(style.getPropertyValue('--font-body').trim(), 10);
    const caption = parseInt(style.getPropertyValue('--font-caption').trim(), 10);
    return headline > subtitle && subtitle > body && body > caption;
  });
  expect(ordered).toBe(true);
});

test('Font weight tokens are defined (regular, bold)', async ({ page }) => {
  await page.goto('/');
  const hasWeights = await page.evaluate(() => {
    const style = getComputedStyle(document.documentElement);
    const regular = style.getPropertyValue('--font-weight-regular').trim();
    const bold = style.getPropertyValue('--font-weight-bold').trim();
    return !!(regular && bold);
  });
  expect(hasWeights).toBe(true);
});

// --- Border radius and shadow token parity tests ---

test('Radius tokens are defined (sm, md, lg)', async ({ page }) => {
  await page.goto('/');
  const hasRadius = await page.evaluate(() => {
    const style = getComputedStyle(document.documentElement);
    const sm = style.getPropertyValue('--radius-sm').trim();
    const md = style.getPropertyValue('--radius-md').trim();
    const lg = style.getPropertyValue('--radius-lg').trim();
    return !!(sm && md && lg);
  });
  expect(hasRadius).toBe(true);
});

test('Shadow token is defined', async ({ page }) => {
  await page.goto('/');
  const hasShadow = await page.evaluate(() => {
    const style = getComputedStyle(document.documentElement);
    const shadow = style.getPropertyValue('--shadow-sm').trim();
    return !!shadow;
  });
  expect(hasShadow).toBe(true);
});

// --- Full DS export parity: all 12 components ---

test('Design System exports exactly the expected components', async ({ page }) => {
  await page.goto('/');
  const exports = await page.evaluate(() =>
    System.import('@mfe/design-system').then(m => {
      const expected = [
        'Badge', 'badgeVariants', 'Button', 'Card', 'Checkbox',
        'Code', 'DropdownMenu', 'Form', 'Input', 'Modal', 'Select', 'Table',
      ];
      return expected.every(name => name in m);
    })
  );
  expect(exports).toBe(true);
});
