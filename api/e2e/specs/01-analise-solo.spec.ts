// sspa/mfe-chatbot/e2e/specs/01-analise-solo.spec.ts
import { test, expect } from '@playwright/test';
import {
  mockChatSequence,
  sendMessage,
  clickQuickOption,
  getAssistantMessages,
  captureEvidence,
  validateContextQuestions,
  validateClosing,
  SELECTORS,
} from '../fixtures/chat-mock';

test.describe('Script 01 — Interpretacao de analise de solo', () => {

  test('fluxo completo: abertura -> coleta -> interpretacao -> fechamento', async ({ page }, testInfo) => {
    await mockChatSequence(page, [
      {
        content: `Claro! Eu te ajudo. Para interpretar corretamente, preciso de 2 informações rápidas:

1. Qual a cultura (ex.: milho, soja, pastagem)?
2. Qual a região/UF e se o solo é mais arenoso ou argiloso (se souber)?`,
      },
      {
        content: `Perfeito. Sem problema sobre a textura. Agora me diga: você tem os valores de pH, P, K, Ca, Mg, Al, H+Al, CTC e V%?
Pode colar aqui ou enviar foto/PDF do laudo.`,
      },
      {
        content: `Obrigado! Vou interpretar em 4 partes simples:
(1) Acidez (pH e Al): pH 5,2 indica solo ácido. Al 0,2 é baixo, mas pode limitar raiz dependendo do ambiente.
(2) Saturação por bases (V%): V% 42 é médio/baixo para muitas situações — normalmente buscamos elevar o V conforme objetivo e cultura.
(3) Fósforo (P): P 6 geralmente é baixo, indicando chance de resposta à adubação fosfatada.
(4) Bases (K, Ca, Mg): Ca 1,5 e Mg 0,6 sugerem atenção para equilíbrio e construção de fertilidade; K 70 (depende da unidade) pode estar entre médio e bom.

Para fechar a recomendação com mais segurança, me confirme:
1. O P e K estão em qual unidade (mg/dm³, mmolc/dm³, cmolc/dm³)?
2. Qual o sistema (sequeiro ou irrigado) e o histórico (já aplicou calcário/gesso nos últimos 24 meses)?`,
      },
      {
        content: `Entendido. Com base no que temos:

Resumo:
• Acidez: precisa atenção (pH 5,2)
• Fertilidade geral: média para baixa (V% 42 e P baixo)
• Próximo passo: calagem e depois adubação fosfatada conforme meta de produtividade

Deseja continuar o atendimento com um profissional?`,
      },
    ]);

    await page.goto('/');
    await captureEvidence(page, testInfo, '00-saudacao-inicial');

    // 1) Abertura — usuario clica opcao 1 (como cliente real no menu)
    const resp1 = await clickQuickOption(page, '1 - Análise de solo', {
      testInfo, stepName: '01-abertura-opcao-1',
    });
    const ctx = validateContextQuestions(resp1);
    expect(ctx.cultura).toBe(true);
    expect(ctx.regiao).toBe(true);

    // 2) Coleta do contexto — usuario informa cultura e regiao
    const resp2 = await sendMessage(page, 'É para milho, Mato Grosso. Não sei a textura.', {
      testInfo, stepName: '02-coleta-contexto',
    });
    expect(resp2).toContain('pH');
    expect(resp2).toContain('V%');
    expect(resp2).toContain('foto/PDF');

    // 3) Caminho 1 — usuario envia dados parciais
    const resp3 = await sendMessage(
      page,
      'Tenho pH 5,2; V% 42; P 6; K 70; Ca 1,5; Mg 0,6; Al 0,2; H+Al 4,5.',
      { testInfo, stepName: '03-dados-parciais-interpretacao' },
    );
    expect(resp3).toContain('Acidez');
    expect(resp3).toContain('Saturação por bases');
    expect(resp3).toContain('Fósforo');
    expect(resp3).toContain('Bases');
    expect(resp3).toContain('unidade');

    // 4) Resposta adicional que leva ao fechamento
    const resp4 = await sendMessage(page, 'Sequeiro, sem calcário recente.', {
      testInfo, stepName: '04-fechamento-obrigatorio',
    });

    // 6) Fechamento obrigatorio
    expect(validateClosing(resp4)).toBe(true);

    // Valida contagem de mensagens (saudacao + 4 respostas IA, 4 msgs usuario)
    const assistantMsgs = await getAssistantMessages(page);
    expect(assistantMsgs.length).toBe(5);
  });

  test('caminho 2: usuario nao sabe unidades — fluxo realista', async ({ page }, testInfo) => {
    await mockChatSequence(page, [
      {
        content: `Claro! Para interpretar corretamente, preciso saber:
1. Qual a cultura?
2. Qual a região/UF?
3. Você já está com problema ou quer prevenir?`,
      },
      {
        content: `Perfeito. Você tem os valores de pH, P, K, Ca, Mg, Al, H+Al, CTC e V%?
Pode colar aqui ou enviar foto/PDF do laudo.`,
      },
      {
        content: `Sem problema. Do jeito mais prático:

• pH mostra acidez (quanto menor, mais ácido).
• Al e H+Al indicam "peso" da acidez e necessidade de correção.
• Ca e Mg são bases importantes para raiz/estrutura e entram na correção.
• CTC e V% ajudam a entender capacidade do solo e meta de saturação.
• P e K são nutrientes muito ligados à produtividade e resposta à adubação.

Se puder, envie uma foto do laudo que eu identifico as unidades e organizo tudo em um resumo.

Enquanto isso, me diga só mais uma coisa: o objetivo é produção alta (intensivo) ou manutenção (custos mais controlados)?

Deseja continuar o atendimento com um profissional?`,
      },
    ]);

    await page.goto('/');

    // Inicio realista via botao rapido
    const resp1 = await clickQuickOption(page, '1 - Análise de solo', {
      testInfo, stepName: '01-abertura-via-botao',
    });
    // Valida as 3 perguntas obrigatorias
    const ctx = validateContextQuestions(resp1);
    expect(ctx.cultura).toBe(true);
    expect(ctx.regiao).toBe(true);
    expect(ctx.problema).toBe(true);

    const resp2 = await sendMessage(page, 'Milho, Mato Grosso. Estou com problema.', {
      testInfo, stepName: '02-coleta-contexto',
    });
    expect(resp2).toContain('pH');

    const resp3 = await sendMessage(page, 'Não sei as unidades e não tenho o resto agora.', {
      testInfo, stepName: '03-sem-unidades-explicacao',
    });
    expect(resp3).toContain('pH');
    expect(resp3).toContain('acidez');
    expect(resp3).toContain('foto do laudo');
    expect(resp3).toContain('produção alta');
    expect(validateClosing(resp3)).toBe(true);
  });

  test('caminho 3: resposta rapida "ta bom ou ta ruim?" — fluxo realista', async ({ page }, testInfo) => {
    await mockChatSequence(page, [
      {
        content: `Claro! Qual a cultura e região?`,
      },
      {
        content: `Perfeito. Envie os valores de pH, P, K, Ca, Mg, Al, H+Al, CTC e V%.`,
      },
      {
        content: `Vou interpretar em 4 partes: acidez, V%, fósforo e bases.`,
      },
      {
        content: `Resposta rápida, com base no que você enviou:

• Acidez: está precisando atenção (pH 5,2).
• Fertilidade geral: parece média para baixa (V% 42 e P baixo).
• Próximo passo: normalmente começamos revisando correção (calcário) e depois definimos adubação (principalmente P) conforme meta de produtividade.

Se você enviar o laudo completo (ou foto), eu devolvo um resumo em tópicos com "o que está baixo/médio/alto" e as prioridades de correção.

Deseja continuar o atendimento com um profissional?`,
      },
    ]);

    await page.goto('/');

    // Inicio via botao rapido
    await clickQuickOption(page, '1 - Análise de solo', {
      testInfo, stepName: '01-abertura',
    });
    await sendMessage(page, 'Milho, Mato Grosso.', {
      testInfo, stepName: '02-contexto',
    });
    await sendMessage(page, 'Tenho pH 5,2; V% 42; P 6; K 70; Ca 1,5; Mg 0,6; Al 0,2; H+Al 4,5.', {
      testInfo, stepName: '03-dados-enviados',
    });
    const resp = await sendMessage(page, 'Quero uma resposta rápida: tá bom ou tá ruim?', {
      testInfo, stepName: '04-resposta-rapida',
    });

    expect(resp).toContain('Acidez');
    expect(resp).toContain('calcário');
    expect(resp).toContain('laudo completo');
    expect(validateClosing(resp)).toBe(true);
  });
});
