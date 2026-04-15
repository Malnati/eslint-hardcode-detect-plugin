// sspa/mfe-chatbot/e2e/specs/03-correcao-acidez.spec.ts
import { test, expect } from '@playwright/test';
import {
  mockChatSequence,
  sendMessage,
  clickQuickOption,
  captureEvidence,
  validateContextQuestions,
  validateClosing,
} from '../fixtures/chat-mock';

test.describe('Script 03 — Correcao de acidez do solo', () => {

  test('fluxo completo: abertura -> coleta -> dados -> calagem -> complemento gesso -> fechamento', async ({ page }, testInfo) => {
    await mockChatSequence(page, [
      {
        content: `Claro! Eu te ajudo com isso.
Para te orientar da forma correta, preciso de 2 informações rápidas:

1. Qual a cultura (ex.: soja, milho, pastagem)?
2. Você já tem análise de solo recente?`,
      },
      {
        content: `Perfeito. Isso ajuda bastante.
Agora me diga: você tem os valores de pH, V%, Ca, Mg, Al e H+Al?
Pode colar aqui ou enviar foto/PDF do laudo.`,
      },
      {
        content: `Obrigado! Vou te explicar de forma simples:

(1) Acidez (pH):
pH 5,0 indica solo ácido, o que pode limitar o desenvolvimento das raízes.

(2) Alumínio (Al):
Al 0,4 já pode causar toxicidade para as plantas.

(3) Saturação por bases (V%):
V% 38 está baixo — normalmente buscamos elevar esse valor para melhorar a fertilidade.

Correção recomendada:
O principal caminho é a aplicação de calcário (calagem).

Ele vai:
• Aumentar o pH
• Reduzir o alumínio
• Fornecer cálcio e magnésio
• Melhorar a eficiência dos fertilizantes

Para definir a dose correta, preciso confirmar:
• Qual a textura do solo (arenoso ou argiloso)?
• Já foi aplicado calcário nos últimos 2 anos?`,
      },
      {
        content: `Entendido. Em alguns casos, além do calcário, pode ser usado:

• Gesso agrícola → melhora o ambiente em profundidade
• Indicado quando há limitação nas camadas mais profundas

Mas isso depende do resultado da análise.

Deseja continuar o atendimento com um profissional?`,
      },
    ]);

    await page.goto('/');
    await captureEvidence(page, testInfo, '00-saudacao-inicial');

    // 1) Abertura — usuario digita pergunta como faria um cliente real
    const resp1 = await sendMessage(page, 'Como corrigir a acidez do solo?', {
      testInfo, stepName: '01-abertura',
    });
    expect(resp1).toContain('cultura');
    expect(resp1).toContain('análise de solo');

    // 2) Coleta — usuario informa cultura e que tem analise
    const resp2 = await sendMessage(page, 'É para soja. Tenho análise sim.', {
      testInfo, stepName: '02-coleta-cultura-analise',
    });
    expect(resp2).toContain('pH');
    expect(resp2).toContain('V%');
    expect(resp2).toContain('foto/PDF');

    // 3) Caminho 1 — usuario envia dados da analise
    const resp3 = await sendMessage(
      page,
      'Tenho pH 5,0; V% 38; Ca 1,2; Mg 0,5; Al 0,4; H+Al 5,2.',
      { testInfo, stepName: '03-dados-analise-interpretacao' },
    );
    expect(resp3).toContain('Acidez');
    expect(resp3).toContain('Alumínio');
    expect(resp3).toContain('calcário');
    expect(resp3).toContain('calagem');
    expect(resp3).toContain('textura');

    // 4) Complemento tecnico — gesso agricola
    const resp4 = await sendMessage(page, 'Argiloso. Não aplicou calcário recente.', {
      testInfo, stepName: '04-complemento-gesso-fechamento',
    });
    expect(resp4).toContain('Gesso agrícola');
    expect(resp4).toContain('profundidade');
    expect(validateClosing(resp4)).toBe(true);
  });

  test('caminho 2: usuario nao tem analise — orientacao pratica', async ({ page }, testInfo) => {
    await mockChatSequence(page, [
      {
        content: `Claro! Qual a cultura e você tem análise de solo?`,
      },
      {
        content: `Sem problema. De forma prática:

Se o solo é ácido (o que é comum), a correção geralmente é feita com calcário.

O calcário ajuda a:
• Aumentar o pH
• Neutralizar o alumínio
• Melhorar a disponibilidade de nutrientes

Mas o ideal é fazer uma análise de solo para:
• Saber a dose correta
• Evitar gastar a mais ou aplicar menos que o necessário

Se quiser, posso te orientar como coletar o solo corretamente.

Deseja continuar o atendimento com um profissional?`,
      },
    ]);

    await page.goto('/');

    const resp1 = await sendMessage(page, 'Como corrigir a acidez do solo?', {
      testInfo, stepName: '01-abertura',
    });
    expect(resp1).toContain('cultura');

    const resp2 = await sendMessage(page, 'Soja. Não tenho análise.', {
      testInfo, stepName: '02-sem-analise-orientacao',
    });
    expect(resp2).toContain('calcário');
    expect(resp2).toContain('pH');
    expect(resp2).toContain('análise de solo');
    expect(resp2).toContain('coletar o solo');
    expect(validateClosing(resp2)).toBe(true);
  });

  test('caminho 3: resposta rapida direta', async ({ page }, testInfo) => {
    await mockChatSequence(page, [
      {
        content: `Qual a cultura e tem análise de solo?`,
      },
      {
        content: `Resposta direta:

A forma mais comum de corrigir a acidez do solo é com calcário (calagem).

Resumo prático:
• Solo ácido → aplicar calcário
• Dose depende da análise de solo
• Objetivo é aumentar o pH e melhorar a fertilidade

Se quiser precisão na recomendação, o ideal é usar a análise de solo.

Deseja continuar o atendimento com um profissional?`,
      },
    ]);

    await page.goto('/');

    await sendMessage(page, 'Como corrigir a acidez do solo?', {
      testInfo, stepName: '01-abertura',
    });
    const resp = await sendMessage(page, 'Quero uma resposta rápida: como corrijo?', {
      testInfo, stepName: '02-resposta-rapida',
    });

    expect(resp).toContain('calcário');
    expect(resp).toContain('calagem');
    expect(resp).toContain('pH');
    expect(validateClosing(resp)).toBe(true);
  });
});
