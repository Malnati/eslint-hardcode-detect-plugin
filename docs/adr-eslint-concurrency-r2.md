# ADR: paralelismo ESLint vs índice R2 (`no-hardcoded-strings`)

**Estado:** aceite  
**Contexto:** marco M2 — R2 global; tarefa A2 em [`docs/remediation-milestones/tasks/m2-remediation-r2-global/A2-concurrency-adr.md`](remediation-milestones/tasks/m2-remediation-r2-global/A2-concurrency-adr.md).

## Contexto

- Versões recentes do ESLint podem processar ficheiros em **paralelo** (por exemplo opção `concurrency` na API ou CLI), usando **worker threads** com heaps isolados.
- A detecção de duplicados cross-file da regra `no-hardcoded-strings` com `remediationMode: "r2"` usa um **índice em memória** partilhado através de `context.settings.hardcodeDetect` (quando o flat config expõe um objecto mutável comum) ou, em último recurso, um fallback por `cwd` no módulo da regra.

## Decisão

1. **`parallelLintingCompatibility: "documented-limitations"`** (padrão): o comportamento correcto do índice R2 assume **uma única thread** a executar a regra para todos os ficheiros do lote (ou estado partilhado equivalente). Com **lint multithread**, o índice **pode estar incompleto ou vazio entre workers**; a detecção R2 **não é garantida** nesse modo.
2. **Recomendação operacional:** para projectos que dependem de duplicados R2, usar **`concurrency: 1`** (ou desactivar o lint paralelo segundo a documentação da versão ESLint em uso) nas invocações que aplicam esta regra, **ou** aceitar a limitação até existir suporte first-party a estado partilhado entre workers.
3. **`parallelLintingCompatibility: "require-serial"`** (opcional): documenta a intenção de política **estrita** — o consumidor compromete-se a serializar o lint quando a regra R2 estiver activa; a regra **não** altera por si só o motor ESLint.

## Consequências

- A opção `parallelLintingCompatibility` é **documental** no schema; referências nos testes e no contrato: [`specs/plugin-contract.md`](../specs/plugin-contract.md), testes em [`packages/eslint-plugin-hardcode-detect/tests/no-hardcoded-strings-r2.test.mjs`](../packages/eslint-plugin-hardcode-detect/tests/no-hardcoded-strings-r2.test.mjs).
- Evoluções futuras (segunda passagem, ficheiro de índice idempotente) ficam fora deste ADR até novo marco.

## Referências

- Plano macro: [`docs/hardcode-remediation-macro-plan.md`](hardcode-remediation-macro-plan.md)
- Índice técnico: [`docs/architecture-r2-global-index.md`](architecture-r2-global-index.md)
