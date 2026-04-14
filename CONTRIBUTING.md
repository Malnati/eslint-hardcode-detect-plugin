# Contribuindo

Obrigado por considerar uma contribuição para este projeto. O objetivo é manter a colaboração simples para humanos e consistente para automações.

## Como contribuir (fluxo humano)

1. Abra uma issue antes de mudanças grandes:
   - Bug: [`.github/ISSUE_TEMPLATE/bug_report.yml`](.github/ISSUE_TEMPLATE/bug_report.yml)
   - Feature: [`.github/ISSUE_TEMPLATE/feature_request.yml`](.github/ISSUE_TEMPLATE/feature_request.yml)
   - Docs: [`.github/ISSUE_TEMPLATE/docs_improvement.yml`](.github/ISSUE_TEMPLATE/docs_improvement.yml)
2. Faça um fork/branch e implemente mudanças focadas.
3. Garanta validação local:
   - `npm run lint`
   - `npm test`
4. Atualize documentação quando necessário (`README`, `docs/`, `specs/`).
5. Abra o PR usando [`.github/pull_request_template.md`](.github/pull_request_template.md).

## O que torna um PR fácil de revisar

- Reproduzível: inclui contexto, motivação e impacto.
- Pequeno: uma mudança lógica por PR.
- Testável: com evidência clara de lint/teste.
- Coeso com o contrato: ver [`specs/plugin-contract.md`](specs/plugin-contract.md).

## Segurança, suporte e conduta

- Conduta da comunidade: [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md)
- Vulnerabilidades: [`SECURITY.md`](SECURITY.md)
- Suporte e dúvidas: [`SUPPORT.md`](SUPPORT.md)

## Notas para agentes de IA

Contribuições automatizadas também são aceitas, desde que sigam as normas do repositório:

- Governança e sessão: [`specs/agent-ia-governance.md`](specs/agent-ia-governance.md), [`specs/agent-session-workflow.md`](specs/agent-session-workflow.md)
- Hierarquia normativa: [`AGENTS.md`](AGENTS.md)
- Clippings oficiais para escopo ESLint/npm: [`specs/agent-reference-clippings.md`](specs/agent-reference-clippings.md), [`reference/Clippings/`](reference/Clippings/)
- Política de documentação: [`docs/documentation-policy.md`](docs/documentation-policy.md)
- Versionamento e commits: [`specs/agent-git-workflow.md`](specs/agent-git-workflow.md)
