// sspa/mfe-chatbot/e2e/specs/02-nutrientes-soja.spec.ts
import { test, expect } from '@playwright/test';
import {
  mockChatSequence,
  sendMessage,
  clickQuickOption,
  captureEvidence,
  validateContextQuestions,
  validateClosing,
  SELECTORS,
} from '../fixtures/chat-mock';

test.describe('Script 02 — Nutrientes mais importantes para a soja', () => {

  test('fluxo completo: abertura -> nutrientes detalhados -> analise -> fechamento', async ({ page }, testInfo) => {
    await mockChatSequence(page, [
      {
        content: `Ótima pergunta! A soja é uma cultura exigente e bem sensível ao equilíbrio nutricional.
Vou explicar de forma simples, mas antes me diga:

1. Qual a região/UF da lavoura?
2. É primeiro cultivo ou área já consolidada?
3. Você já está com problema ou quer prevenir?`,
      },
      {
        content: `Perfeito. Para a soja, os nutrientes mais importantes se dividem em macros, secundários e micros:

A) Nitrogênio (N)
A soja depende da fixação biológica do nitrogênio. O mais importante é:
• Inoculação bem feita
• Solo corrigido (pH adequado)

B) Fósforo (P)
Essencial para raiz, energia da planta e formação de grãos. Normalmente é um dos mais limitantes.

C) Potássio (K)
Importante para enchimento de grãos, resistência a estresse hídrico e sanidade.

D) Cálcio (Ca) e Magnésio (Mg)
Ligados à estrutura do solo, desenvolvimento radicular e eficiência da fixação biológica.

E) Enxofre (S)
Muito importante para proteína e produtividade, e frequentemente esquecido.

F) Micronutrientes (principalmente B, Zn e Mo)
• Boro (B): flores e vagens
• Zinco (Zn): crescimento inicial
• Molibdênio (Mo): fixação do nitrogênio

Para saber se esses nutrientes estão adequados, o ideal é cruzar:
• Análise de solo
• Histórico da área
• Meta de produtividade

Você já possui uma análise de solo recente dessa área?`,
      },
      {
        content: `Ótimo! Se puder enviar os valores (ou uma foto do laudo), eu consigo:
• Identificar quais nutrientes estão baixos, médios ou altos
• Mostrar prioridades de correção para soja
• Indicar onde a soja pode estar limitando produtividade

Deseja continuar o atendimento com um profissional?`,
      },
    ]);

    await page.goto('/');
    await captureEvidence(page, testInfo, '00-saudacao-inicial');

    // 1) Abertura — usuario pergunta sobre nutrientes (digitando, como cliente real)
    const resp1 = await sendMessage(page, 'Quais os nutrientes mais importantes para a soja?', {
      testInfo, stepName: '01-abertura-pergunta-nutrientes',
    });
    const ctx = validateContextQuestions(resp1);
    expect(ctx.regiao).toBe(true);
    expect(ctx.problema).toBe(true);

    // 2) Resposta direta com todos os nutrientes
    const resp2 = await sendMessage(page, 'Mato Grosso, área já cultivada. Quero prevenir.', {
      testInfo, stepName: '02-nutrientes-detalhados',
    });
    expect(resp2).toContain('Nitrogênio');
    expect(resp2).toContain('Fósforo');
    expect(resp2).toContain('Potássio');
    expect(resp2).toContain('Cálcio');
    expect(resp2).toContain('Magnésio');
    expect(resp2).toContain('Enxofre');
    expect(resp2).toContain('Boro');
    expect(resp2).toContain('Zinco');
    expect(resp2).toContain('Molibdênio');
    expect(resp2).toContain('análise de solo');

    // 3) Caminho 1 — usuario tem analise
    const resp3 = await sendMessage(page, 'Sim, tenho.', {
      testInfo, stepName: '03-tem-analise-fechamento',
    });
    expect(resp3).toContain('enviar os valores');
    expect(resp3).toContain('prioridades');
    expect(validateClosing(resp3)).toBe(true);
  });

  test('caminho 2: usuario nao tem analise — orientacao pratica', async ({ page }, testInfo) => {
    await mockChatSequence(page, [
      {
        content: `Ótima pergunta! Qual a região/UF e é primeiro cultivo ou área consolidada?`,
      },
      {
        content: `Os nutrientes mais importantes para soja são N, P, K, Ca, Mg, S e micronutrientes (B, Zn, Mo).
Você já possui uma análise de solo recente dessa área?`,
      },
      {
        content: `Sem problema. De forma prática para soja:

• Primeiro passo é garantir pH corrigido
• Depois atenção especial em Fósforo e Potássio
• Não esquecer Enxofre e Micronutrientes, principalmente B, Zn e Mo

A análise de solo é o caminho mais seguro para investir certo e evitar desperdício.
Se quiser, posso te orientar sobre quando e como coletar o solo corretamente.

Deseja continuar o atendimento com um profissional?`,
      },
    ]);

    await page.goto('/');

    // Cliente digita a pergunta (outro padrao de inicio realista)
    await sendMessage(page, 'Quais os nutrientes mais importantes para a soja?', {
      testInfo, stepName: '01-abertura',
    });
    await sendMessage(page, 'Goiás, área consolidada.', {
      testInfo, stepName: '02-contexto-regiao',
    });
    const resp = await sendMessage(page, 'Ainda não fiz análise.', {
      testInfo, stepName: '03-sem-analise-orientacao',
    });

    expect(resp).toContain('pH corrigido');
    expect(resp).toContain('Fósforo');
    expect(resp).toContain('Potássio');
    expect(resp).toContain('Enxofre');
    expect(resp).toContain('B, Zn e Mo');
    expect(resp).toContain('análise de solo');
    expect(validateClosing(resp)).toBe(true);
  });
});
