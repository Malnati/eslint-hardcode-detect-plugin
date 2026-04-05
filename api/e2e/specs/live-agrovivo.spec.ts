// sspa/mfe-chatbot/e2e/specs/live-agrovivo.spec.ts
import { test, expect, Page } from '@playwright/test';
import path from 'path';
import fs from 'fs';

/**
 * E2E tests for Chatbot chatbot MFE standalone — LIVE (no mocks).
 * Requires:
 *   - mfe-chatbot running at E2E_BASE_URL (default: http://localhost:3013)
 *   - api-proxy-openrouter running and connected to OpenRouter
 *   - Valid API key in rotation file or E2E_API_KEY env var
 */

const ROTATION_DATA_DIR = process.env.ROTATION_DATA_DIR || '/tmp/rotation-test';
const API_KEY = process.env.E2E_API_KEY || (() => {
  try {
    const rotPath = path.join(ROTATION_DATA_DIR, 'key-rotation.json');
    const data = JSON.parse(fs.readFileSync(rotPath, 'utf-8'));
    return data['api-proxy-openrouter']?.token || '';
  } catch {
    return '';
  }
})();

const SELECTORS = {
  container: '.chatbot-chatbot',
  logo: '.chatbot-chatbot__logo',
  subtitle: '.chatbot-chatbot__subtitle',
  apiKeyInput: '.chatbot-chatbot__api-key-input',
  quickOptions: '.chatbot-chatbot__quick-options',
  quickBtn: '.chatbot-chatbot__quick-btn',
  messageUser: '.chatbot-chatbot__message--user',
  messageAssistant: '.chatbot-chatbot__message--assistant',
  messageContent: '.chatbot-chatbot__message-content',
  typing: '.chatbot-chatbot__typing',
  textInput: '.chatbot-chatbot__input',
  sendBtn: '.chatbot-chatbot__send-btn',
  newConversationBtn: '.chatbot-chatbot__btn-new',
};

const EVIDENCE_DIR = process.env.E2E_EVIDENCE_DIR || '/tmp/cli-proxy-e2e-evidence';

async function screenshot(page: Page, testTitle: string, step: string) {
  const safe = testTitle.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 60);
  const dir = path.join(EVIDENCE_DIR, 'live-chatbot', safe);
  fs.mkdirSync(dir, { recursive: true });
  await page.screenshot({ path: path.join(dir, `${step}.png`), fullPage: true });
}

async function sendMsg(page: Page, text: string): Promise<string> {
  await page.fill(SELECTORS.textInput, text);
  await page.click(SELECTORS.sendBtn);

  // Wait for typing to appear and disappear (real API may take 5-30s)
  await page.waitForSelector(SELECTORS.typing, { state: 'visible', timeout: 10_000 }).catch(() => {});
  await page.waitForSelector(SELECTORS.typing, { state: 'detached', timeout: 120_000 });

  const msgs = page.locator(SELECTORS.messageAssistant);
  const count = await msgs.count();
  return (await msgs.nth(count - 1).locator(SELECTORS.messageContent).textContent()) || '';
}

async function clickOption(page: Page, label: string): Promise<string> {
  await page.click(`${SELECTORS.quickBtn}:has-text("${label}")`);

  await page.waitForSelector(SELECTORS.typing, { state: 'visible', timeout: 10_000 }).catch(() => {});
  await page.waitForSelector(SELECTORS.typing, { state: 'detached', timeout: 120_000 });

  const msgs = page.locator(SELECTORS.messageAssistant);
  const count = await msgs.count();
  return (await msgs.nth(count - 1).locator(SELECTORS.messageContent).textContent()) || '';
}

function assertContainsAny(text: string, keywords: string[], context: string) {
  const lower = text.toLowerCase();
  const found = keywords.filter(kw => lower.includes(kw.toLowerCase()));
  if (found.length === 0) {
    throw new Error(
      `[${context}] Response does not contain any of [${keywords.join(', ')}].\nResponse: ${text.substring(0, 300)}...`,
    );
  }
}

test.describe('Chatbot Chatbot E2E LIVE (sem mock)', () => {
  test.beforeEach(async ({ page }) => {
    test.skip(!API_KEY, 'E2E_API_KEY not set and rotation file not found');
    await page.goto('/');
    await expect(page.locator(SELECTORS.container)).toBeVisible();
    // Set the API key
    await page.fill(SELECTORS.apiKeyInput, API_KEY);
  });

  test.describe('Saudacao e UI', () => {
    test('deve exibir saudacao inicial com 6 opcoes', async ({ page }) => {
      const greeting = await page.locator(SELECTORS.messageAssistant).first().locator(SELECTORS.messageContent).textContent();
      expect(greeting).toContain('Chatbot');
      expect(greeting).toContain('[1]');
      expect(greeting).toContain('[6]');

      const btns = page.locator(SELECTORS.quickBtn);
      await expect(btns).toHaveCount(6);

      await screenshot(page, 'saudacao', '01-saudacao-6-opcoes');
    });
  });

  test.describe('Script 01 — Analise de solo', () => {
    test('fluxo completo: opcao 1 -> contexto -> dados -> interpretacao', async ({ page }) => {
      const r1 = await clickOption(page, '1 - Análise de solo');
      assertContainsAny(r1, ['cultura', 'região', 'solo'], 'Abertura Script 01');
      await screenshot(page, 'script01-completo', '01-abertura');

      const r2 = await sendMsg(page, 'É para milho, Mato Grosso. Não sei a textura.');
      assertContainsAny(r2, ['pH', 'V%', 'valores', 'laudo', 'análise'], 'Coleta Script 01');
      await screenshot(page, 'script01-completo', '02-coleta');

      const r3 = await sendMsg(page, 'Tenho pH 5,2; V% 42; P 6; K 70; Ca 1,5; Mg 0,6; Al 0,2; H+Al 4,5.');
      assertContainsAny(r3, ['pH', 'acidez', 'fósforo', 'saturação', 'V%', 'calcário'], 'Interpretacao Script 01');
      await screenshot(page, 'script01-completo', '03-interpretacao');
    });
  });

  test.describe('Script 02 — Nutrientes para soja', () => {
    test('deve responder sobre nutrientes essenciais', async ({ page }) => {
      const r1 = await sendMsg(page, 'Quais os nutrientes mais importantes para a soja?');
      assertContainsAny(r1, ['soja', 'nutriente', 'região', 'cultura'], 'Abertura Script 02');
      await screenshot(page, 'script02', '01-abertura');

      const r2 = await sendMsg(page, 'Mato Grosso, área já cultivada.');
      assertContainsAny(r2, ['nitrogênio', 'fósforo', 'potássio', 'cálcio', 'enxofre', 'micronutriente', 'N', 'P', 'K'], 'Nutrientes Script 02');
      await screenshot(page, 'script02', '02-nutrientes');
    });
  });

  test.describe('Script 03 — Correcao de acidez', () => {
    test('deve orientar sobre calagem', async ({ page }) => {
      const r1 = await sendMsg(page, 'Como corrigir a acidez do solo?');
      assertContainsAny(r1, ['cultura', 'análise', 'solo'], 'Abertura Script 03');
      await screenshot(page, 'script03', '01-abertura');

      const r2 = await sendMsg(page, 'É para soja. Tenho análise sim.');
      assertContainsAny(r2, ['pH', 'V%', 'valores', 'laudo'], 'Coleta Script 03');

      const r3 = await sendMsg(page, 'Tenho pH 5,0; V% 38; Ca 1,2; Mg 0,5; Al 0,4; H+Al 5,2.');
      assertContainsAny(r3, ['calcário', 'calagem', 'pH', 'acidez', 'alumínio'], 'Calagem Script 03');
      await screenshot(page, 'script03', '02-calagem');
    });
  });

  test.describe('Script 04 — Pragas e doencas', () => {
    test('deve orientar sobre lagartas em soja', async ({ page }) => {
      const r1 = await clickOption(page, '2 - Pragas e doenças');
      assertContainsAny(r1, ['cultura', 'problema', 'prevenção', 'lavoura'], 'Abertura Script 04');
      await screenshot(page, 'script04', '01-abertura');

      const r2 = await sendMsg(page, 'Soja, já estou com problema.');
      assertContainsAny(r2, ['sintoma', 'foto', 'identificar', 'folha'], 'Coleta Script 04');

      const r3 = await sendMsg(page, 'Tem lagarta comendo as folhas.');
      assertContainsAny(r3, ['monitoramento', 'controle biológico', 'MIP', 'lagarta', 'Bt', 'manejo'], 'Orientacao Script 04');
      await screenshot(page, 'script04', '02-lagarta');
    });
  });

  test.describe('Script 05 — Solo cansado', () => {
    test('deve explicar solo cansado', async ({ page }) => {
      const r1 = await clickOption(page, '3 - Solo cansado');
      assertContainsAny(r1, ['cultura', 'rotação', 'tempo', 'área'], 'Abertura Script 05');
      await screenshot(page, 'script05', '01-abertura');

      const r2 = await sendMsg(page, 'Soja há vários anos, sem rotação.');
      assertContainsAny(r2, ['análise', 'solo duro', 'sintoma', 'matéria orgânica'], 'Coleta Script 05');

      const r3 = await sendMsg(page, 'Solo está duro e a produção caiu.');
      assertContainsAny(r3, ['matéria orgânica', 'compactação', 'desequilíbrio', 'rotação', 'equilíbrio'], 'Cenario Script 05');
      await screenshot(page, 'script05', '02-cenario');
    });
  });

  test.describe('Script 06 — Compactacao do solo', () => {
    test('deve orientar sobre compactacao', async ({ page }) => {
      const r1 = await clickOption(page, '4 - Compactação');
      assertContainsAny(r1, ['cultura', 'solo duro', 'desenvolvimento', 'planta'], 'Abertura Script 06');
      await screenshot(page, 'script06', '01-abertura');

      const r2 = await sendMsg(page, 'Soja, e o solo está bem duro.');
      assertContainsAny(r2, ['raiz', 'água', 'infiltração', 'superficial', 'sinal'], 'Sinais Script 06');

      const r3 = await sendMsg(page, 'Sim, água fica na superfície e as plantas não desenvolvem bem.');
      assertContainsAny(r3, ['compactação', 'subsolagem', 'escarificação', 'braquiária', 'raiz profunda', 'tráfego'], 'Solucao Script 06');
      await screenshot(page, 'script06', '02-solucao');
    });
  });

  test.describe('Fechamento e opcao 6', () => {
    test('deve oferecer continuidade com profissional', async ({ page }) => {
      const r1 = await sendMsg(page, 'Obrigado pela ajuda.');
      assertContainsAny(r1, ['profissional', 'técnico', 'continuar', 'atendimento'], 'Fechamento');
      await screenshot(page, 'fechamento', '01-profissional');
    });

    test('opcao 6: deve direcionar para WhatsApp/telefone', async ({ page }) => {
      const r1 = await clickOption(page, '6 - Falar com Técnico');
      assertContainsAny(r1, ['whatsapp', 'telefone', 'técnico', 'contato'], 'Opcao 6');
      await screenshot(page, 'opcao6', '01-whatsapp-telefone');
    });

    test('opcao 5: deve responder e solicitar mais detalhes', async ({ page }) => {
      const r1 = await clickOption(page, '5 - Outro assunto');
      assertContainsAny(r1, ['cultura', 'região', 'problema', 'prevenir', 'assunto', 'ajudar', 'dúvida', 'conversar', 'orientar'], 'Opcao 5');
      await screenshot(page, 'opcao5', '01-outro-assunto');
    });
  });

  test.describe('UI: Nova conversa e estado', () => {
    test('nova conversa deve resetar o chat', async ({ page }) => {
      await sendMsg(page, 'Olá');
      await expect(page.locator(SELECTORS.messageUser)).toHaveCount(1);
      await expect(page.locator(SELECTORS.quickOptions)).not.toBeVisible();

      await page.click(SELECTORS.newConversationBtn);

      await expect(page.locator(SELECTORS.messageUser)).toHaveCount(0);
      await expect(page.locator(SELECTORS.quickOptions)).toBeVisible();
      await screenshot(page, 'nova-conversa', '01-resetado');
    });
  });
});
