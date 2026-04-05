// sspa/mfe-chatbot/e2e/specs/07-fechamento-tecnico.spec.ts
import { test, expect } from '@playwright/test';
import {
  mockChatSequence,
  mockChatByKeyword,
  mockChatError,
  sendMessage,
  clickQuickOption,
  captureEvidence,
  validateContextQuestions,
  validateClosing,
  getAssistantMessages,
  SELECTORS,
} from '../fixtures/chat-mock';

test.describe('Fechamento e derivacao', () => {
  test('deve oferecer continuidade com profissional ao final do atendimento', async ({ page }, testInfo) => {
    await mockChatSequence(page, [
      {
        content: `De nada! Fico feliz em ajudar.

Deseja continuar o atendimento com um profissional?`,
      },
    ]);

    await page.goto('/');
    const resp = await sendMessage(page, 'Obrigado pela ajuda.', {
      testInfo, stepName: '01-agradecimento-fechamento',
    });

    expect(validateClosing(resp)).toBe(true);
  });

  test('opcao 6 via botao: deve direcionar para WhatsApp/telefone', async ({ page }, testInfo) => {
    await mockChatSequence(page, [
      {
        content: `Claro! Para falar com um técnico Chatbot, você pode entrar em contato pelos seguintes canais:

• WhatsApp: Envie uma mensagem para nosso número de atendimento
• Telefone: Ligue para nossa central de atendimento

Deseja que eu envie o link do WhatsApp?`,
      },
    ]);

    await page.goto('/');
    await captureEvidence(page, testInfo, '00-saudacao-com-opcao-6');

    const resp = await clickQuickOption(page, '6 - Falar com Técnico', {
      testInfo, stepName: '01-opcao-6-whatsapp-telefone',
    });

    expect(resp).toContain('WhatsApp');
    expect(resp).toContain('Telefone');
    expect(resp).toContain('técnico');
  });

  test('opcao 6 digitada: "Quero falar com um tecnico"', async ({ page }, testInfo) => {
    await mockChatSequence(page, [
      {
        content: `Para falar com um técnico Chatbot, entre em contato pelo WhatsApp ou telefone.
Deseja que eu envie o link do WhatsApp?`,
      },
    ]);

    await page.goto('/');
    const resp = await sendMessage(page, 'Quero falar com um técnico.', {
      testInfo, stepName: '01-opcao-6-via-texto',
    });

    expect(resp).toContain('WhatsApp');
    expect(resp).toContain('telefone');
  });

  test('opcao 5 (Outro assunto): deve pedir as 3 perguntas obrigatorias', async ({ page }, testInfo) => {
    await mockChatSequence(page, [
      {
        content: `Sem problema! Estou aqui para ajudar com qualquer assunto agrícola.

Por favor, me conte:
1. Qual a cultura?
2. Qual sua região?
3. Você já está com problema ou quer prevenir?

Descreva sua dúvida que farei o possível para orientar.`,
      },
    ]);

    await page.goto('/');
    const resp = await clickQuickOption(page, '5 - Outro assunto', {
      testInfo, stepName: '01-opcao-5-perguntas-obrigatorias',
    });

    const ctx = validateContextQuestions(resp);
    expect(ctx.cultura).toBe(true);
    expect(ctx.regiao).toBe(true);
    expect(ctx.problema).toBe(true);
  });

  test('todas as opcoes 1-5 devem solicitar cultura/regiao/problema', async ({ page }, testInfo) => {
    const optionLabels = [
      '1 - Análise de solo',
      '2 - Pragas e doenças',
      '3 - Solo cansado',
      '4 - Compactação',
      '5 - Outro assunto',
    ];

    for (const label of optionLabels) {
      await mockChatByKeyword(
        page,
        [
          {
            keywords: ['1', '2', '3', '4', '5', 'análise', 'pragas', 'solo', 'compactação', 'outro'],
            response: `Para te orientar melhor, preciso saber:
1. Qual a cultura?
2. Qual sua região?
3. Você já está com problema ou quer prevenir?`,
          },
        ],
        'Qual a cultura, região e situação?',
      );

      await page.goto('/');
      const resp = await clickQuickOption(page, label, {
        testInfo, stepName: `01-perguntas-obrigatorias-${label.charAt(0)}`,
      });

      const ctx = validateContextQuestions(resp);
      expect(ctx.cultura).toBe(true);
      expect(ctx.regiao).toBe(true);

      // Reset routes for next iteration
      await page.unroute('**/v1/chat/completions');
    }
  });
});

test.describe('Tratamento de erro na conexao', () => {
  test('deve exibir mensagem de erro quando API retorna 500', async ({ page }, testInfo) => {
    await mockChatError(page, 500, 'Internal Server Error');
    await page.goto('/');

    await captureEvidence(page, testInfo, '00-antes-erro');

    await page.fill(SELECTORS.textInput, 'Olá');
    await page.click(SELECTORS.sendBtn);

    await page.waitForSelector(SELECTORS.typing, { state: 'detached', timeout: 10_000 }).catch(() => {});

    const assistantMessages = page.locator(SELECTORS.messageAssistant);
    const count = await assistantMessages.count();
    const lastMessage = await assistantMessages.nth(count - 1).locator(SELECTORS.messageContent).textContent();

    expect(lastMessage).toContain('erro');
    await captureEvidence(page, testInfo, '01-erro-500-exibido');
  });

  test('deve exibir mensagem de erro quando API retorna 401 (sem API key)', async ({ page }, testInfo) => {
    await mockChatError(page, 401, 'Unauthorized');
    await page.goto('/');

    await page.fill(SELECTORS.textInput, 'Olá');
    await page.click(SELECTORS.sendBtn);

    await page.waitForSelector(SELECTORS.typing, { state: 'detached', timeout: 10_000 }).catch(() => {});

    const assistantMessages = page.locator(SELECTORS.messageAssistant);
    const count = await assistantMessages.count();
    const lastMessage = await assistantMessages.nth(count - 1).locator(SELECTORS.messageContent).textContent();

    expect(lastMessage).toContain('erro');
    await captureEvidence(page, testInfo, '01-erro-401-exibido');
  });
});

test.describe('Fluxo completo de conversa multi-turno (cenario cliente real)', () => {
  test('cliente real: saudacao -> opcao 1 -> cultura/regiao -> dados -> interpretacao -> fechamento', async ({ page }, testInfo) => {
    await mockChatSequence(page, [
      {
        content: `Claro! Para te orientar sobre análise de solo, preciso saber:
1. Qual a cultura?
2. Qual sua região?
3. Está com problema ou quer prevenir?`,
      },
      {
        content: `Perfeito. Para milho no Mato Grosso, os valores importantes são pH, P, K, Ca, Mg, Al, H+Al, CTC e V%.
Você tem esses valores? Pode colar aqui ou enviar foto/PDF do laudo.`,
      },
      {
        content: `Com base nos dados informados:
• Acidez: pH 5,2 indica solo ácido
• V% 42 está médio/baixo
• P 6 é baixo
• K 70 entre médio e bom

Recomendação:
1. Iniciar com calagem (calcário) para corrigir pH
2. Adubação fosfatada para elevar P
3. Monitorar K e ajustar conforme meta

Deseja continuar o atendimento com um profissional?`,
      },
    ]);

    await page.goto('/');
    await captureEvidence(page, testInfo, '00-saudacao-inicial-6-opcoes');

    // Verifica estado inicial completo
    await expect(page.locator(SELECTORS.quickOptions)).toBeVisible();
    const quickBtns = page.locator(SELECTORS.quickBtn);
    await expect(quickBtns).toHaveCount(6);
    const greeting = page.locator(SELECTORS.messageAssistant).first();
    const greetingText = await greeting.locator(SELECTORS.messageContent).textContent();
    expect(greetingText).toContain('Olá! Sou o assistente virtual do Chatbot');

    // Turno 1: cliente clica opcao do menu
    const resp1 = await clickQuickOption(page, '1 - Análise de solo', {
      testInfo, stepName: '01-cliente-clica-opcao-1',
    });
    const ctx = validateContextQuestions(resp1);
    expect(ctx.cultura).toBe(true);
    expect(ctx.regiao).toBe(true);
    expect(ctx.problema).toBe(true);

    // Opcoes rapidas devem sumir apos primeira interacao
    await expect(page.locator(SELECTORS.quickOptions)).not.toBeVisible();

    // Turno 2: cliente informa contexto (como um produtor real falaria)
    const resp2 = await sendMessage(page, 'Milho, Mato Grosso. Estou com problema de produtividade.', {
      testInfo, stepName: '02-cliente-informa-contexto',
    });
    expect(resp2).toContain('pH');
    expect(resp2).toContain('foto/PDF');

    // Turno 3: cliente cola dados do laudo
    const resp3 = await sendMessage(
      page,
      'pH 5,2; V% 42; P 6; K 70; Ca 1,5; Mg 0,6; Al 0,2; H+Al 4,5.',
      { testInfo, stepName: '03-cliente-cola-dados-laudo' },
    );
    expect(resp3).toContain('calagem');
    expect(resp3).toContain('calcário');
    expect(resp3).toContain('fosfatada');
    expect(validateClosing(resp3)).toBe(true);

    // Valida contagem final de mensagens
    const userMessages = page.locator(SELECTORS.messageUser);
    const assistantMessages = page.locator(SELECTORS.messageAssistant);
    await expect(userMessages).toHaveCount(3);
    // saudacao + 3 respostas = 4
    await expect(assistantMessages).toHaveCount(4);

    await captureEvidence(page, testInfo, '04-conversa-completa-final');
  });

  test('cliente real: saudacao -> opcao 6 -> direcionamento tecnico (WhatsApp/telefone)', async ({ page }, testInfo) => {
    await mockChatSequence(page, [
      {
        content: `Claro! Para falar com um técnico Chatbot, você pode entrar em contato pelos seguintes canais:

• WhatsApp: Envie uma mensagem para nosso número de atendimento
• Telefone: Ligue para nossa central de atendimento

Deseja que eu envie o link do WhatsApp?`,
      },
    ]);

    await page.goto('/');
    await captureEvidence(page, testInfo, '00-saudacao-antes-opcao-6');

    const resp = await clickQuickOption(page, '6 - Falar com Técnico', {
      testInfo, stepName: '01-cliente-clica-opcao-6',
    });

    expect(resp).toContain('WhatsApp');
    expect(resp).toContain('Telefone');
    expect(resp).toContain('técnico');

    // Opcoes sumiram
    await expect(page.locator(SELECTORS.quickOptions)).not.toBeVisible();

    await captureEvidence(page, testInfo, '02-direcionamento-tecnico-final');
  });

  test('cliente real: nova conversa reseta todo o estado', async ({ page }, testInfo) => {
    await mockChatSequence(page, [
      { content: 'Primeira resposta do assistente.' },
      { content: 'Segunda resposta do assistente.' },
    ]);

    await page.goto('/');

    // Envia duas mensagens
    await sendMessage(page, 'Olá', { testInfo, stepName: '01-primeira-msg' });
    await sendMessage(page, 'Como analisar solo?', { testInfo, stepName: '02-segunda-msg' });

    const usersBefore = await page.locator(SELECTORS.messageUser).count();
    expect(usersBefore).toBe(2);

    // Clica nova conversa
    await page.click(SELECTORS.newConversationBtn);
    await captureEvidence(page, testInfo, '03-apos-nova-conversa');

    // Tudo resetou
    await expect(page.locator(SELECTORS.messageUser)).toHaveCount(0);
    await expect(page.locator(SELECTORS.quickOptions)).toBeVisible();

    const msgs = await getAssistantMessages(page);
    expect(msgs.length).toBe(1);
    expect(msgs[0]).toContain('Olá! Sou o assistente virtual do Chatbot');
  });
});
