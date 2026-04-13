# M1-A2-01: Checklist Dockerfile e Composite Action ops-eslint

| Campo | Valor |
|-------|--------|
| parent_task | A2 |
| micro_id | M1-A2-01 |
| milestone | M1 |
| depends_on | A1 (contexto matriz T1) |
| blocks | M1-A2-02 |
| plan_requirements | `m1-sec4-order-2`, `m1-sec7-A2` |

## Objetivo

Listar os pontos de contacto entre [`.docker/Dockerfile`](../../../../../.docker/Dockerfile), a imagem `malnati-ops-eslint:local` e a Composite Action [`ops-eslint`](../../../../../.github/actions/ops-eslint/action.yml) (`assets/run.sh`, inputs).

## Definition of done

- Checklist verificável (versão Node/eslint na imagem vs pacote; tag; entrada do container) com remissão a [`specs/agent-docker-compose.md`](../../../../../specs/agent-docker-compose.md).

## Paths principais

- `.docker/Dockerfile`
- `.github/actions/ops-eslint/action.yml`
- `.github/actions/ops-eslint/assets/run.sh`

## Remissões normativas

- Contrato de perfis, build manual da imagem ops-eslint e obrigação de manter ESLint da imagem alinhado ao pacote: [`specs/agent-docker-compose.md`](../../../../../specs/agent-docker-compose.md) (secção **Imagem ops-eslint (`.docker/Dockerfile`)** e item 3 em **Obrigações para agentes de IA**).

## Paridade de versões (imagem vs pacote)

| Aspecto | Onde está definido | Valor atual (verificar no repo) |
|--------|---------------------|----------------------------------|
| Base Node | [`.docker/Dockerfile`](../../../../../.docker/Dockerfile) `FROM` | `node:22-bookworm-slim` |
| ESLint na imagem | [`.docker/Dockerfile`](../../../../../.docker/Dockerfile) `npm install -g` | `eslint@9.18.0` (fixo) |
| ESLint no desenvolvimento do plugin | [`packages/eslint-plugin-hardcode-detect/package.json`](../../../../../packages/eslint-plugin-hardcode-detect/package.json) `devDependencies` | `^9.18.0` |
| `peerDependencies` do plugin | mesmo `package.json` | `>=9.0.0` |

- [ ] A versão global instalada na imagem corresponde à faixa esperada pelo pacote e ao comentário do Dockerfile (“ajuste ao bumpar ESLint”).
- [ ] Qualquer bump de ESLint na imagem foi feito em conjunto com o `package.json` do pacote (ver também obrigação 3 em [`specs/agent-docker-compose.md`](../../../../../specs/agent-docker-compose.md)).

## Tag e build da imagem

| Item | Detalhe |
|------|---------|
| Tag padrão | `malnati-ops-eslint:local` — input `image_tag` da action ([`action.yml`](../../../../../.github/actions/ops-eslint/action.yml)) e fallback em [`run.sh`](../../../../../.github/actions/ops-eslint/assets/run.sh) (`IMAGE_TAG`). |
| Dockerfile | `-f .docker/Dockerfile` |
| Contexto de build | Raiz do repositório (`.`); o script usa `"$repo_root"` como contexto. |

Comando alinhado ao spec (executar na raiz do clone):

```bash
docker build -t malnati-ops-eslint:local -f .docker/Dockerfile .
```

- [ ] O build usa contexto na raiz e o mesmo `-f .docker/Dockerfile` que [`run.sh`](../../../../../.github/actions/ops-eslint/assets/run.sh) (quando `build_image` / `--build-image` é verdadeiro).
- [ ] A tag usada no `docker run` coincide com a tag construída (por defeito `malnati-ops-eslint:local`).

## Entrada do container

| Item | Detalhe |
|------|---------|
| `ENTRYPOINT` | `eslint` ([`.docker/Dockerfile`](../../../../../.docker/Dockerfile)). |
| Argumentos após a imagem | Passados pelo [`run.sh`](../../../../../.github/actions/ops-eslint/assets/run.sh): `--format`, `--output-file`, opcionalmente `--fix`, `--max-warnings`, e os alvos de lint. |
| Flat config | `ESLINT_USE_FLAT_CONFIG=true` no `ENV` da imagem e reposto no `docker run` (`-e`) pelo script. |

- [ ] O processo PID 1 efetivo no container é o binário `eslint` com os argumentos construídos em `run.sh` (não um shell como entrypoint).
- [ ] `ESLINT_USE_FLAT_CONFIG` está coerente entre Dockerfile e `docker run`.

## Mapa: inputs da Composite Action → ambiente → `run.sh`

Cada input em [`action.yml`](../../../../../.github/actions/ops-eslint/action.yml) exporta-se como `INPUT_<NOME_EM_MAIÚSCULAS_COM_UNDERSCORES>` e é lido no início de [`run.sh`](../../../../../.github/actions/ops-eslint/assets/run.sh).

| Input (`inputs.*`) | Variável de ambiente | Efeito principal no script |
|--------------------|----------------------|----------------------------|
| `path` | `INPUT_PATH` | Directório a analisar; montagem e `WORKDIR` dentro do container (`/workspace` ou `/workspace/<path>`). |
| `eslint_args` | `INPUT_ESLINT_ARGS` | Tokenização em alvos/flags do ESLint (shlex-like via palavras). |
| `fix` | `INPUT_FIX` | Acrescenta `--fix` ao ESLint. |
| `max_warnings` | `INPUT_MAX_WARNINGS` | Se ≠ `-1`, passa `--max-warnings`. |
| `report_dir` | `INPUT_REPORT_DIR` | Subdirectório (relativo ao path) para o relatório. |
| `report_file` | `INPUT_REPORT_FILE` | Nome do ficheiro de relatório. |
| `report_formatter` | `INPUT_REPORT_FORMATTER` | `--format` do ESLint e parsing JSON opcional para contagens. |
| `build_image` | `INPUT_BUILD_IMAGE` | Se `true`, executa `docker build` antes do `docker run`. |
| `image_tag` | `INPUT_IMAGE_TAG` | Tag da imagem em build e run. |
| `fail_on_error` | `INPUT_FAIL_ON_ERROR` | Propaga ou não o código de saída do ESLint. |

**Outputs** (`report_path`, `error_count`, `warning_count`, `status`, `exit_code`) são escritos em `GITHUB_OUTPUT` pelo mesmo script quando disponível.

- [ ] Cada input necessário para o teu cenário está documentado na tabela acima e corresponde ao `action.yml` atual.

## Verificação rápida (após build da imagem)

Sem substituir o fluxo reprodutível completo (micro **M1-A2-02**), podes confirmar versões:

```bash
docker run --rm malnati-ops-eslint:local --version
docker run --rm malnati-ops-eslint:local node -e "console.log(process.version)"
```

- [ ] A versão do ESLint no container é a esperada para a linha `npm install -g` do Dockerfile.
- [ ] A versão major do Node no container corresponde à da imagem base (`node:22-…`).

## Checklist resumido

- [ ] Node base e ESLint global vs [`packages/eslint-plugin-hardcode-detect/package.json`](../../../../../packages/eslint-plugin-hardcode-detect/package.json) — coerentes.
- [ ] Tag `malnati-ops-eslint:local` e comando de build — alinhados a [`specs/agent-docker-compose.md`](../../../../../specs/agent-docker-compose.md).
- [ ] Entrada do container — `eslint` + args do `run.sh`; flat config ativa.
- [ ] Inputs da action — mapeados para `run.sh` conforme tabela.
