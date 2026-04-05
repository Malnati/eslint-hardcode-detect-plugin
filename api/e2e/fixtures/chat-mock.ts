// sspa/mfe-chatbot/e2e/fixtures/chat-mock.ts
import { Page, Route, TestInfo } from '@playwright/test';
import path from 'path';
import fs from 'fs';

export interface MockResponse {
  content: string;
  model?: string;
}

const EVIDENCE_DIR = process.env.E2E_EVIDENCE_DIR || '/tmp/cli-proxy-e2e-evidence';

/**
 * Creates an OpenAI-compatible chat completion response.
 */
export function buildChatResponse(content: string, model = 'openai/gpt-4o-mini'): string {
  return JSON.stringify({
    id: `chatcmpl-mock-${Date.now()}`,
    object: 'chat.completion',
    created: Math.floor(Date.now() / 1000),
    model,
    choices: [
      {
        index: 0,
        message: { role: 'assistant', content },
        finish_reason: 'stop',
      },
    ],
    usage: { prompt_tokens: 10, completion_tokens: 50, total_tokens: 60 },
  });
}

/**
 * Captures a screenshot as evidence for a specific step in the conversation.
 * Screenshots are saved to the evidence directory organized by test name.
 */
export async function captureEvidence(
  page: Page,
  testInfo: TestInfo,
  stepName: string,
): Promise<string> {
  const safeTitle = testInfo.title.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 80);
  const safeStep = stepName.replace(/[^a-zA-Z0-9_-]/g, '_');
  const specFile = path.basename(testInfo.file, '.spec.ts');
  const dir = path.join(EVIDENCE_DIR, specFile, safeTitle);

  fs.mkdirSync(dir, { recursive: true });

  const filePath = path.join(dir, `${safeStep}.png`);
  await page.screenshot({ path: filePath, fullPage: true });

  // Also attach to the test report
  await testInfo.attach(`${stepName}`, {
    path: filePath,
    contentType: 'image/png',
  });

  return filePath;
}

/**
 * Queues sequential mock responses for the chat endpoint.
 * Each call to /v1/chat/completions returns the next response in the queue.
 */
export async function mockChatSequence(page: Page, responses: MockResponse[]): Promise<void> {
  let callIndex = 0;

  await page.route('**/v1/chat/completions', async (route: Route) => {
    const idx = callIndex++;
    const mock = idx < responses.length
      ? responses[idx]
      : responses[responses.length - 1];

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: buildChatResponse(mock.content, mock.model),
    });
  });
}

/**
 * Mock that inspects the last user message and returns a matching response.
 * Useful for keyword-based routing in multi-turn conversations.
 */
export async function mockChatByKeyword(
  page: Page,
  mapping: Array<{ keywords: string[]; response: string }>,
  fallback: string,
): Promise<void> {
  await page.route('**/v1/chat/completions', async (route: Route) => {
    const body = route.request().postDataJSON();
    const messages: Array<{ role: string; content: string }> = body?.messages || [];
    const lastUser = [...messages].reverse().find((m) => m.role === 'user');
    const userText = (lastUser?.content || '').toLowerCase();

    const match = mapping.find((m) =>
      m.keywords.some((kw) => userText.includes(kw.toLowerCase())),
    );

    const content = match ? match.response : fallback;

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: buildChatResponse(content),
    });
  });
}

/**
 * Mock chat to always return a single fixed response.
 */
export async function mockChatFixed(page: Page, content: string): Promise<void> {
  await page.route('**/v1/chat/completions', async (route: Route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: buildChatResponse(content),
    });
  });
}

/**
 * Mock chat to return an error (e.g. 401, 500).
 */
export async function mockChatError(page: Page, status: number, message: string): Promise<void> {
  await page.route('**/v1/chat/completions', async (route: Route) => {
    await route.fulfill({
      status,
      contentType: 'application/json',
      body: JSON.stringify({ error: { message, type: 'error', code: status } }),
    });
  });
}

/** CSS selectors for chatbot UI elements */
export const SELECTORS = {
  container: '.chatbot-chatbot',
  header: '.chatbot-chatbot__header',
  logo: '.chatbot-chatbot__logo',
  subtitle: '.chatbot-chatbot__subtitle',
  newConversationBtn: '.chatbot-chatbot__btn-new',
  apiKeyInput: '.chatbot-chatbot__api-key-input',
  messagesArea: '.chatbot-chatbot__messages',
  messageUser: '.chatbot-chatbot__message--user',
  messageAssistant: '.chatbot-chatbot__message--assistant',
  messageContent: '.chatbot-chatbot__message-content',
  typing: '.chatbot-chatbot__typing',
  quickOptions: '.chatbot-chatbot__quick-options',
  quickBtn: '.chatbot-chatbot__quick-btn',
  inputArea: '.chatbot-chatbot__input-area',
  textInput: '.chatbot-chatbot__input',
  sendBtn: '.chatbot-chatbot__send-btn',
} as const;

/**
 * Sends a message via the chatbot input field and waits for the assistant response.
 * Optionally captures a screenshot as evidence after the response arrives.
 */
export async function sendMessage(
  page: Page,
  text: string,
  evidence?: { testInfo: TestInfo; stepName: string },
): Promise<string> {
  await page.fill(SELECTORS.textInput, text);
  await page.click(SELECTORS.sendBtn);

  // Wait for typing indicator to appear then disappear
  await page.waitForSelector(SELECTORS.typing, { state: 'visible', timeout: 5_000 }).catch(() => {});
  await page.waitForSelector(SELECTORS.typing, { state: 'detached', timeout: 60_000 });

  // Get the last assistant message
  const assistantMessages = page.locator(SELECTORS.messageAssistant);
  const count = await assistantMessages.count();
  const lastMessage = assistantMessages.nth(count - 1);
  const content = (await lastMessage.locator(SELECTORS.messageContent).textContent()) || '';

  if (evidence) {
    await captureEvidence(page, evidence.testInfo, evidence.stepName);
  }

  return content;
}

/**
 * Clicks a quick option button by its label text.
 * Optionally captures a screenshot as evidence after the response arrives.
 */
export async function clickQuickOption(
  page: Page,
  label: string,
  evidence?: { testInfo: TestInfo; stepName: string },
): Promise<string> {
  await page.click(`${SELECTORS.quickBtn}:has-text("${label}")`);

  await page.waitForSelector(SELECTORS.typing, { state: 'visible', timeout: 5_000 }).catch(() => {});
  await page.waitForSelector(SELECTORS.typing, { state: 'detached', timeout: 60_000 });

  const assistantMessages = page.locator(SELECTORS.messageAssistant);
  const count = await assistantMessages.count();
  const lastMessage = assistantMessages.nth(count - 1);
  const content = (await lastMessage.locator(SELECTORS.messageContent).textContent()) || '';

  if (evidence) {
    await captureEvidence(page, evidence.testInfo, evidence.stepName);
  }

  return content;
}

/**
 * Gets all visible assistant messages text.
 */
export async function getAssistantMessages(page: Page): Promise<string[]> {
  const messages = page.locator(`${SELECTORS.messageAssistant} ${SELECTORS.messageContent}`);
  const count = await messages.count();
  const texts: string[] = [];
  for (let i = 0; i < count; i++) {
    texts.push((await messages.nth(i).textContent()) || '');
  }
  return texts;
}

/**
 * Validates the 3 mandatory context questions are present in an assistant response.
 * Returns which questions were found.
 */
export function validateContextQuestions(responseText: string): {
  cultura: boolean;
  regiao: boolean;
  problema: boolean;
} {
  const lower = responseText.toLowerCase();
  return {
    cultura: lower.includes('cultura') || lower.includes('milho') || lower.includes('soja') || lower.includes('pastagem'),
    regiao: lower.includes('região') || lower.includes('uf') || lower.includes('estado'),
    problema: lower.includes('problema') || lower.includes('prevenir') || lower.includes('prevenção'),
  };
}

/**
 * Validates the mandatory closing question is present.
 */
export function validateClosing(responseText: string): boolean {
  const lower = responseText.toLowerCase();
  return lower.includes('profissional') || lower.includes('técnico') || lower.includes('continuar o atendimento');
}
