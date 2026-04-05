// sspa/mfe-chatbot/e2e/specs/06-compactacao-solo.spec.ts
import { test, expect } from '@playwright/test';
import {
  mockChatSequence,
  sendMessage,
  clickQuickOption,
  captureEvidence,
  validateContextQuestions,
  validateClosing,
} from '../fixtures/chat-mock';

test.describe('Script 06 — Compactacao do solo', () => {

  test('fluxo completo: abertura -> sinais -> sintomas confirmados -> solucao -> boas praticas -> fechamento', async ({ page }, testInfo) => {
    await mockChatSequence(page, [
      {
        content: `Ótima pergunta — a compactação é um dos principais fatores que limitam a produtividade.

Para te orientar melhor, me diga:
1. Qual a cultura da área?
2. Você percebe solo duro ou dificuldade de desenvolvimento das plantas?`,
      },
      {
        content: `Entendi, isso já é um forte indicativo.

Agora me diga:
Você observa algum desses sinais?
• Raiz superficial ou torta
• Água acumulando ou escorrendo
• Baixa infiltração
• Plantas com desenvolvimento desigual`,
      },
      {
        content: `Perfeito, isso indica compactação do solo.

Vou te explicar de forma simples:

(1) Como identificar na prática
Além dos sinais visuais, você pode:
• Fazer o teste com uma haste ou enxada → dificuldade para penetrar o solo
• Abrir um perfil de solo → verificar camada dura (pé de grade ou de arado)

(2) Principais causas
• Tráfego excessivo de máquinas
• Solo úmido sendo trabalhado
• Falta de cobertura vegetal
• Monocultura

(3) Como resolver
Curto prazo:
• Escarificação ou subsolagem (quando necessário)

Médio e longo prazo (mais sustentável):
• Uso de plantas com raiz profunda (ex.: braquiária, nabo forrageiro)
• Rotação de culturas
• Manter cobertura do solo

O ideal é combinar correção mecânica com manejo biológico.

Essa área recebe muito tráfego de máquinas?`,
      },
      {
        content: `Boas práticas que ajudam a evitar o problema:

• Evitar operações com solo muito úmido
• Trabalhar com sistema de plantio direto
• Melhorar matéria orgânica
• Planejar linhas de tráfego (tráfego controlado)

Solo bem estruturado melhora produtividade e reduz custos.

Deseja continuar o atendimento com um profissional?`,
      },
    ]);

    await page.goto('/');
    await captureEvidence(page, testInfo, '00-saudacao-inicial');

    // 1) Abertura via botao rapido
    const resp1 = await clickQuickOption(page, '4 - Compactação', {
      testInfo, stepName: '01-abertura-opcao-4',
    });
    expect(resp1).toContain('cultura');
    expect(resp1).toContain('solo duro');

    // 2) Coleta de contexto
    const resp2 = await sendMessage(page, 'Soja, e o solo está bem duro.', {
      testInfo, stepName: '02-coleta-soja-solo-duro',
    });
    expect(resp2).toContain('Raiz superficial');
    expect(resp2).toContain('Água acumulando');
    expect(resp2).toContain('Baixa infiltração');

    // 3) Caminho 1 — usuario confirma sintomas
    const resp3 = await sendMessage(
      page,
      'Sim, água fica na superfície e as plantas não desenvolvem bem.',
      { testInfo, stepName: '03-sintomas-confirmados-solucao' },
    );
    expect(resp3).toContain('compactação');
    expect(resp3).toContain('haste ou enxada');
    expect(resp3).toContain('Tráfego excessivo');
    expect(resp3).toContain('Escarificação');
    expect(resp3).toContain('subsolagem');
    expect(resp3).toContain('braquiária');
    expect(resp3).toContain('nabo forrageiro');
    expect(resp3).toContain('Rotação de culturas');

    // 4) Complemento — boas praticas + fechamento
    const resp4 = await sendMessage(page, 'Sim, bastante tráfego de colheitadeira.', {
      testInfo, stepName: '04-boas-praticas-fechamento',
    });
    expect(resp4).toContain('solo muito úmido');
    expect(resp4).toContain('plantio direto');
    expect(resp4).toContain('matéria orgânica');
    expect(resp4).toContain('tráfego controlado');
    expect(validateClosing(resp4)).toBe(true);
  });

  test('caminho 2: usuario nao sabe identificar — teste simples', async ({ page }, testInfo) => {
    await mockChatSequence(page, [
      {
        content: `Qual a cultura da área e percebe solo duro ou dificuldade das plantas?`,
      },
      {
        content: `Sem problema. De forma prática:

Principais sinais de compactação:
• Solo duro ao toque
• Água não infiltra
• Raiz superficial
• Plantas fracas ou desuniformes

Teste simples:
Tente inserir uma faca ou ferro no solo:
• Se entrar com dificuldade → pode ter compactação

Se quiser, posso te orientar como fazer uma avaliação mais precisa.

Deseja continuar o atendimento com um profissional?`,
      },
    ]);

    await page.goto('/');

    // Inicio via botao — realista
    await clickQuickOption(page, '4 - Compactação', {
      testInfo, stepName: '01-abertura',
    });
    const resp = await sendMessage(page, 'Não sei identificar direito.', {
      testInfo, stepName: '02-nao-identifica-teste-simples',
    });

    expect(resp).toContain('Solo duro ao toque');
    expect(resp).toContain('Água não infiltra');
    expect(resp).toContain('Raiz superficial');
    expect(resp).toContain('faca ou ferro');
    expect(validateClosing(resp)).toBe(true);
  });

  test('caminho 3: resposta rapida', async ({ page }, testInfo) => {
    await mockChatSequence(page, [
      {
        content: `Qual a cultura e percebe solo duro?`,
      },
      {
        content: `Resposta direta:

Para resolver compactação do solo:
• Quebrar a camada compactada (subsolagem, se necessário)
• Implantar plantas de raiz profunda
• Reduzir tráfego de máquinas
• Manter cobertura vegetal

Sem manejo contínuo, a compactação volta.

Deseja continuar o atendimento com um profissional?`,
      },
    ]);

    await page.goto('/');

    // Inicio via botao
    await clickQuickOption(page, '4 - Compactação', {
      testInfo, stepName: '01-abertura',
    });
    const resp = await sendMessage(page, 'Quero algo rápido: como resolver?', {
      testInfo, stepName: '02-resposta-rapida',
    });

    expect(resp).toContain('subsolagem');
    expect(resp).toContain('raiz profunda');
    expect(resp).toContain('tráfego de máquinas');
    expect(resp).toContain('cobertura vegetal');
    expect(resp).toContain('compactação volta');
    expect(validateClosing(resp)).toBe(true);
  });
});
