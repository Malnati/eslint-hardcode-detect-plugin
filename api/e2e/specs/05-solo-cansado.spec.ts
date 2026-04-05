// sspa/mfe-chatbot/e2e/specs/05-solo-cansado.spec.ts
import { test, expect } from '@playwright/test';
import {
  mockChatSequence,
  sendMessage,
  clickQuickOption,
  captureEvidence,
  validateContextQuestions,
  validateClosing,
} from '../fixtures/chat-mock';

test.describe('Script 05 — Solo cansado / producao baixa', () => {

  test('fluxo completo: abertura -> coleta -> 4 motivos -> complemento 3 frentes -> fechamento', async ({ page }, testInfo) => {
    await mockChatSequence(page, [
      {
        content: `Ótima pergunta — isso é mais comum do que parece.
E normalmente não está ligado só ao adubo.

Para te ajudar melhor, me diga:
1. Qual a cultura principal da área?
2. Há quanto tempo essa área vem sendo cultivada sem pausa ou rotação?
3. Você já está com problema ou quer prevenir?`,
      },
      {
        content: `Entendi. Isso já explica bastante coisa.

Agora me diga:
Você tem análise de solo recente (pH, matéria orgânica, V%, nutrientes)?
Ou percebe sintomas como: solo duro, baixa infiltração, plantas fracas?`,
      },
      {
        content: `Perfeito. Isso indica que o problema pode não ser só adubação.

Vou te explicar de forma simples os principais motivos:

(1) Perda de matéria orgânica
Com o tempo, o solo perde vida e estrutura.
Consequências: Menor retenção de água, menor eficiência dos adubos, solo mais "cansado".

(2) Compactação do solo
Solo duro dificulta crescimento de raiz.
Consequências: Raiz não se desenvolve, planta não absorve nutrientes, produção cai mesmo com adubo.

(3) Desequilíbrio químico
Mesmo adubando, pode haver pH inadequado, excesso ou falta de nutrientes, baixa saturação por bases.

(4) Falta de rotação de culturas
Monocultura desgasta o solo. Aumento de pragas e doenças, redução da fertilidade natural.

Resumo: O solo não está respondendo porque perdeu equilíbrio físico, químico e biológico.

Você já fez análise de solo nos últimos 12 meses?`,
      },
      {
        content: `Para recuperar o solo, normalmente trabalhamos em 3 frentes:

• Química: correção com calcário e ajuste nutricional
• Física: reduzir compactação (manejo, raízes profundas)
• Biológica: aumentar matéria orgânica (cobertura, resíduos)

Solo produtivo é solo equilibrado, não só adubado.

Deseja continuar o atendimento com um profissional?`,
      },
    ]);

    await page.goto('/');
    await captureEvidence(page, testInfo, '00-saudacao-inicial');

    // 1) Abertura via botao rapido — como cliente real
    const resp1 = await clickQuickOption(page, '3 - Solo cansado', {
      testInfo, stepName: '01-abertura-opcao-3',
    });
    const ctx = validateContextQuestions(resp1);
    expect(ctx.cultura).toBe(true);
    expect(ctx.problema).toBe(true);
    expect(resp1).toContain('rotação');

    // 2) Coleta de contexto
    const resp2 = await sendMessage(page, 'Soja há vários anos, sem rotação. Já estou com problema.', {
      testInfo, stepName: '02-coleta-contexto',
    });
    expect(resp2).toContain('análise de solo');

    // 3) Caminho 1 — usuario descreve cenario
    const resp3 = await sendMessage(page, 'Solo está duro e a produção caiu.', {
      testInfo, stepName: '03-cenario-4-motivos',
    });
    expect(resp3).toContain('matéria orgânica');
    expect(resp3).toContain('Compactação');
    expect(resp3).toContain('Desequilíbrio químico');
    expect(resp3).toContain('rotação de culturas');
    expect(resp3).toContain('equilíbrio físico, químico e biológico');

    // 4) Complemento tecnico — 3 frentes + fechamento
    const resp4 = await sendMessage(page, 'Não, não fiz análise nos últimos 12 meses.', {
      testInfo, stepName: '04-complemento-3-frentes-fechamento',
    });
    expect(resp4).toContain('Química');
    expect(resp4).toContain('Física');
    expect(resp4).toContain('Biológica');
    expect(resp4).toContain('equilibrado');
    expect(validateClosing(resp4)).toBe(true);
  });

  test('caminho 2: usuario nao tem analise — passos recomendados', async ({ page }, testInfo) => {
    await mockChatSequence(page, [
      {
        content: `Qual a cultura principal e há quanto tempo sem rotação?`,
      },
      {
        content: `Tem análise de solo recente?`,
      },
      {
        content: `Sem problema. De forma prática:

Quando o solo "cansa", normalmente envolve:
• Falta de matéria orgânica
• Compactação
• Acidez ou desequilíbrio nutricional

Primeiros passos recomendados:
• Fazer análise de solo
• Avaliar necessidade de calcário
• Iniciar rotação de culturas
• Usar plantas de cobertura (ex.: braquiária)

Só adubar, sem corrigir o solo, reduz muito o resultado.

Deseja continuar o atendimento com um profissional?`,
      },
    ]);

    await page.goto('/');

    // Inicio realista — via botao
    await clickQuickOption(page, '3 - Solo cansado', {
      testInfo, stepName: '01-abertura',
    });
    await sendMessage(page, 'Milho, 5 anos sem rotação.', {
      testInfo, stepName: '02-contexto',
    });
    const resp = await sendMessage(page, 'Não tenho análise.', {
      testInfo, stepName: '03-sem-analise',
    });

    expect(resp).toContain('matéria orgânica');
    expect(resp).toContain('Compactação');
    expect(resp).toContain('calcário');
    expect(resp).toContain('rotação de culturas');
    expect(resp).toContain('braquiária');
    expect(resp).toContain('Só adubar, sem corrigir o solo');
    expect(validateClosing(resp)).toBe(true);
  });

  test('caminho 3: resposta rapida direta', async ({ page }, testInfo) => {
    await mockChatSequence(page, [
      {
        content: `Qual a cultura e há quanto tempo cultiva sem rotação?`,
      },
      {
        content: `Resposta direta:

O solo "cansou" porque perdeu equilíbrio.

Principais causas:
• Falta de matéria orgânica
• Compactação
• Acidez ou desequilíbrio químico
• Uso contínuo sem rotação

Por isso o adubo sozinho não resolve.

Deseja continuar o atendimento com um profissional?`,
      },
    ]);

    await page.goto('/');

    // Inicio realista — via botao
    await clickQuickOption(page, '3 - Solo cansado', {
      testInfo, stepName: '01-abertura',
    });
    const resp = await sendMessage(page, 'Quero uma resposta rápida: por que não produz mais?', {
      testInfo, stepName: '02-resposta-rapida',
    });

    expect(resp).toContain('matéria orgânica');
    expect(resp).toContain('Compactação');
    expect(resp).toContain('rotação');
    expect(resp).toContain('adubo sozinho não resolve');
    expect(validateClosing(resp)).toBe(true);
  });
});
