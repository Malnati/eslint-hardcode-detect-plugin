// sspa/mfe-chatbot/e2e/specs/04-pragas-doencas.spec.ts
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

test.describe('Script 04 — Pragas e doencas', () => {

  test('fluxo completo: abertura -> sintoma lagarta -> MIP -> complemento -> fechamento', async ({ page }, testInfo) => {
    await mockChatSequence(page, [
      {
        content: `Ótima pergunta!
Dá sim para controlar pragas e doenças com eficiência e menor custo, usando manejo inteligente.

Para te orientar melhor, preciso de 2 informações rápidas:

1. Qual a cultura (ex.: soja, milho, hortaliças)?
2. Você já está com problema na lavoura ou quer prevenção?`,
      },
      {
        content: `Entendi. Vamos agir de forma prática.

Você consegue me dizer:
• Qual o sintoma principal (folha comida, manchas, lagartas, amarelecimento)?
• Se possível, pode enviar uma foto?

Isso ajuda a identificar se é praga ou doença e indicar o melhor manejo.`,
      },
      {
        content: `Perfeito, isso indica ataque de pragas (provavelmente lagartas).

Vou te orientar em 3 passos simples e de baixo custo:

(1) Monitoramento
Antes de qualquer ação, avalie o nível de infestação:
• Está em toda área ou em pontos isolados?
• Muitas lagartas ou poucas?
Isso evita gasto desnecessário.

(2) Controle biológico (baixo custo e sustentável)
Você pode usar:
• Bacillus thuringiensis (Bt)
• Vírus específicos (bioinseticidas)
São mais baratos no longo prazo e preservam inimigos naturais.

(3) Manejo integrado (MIP)
• Rotação de culturas
• Uso de variedades resistentes (quando possível)
• Preservação de inimigos naturais (joaninhas, vespas)

Agroquímico entra apenas se ultrapassar o nível de dano econômico.

A infestação está alta ou ainda no início?`,
      },
      {
        content: `Entendi. Algumas práticas que ajudam muito e reduzem custo:

• Plantio na época correta
• Equilíbrio nutricional (planta bem nutrida resiste mais)
• Uso de cobertura de solo
• Eliminação de plantas doentes (foco inicial)

Prevenção quase sempre custa menos que controle.

Deseja continuar o atendimento com um profissional?`,
      },
    ]);

    await page.goto('/');
    await captureEvidence(page, testInfo, '00-saudacao-inicial');

    // 1) Abertura — usuario clica opcao 2 (pragas e doencas)
    const resp1 = await clickQuickOption(page, '2 - Pragas e doenças', {
      testInfo, stepName: '01-abertura-opcao-2',
    });
    const ctx = validateContextQuestions(resp1);
    expect(ctx.cultura).toBe(true);
    expect(ctx.problema).toBe(true);

    // 2) Coleta — usuario informa cultura e situacao
    const resp2 = await sendMessage(page, 'Soja, já estou com problema.', {
      testInfo, stepName: '02-coleta-soja-problema',
    });
    expect(resp2).toContain('sintoma');
    expect(resp2).toContain('foto');

    // 3) Caminho 1 — usuario descreve lagarta
    const resp3 = await sendMessage(page, 'Tem lagarta comendo as folhas.', {
      testInfo, stepName: '03-lagarta-3-passos',
    });
    expect(resp3).toContain('Monitoramento');
    expect(resp3).toContain('Controle biológico');
    expect(resp3).toContain('Bacillus thuringiensis');
    expect(resp3).toContain('MIP');
    expect(resp3).toContain('Rotação de culturas');
    expect(resp3).toContain('inimigos naturais');
    expect(resp3).toContain('infestação');

    // 4) Complemento tecnico + Fechamento
    const resp4 = await sendMessage(page, 'Está no início ainda.', {
      testInfo, stepName: '04-complemento-fechamento',
    });
    expect(resp4).toContain('Plantio na época correta');
    expect(resp4).toContain('Prevenção');
    expect(validateClosing(resp4)).toBe(true);
  });

  test('caminho 2: usuario nao sabe identificar — solicita foto', async ({ page }, testInfo) => {
    await mockChatSequence(page, [
      {
        content: `Qual a cultura e já está com problema ou quer prevenção?`,
      },
      {
        content: `Você consegue descrever o sintoma ou enviar uma foto?`,
      },
      {
        content: `Sem problema. De forma prática:

Diferença básica:
• Pragas: insetos, lagartas, percevejos (danos visíveis como furos ou sucção)
• Doenças: fungos/bactérias (manchas, mofo, apodrecimento)

Para identificar melhor:
• Observe folhas (frente e verso)
• Veja se há insetos presentes
• Note padrão do dano (localizado ou espalhado)

Se puder enviar uma foto, eu te ajudo a identificar com mais precisão.

Deseja continuar o atendimento com um profissional?`,
      },
    ]);

    await page.goto('/');

    await clickQuickOption(page, '2 - Pragas e doenças', {
      testInfo, stepName: '01-abertura',
    });
    await sendMessage(page, 'Milho, já tenho problema.', {
      testInfo, stepName: '02-coleta',
    });
    const resp = await sendMessage(page, 'Não sei identificar direito.', {
      testInfo, stepName: '03-nao-identifica',
    });

    expect(resp).toContain('Pragas');
    expect(resp).toContain('Doenças');
    expect(resp).toContain('foto');
    expect(resp).toContain('folhas');
    expect(validateClosing(resp)).toBe(true);
  });

  test('caminho 3: resposta rapida e barata', async ({ page }, testInfo) => {
    await mockChatSequence(page, [
      {
        content: `Qual a cultura e está com problema ou quer prevenção?`,
      },
      {
        content: `Resposta direta:

Para controle eficiente e de baixo custo:
• Monitorar antes de agir
• Usar controle biológico (Bt, bioinsumos)
• Fazer manejo integrado (MIP)
• Evitar aplicação desnecessária de agroquímicos

O segredo é agir no momento certo, não mais produto.

Deseja continuar o atendimento com um profissional?`,
      },
    ]);

    await page.goto('/');

    await clickQuickOption(page, '2 - Pragas e doenças', {
      testInfo, stepName: '01-abertura',
    });
    const resp = await sendMessage(page, 'Quero algo simples e barato.', {
      testInfo, stepName: '02-resposta-rapida',
    });

    expect(resp).toContain('Monitorar');
    expect(resp).toContain('controle biológico');
    expect(resp).toContain('MIP');
    expect(resp).toContain('momento certo');
    expect(validateClosing(resp)).toBe(true);
  });

  test('simulacao de envio de foto — chatbot pede foto e usuario menciona envio', async ({ page }, testInfo) => {
    await mockChatSequence(page, [
      {
        content: `Qual a cultura e está com problema?`,
      },
      {
        content: `Entendi. Pode enviar uma foto da planta afetada?
Isso ajuda a identificar se é praga ou doença.`,
      },
      {
        content: `Obrigado pela foto! Analisando a imagem:

Pelos sintomas descritos e a evidência visual, parece ser ataque de lagarta.

Recomendação:
• Monitoramento imediato da área
• Aplicação de Bt (Bacillus thuringiensis) nos focos
• Verificar nível de dano econômico antes de agroquímico

Deseja continuar o atendimento com um profissional?`,
      },
    ]);

    await page.goto('/');

    await clickQuickOption(page, '2 - Pragas e doenças', {
      testInfo, stepName: '01-abertura',
    });
    await sendMessage(page, 'Soja, já estou com problema na lavoura.', {
      testInfo, stepName: '02-coleta',
    });

    // Simula usuario mencionando envio de foto (o chatbot nao recebe arquivo real,
    // mas o fluxo testa a interacao como descrito no Script 04)
    const resp = await sendMessage(page, 'Estou enviando uma foto da folha comida.', {
      testInfo, stepName: '03-envio-foto-resposta',
    });

    expect(resp).toContain('foto');
    expect(resp).toContain('lagarta');
    expect(validateClosing(resp)).toBe(true);
  });
});
