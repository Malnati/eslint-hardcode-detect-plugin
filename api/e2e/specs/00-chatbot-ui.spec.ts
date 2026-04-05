// sspa/mfe-chatbot/e2e/specs/00-chatbot-ui.spec.ts
import { test, expect } from '@playwright/test';
import { SELECTORS, mockChatFixed, sendMessage, captureEvidence } from '../fixtures/chat-mock';

test.describe('Chatbot UI — Estrutura e Interacoes Basicas', () => {
  test.beforeEach(async ({ page }) => {
    await mockChatFixed(page, 'Resposta de teste do assistente.');
    await page.goto('/');
  });

  test('deve renderizar o container principal do chatbot', async ({ page }, testInfo) => {
    await expect(page.locator(SELECTORS.container)).toBeVisible();
    await captureEvidence(page, testInfo, '01-container-visivel');
  });

  test('deve exibir header com logo Chatbot e subtitulo', async ({ page }, testInfo) => {
    await expect(page.locator(SELECTORS.logo)).toHaveText('Chatbot');
    await expect(page.locator(SELECTORS.subtitle)).toHaveText('Assistente Virtual');
    await captureEvidence(page, testInfo, '01-header-logo-subtitulo');
  });

  test('deve exibir saudacao inicial com menu de opcoes', async ({ page }, testInfo) => {
    const firstMessage = page.locator(SELECTORS.messageAssistant).first();
    const content = await firstMessage.locator(SELECTORS.messageContent).textContent();

    expect(content).toContain('Olá! Sou o assistente virtual do Chatbot');
    expect(content).toContain('[1] Análise de solo');
    expect(content).toContain('[2] Pragas e doenças');
    expect(content).toContain('[3] Produção baixa / solo "cansado"');
    expect(content).toContain('[4] Compactação do solo');
    expect(content).toContain('[5] Outro assunto');
    expect(content).toContain('[6] Falar com um Técnico');
    expect(content).toContain('Digite o número ou escreva sua dúvida');

    await captureEvidence(page, testInfo, '01-saudacao-inicial-completa');
  });

  test('deve exibir 6 botoes de opcoes rapidas', async ({ page }, testInfo) => {
    const quickBtns = page.locator(SELECTORS.quickBtn);
    await expect(quickBtns).toHaveCount(6);

    await expect(quickBtns.nth(0)).toHaveText('1 - Análise de solo');
    await expect(quickBtns.nth(1)).toHaveText('2 - Pragas e doenças');
    await expect(quickBtns.nth(2)).toHaveText('3 - Solo cansado');
    await expect(quickBtns.nth(3)).toHaveText('4 - Compactação');
    await expect(quickBtns.nth(4)).toHaveText('5 - Outro assunto');
    await expect(quickBtns.nth(5)).toHaveText('6 - Falar com Técnico');

    await captureEvidence(page, testInfo, '01-6-botoes-rapidos');
  });

  test('deve exibir campo de API Key', async ({ page }, testInfo) => {
    const apiKeyInput = page.locator(SELECTORS.apiKeyInput);
    await expect(apiKeyInput).toBeVisible();
    await expect(apiKeyInput).toHaveAttribute('type', 'password');
    await expect(apiKeyInput).toHaveAttribute('placeholder', 'API Key (x-api-key)');
    await captureEvidence(page, testInfo, '01-campo-api-key');
  });

  test('deve exibir campo de input e botao enviar', async ({ page }, testInfo) => {
    await expect(page.locator(SELECTORS.textInput)).toBeVisible();
    await expect(page.locator(SELECTORS.sendBtn)).toBeVisible();
    await expect(page.locator(SELECTORS.textInput)).toHaveAttribute('placeholder', 'Digite sua mensagem...');
    await captureEvidence(page, testInfo, '01-input-e-botao-enviar');
  });

  test('botao enviar deve estar desabilitado quando input esta vazio', async ({ page }, testInfo) => {
    await expect(page.locator(SELECTORS.sendBtn)).toBeDisabled();
    await captureEvidence(page, testInfo, '01-botao-desabilitado');
  });

  test('botao enviar deve habilitar quando input tem texto', async ({ page }, testInfo) => {
    await page.fill(SELECTORS.textInput, 'Olá');
    await expect(page.locator(SELECTORS.sendBtn)).toBeEnabled();
    await captureEvidence(page, testInfo, '01-botao-habilitado');
  });

  test('deve enviar mensagem e exibir resposta do assistente', async ({ page }, testInfo) => {
    await captureEvidence(page, testInfo, '01-antes-enviar');

    const response = await sendMessage(page, 'Olá, preciso de ajuda', {
      testInfo, stepName: '02-apos-resposta-assistente',
    });

    const userMessages = page.locator(SELECTORS.messageUser);
    await expect(userMessages).toHaveCount(1);
    expect(response).toContain('Resposta de teste do assistente.');
  });

  test('deve ocultar opcoes rapidas apos enviar primeira mensagem', async ({ page }, testInfo) => {
    await expect(page.locator(SELECTORS.quickOptions)).toBeVisible();
    await captureEvidence(page, testInfo, '01-opcoes-visiveis');

    await sendMessage(page, '1', { testInfo, stepName: '02-opcoes-ocultas' });
    await expect(page.locator(SELECTORS.quickOptions)).not.toBeVisible();
  });

  test('botao Nova conversa deve resetar o chat', async ({ page }, testInfo) => {
    await sendMessage(page, 'Olá', { testInfo, stepName: '01-mensagem-enviada' });

    const userMessagesBefore = page.locator(SELECTORS.messageUser);
    await expect(userMessagesBefore).toHaveCount(1);

    await page.click(SELECTORS.newConversationBtn);

    await expect(page.locator(SELECTORS.messageUser)).toHaveCount(0);
    await expect(page.locator(SELECTORS.quickOptions)).toBeVisible();

    const firstMessage = page.locator(SELECTORS.messageAssistant).first();
    const content = await firstMessage.locator(SELECTORS.messageContent).textContent();
    expect(content).toContain('Olá! Sou o assistente virtual do Chatbot');

    await captureEvidence(page, testInfo, '02-chat-resetado');
  });

  test('deve incluir x-api-key no header quando preenchido', async ({ page }, testInfo) => {
    const requestPromise = page.waitForRequest('**/v1/chat/completions');

    await page.fill(SELECTORS.apiKeyInput, 'test-api-key-123');
    await page.fill(SELECTORS.textInput, 'Olá');
    await page.click(SELECTORS.sendBtn);

    const request = await requestPromise;
    expect(request.headers()['x-api-key']).toBe('test-api-key-123');

    await captureEvidence(page, testInfo, '01-api-key-enviada');
  });
});
