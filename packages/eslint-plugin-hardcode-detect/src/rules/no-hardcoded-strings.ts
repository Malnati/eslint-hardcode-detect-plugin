import type { Rule } from "eslint";

/**
 * Desencoraja literais de string longas demais; alinhado a `specs/plugin-contract.md`.
 */
const rule: Rule.RuleModule = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Desencorajar literais de string hardcoded (exceto strings triviais muito curtas).",
      url: "https://github.com/malnati/eslint-hardcode-detect-plugin/blob/main/specs/plugin-contract.md",
    },
    schema: [],
    messages: {
      hardcoded:
        "Evite string literal hardcoded; prefira constantes ou catálogo de mensagens.",
    },
  },
  create(context) {
    return {
      Literal(node) {
        if (typeof node.value !== "string") {
          return;
        }
        if (node.value.length < 2) {
          return;
        }
        context.report({ node, messageId: "hardcoded" });
      },
    };
  },
};

export default rule;
