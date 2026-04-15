// sspa/mfe-chatbot/e2e/playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

const BASE_URL = process.env.E2E_BASE_URL || 'http://localhost:3013';
const IS_HTTPS = BASE_URL.startsWith('https://');
const EVIDENCE_DIR = process.env.E2E_EVIDENCE_DIR || '/tmp/cli-proxy-e2e-evidence';

export default defineConfig({
  testDir: './specs',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  timeout: 180_000,
  expect: {
    timeout: 60_000,
  },
  outputDir: process.env.E2E_OUTPUT_DIR || '/tmp/cli-proxy-e2e-results',
  reporter: [
    ['html', {
      open: 'never',
      outputFolder: process.env.E2E_REPORT_DIR || '/tmp/cli-proxy-e2e-report',
    }],
    ['list'],
  ],
  use: {
    baseURL: BASE_URL,
    ignoreHTTPSErrors: IS_HTTPS,
    trace: 'on-first-retry',
    screenshot: 'on',
    video: 'retain-on-failure',
  },
  metadata: {
    evidenceDir: EVIDENCE_DIR,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
