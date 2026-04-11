import type { Rule } from "eslint";

/**
 * Regra mínima de demonstração (“Hello World”): um relatório por arquivo na raiz do programa.
 * Desative em projetos reais; use para validar que o plugin está carregado.
 */
const rule: Rule.RuleModule = {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Demonstração mínima: confirma que o plugin está ativo (um aviso por arquivo).",
      url: "https://github.com/malnati/eslint-hardcode-detect-plugin/blob/main/specs/plugin-contract.md",
    },
    schema: [],
    messages: {
      hello:
        "Olá do eslint-plugin-hardcode-detect — o plugin está ligado corretamente.",
    },
  },
  create(context) {
    return {
      Program(node) {
        context.report({ node, messageId: "hello" });
      },
    };
  },
};

export default rule;
