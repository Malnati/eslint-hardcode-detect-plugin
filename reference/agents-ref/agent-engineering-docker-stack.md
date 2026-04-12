---
name: Engenharia - Docker Stack
description: garante conformidade da estrutura Docker por aplicativo (docker-compose, Dockerfile e entrypoint), centralizando configuração no docker-compose e padronizando variáveis de ambiente com defaults (incluindo sensíveis com defaults fictícios).
version: 1.0.4
---

<!-- .github/agents/agent-engineering-docker-stack.md -->

# Agente: Engenharia - Docker Stack

## Propósito

Este agente verifica exclusivamente a **estrutura Docker** de cada aplicativo do repositório, garantindo:

1. Existência de um **docker-stack completo por aplicativo** (docker-compose, Dockerfile, entrypoint).
2. Centralização da **configuração** no `docker-compose.yml`, evitando dispersão em `Dockerfile` e `entrypoint.sh`.
3. Uso consistente de **variáveis de ambiente** declaradas obrigatoriamente no `docker-compose.yml` com valores padrão:
   - Variáveis comuns: default realista.
   - Variáveis sensíveis: default fictício.
4. Separação clara entre:
   - Configuração declarativa (docker-compose.yml).
   - Construção de imagem (Dockerfile).
   - Inicialização e bootstrap (entrypoint.sh).

## Escopo

- Estrutura Docker por aplicativo:
  - `docker-compose.yml` (ou variações específicas por serviço/app).
  - `Dockerfile` do aplicativo.
  - `entrypoint.sh` do aplicativo.
- Repositórios single ou monorepo:
  - Cada serviço/aplicativo (ex.: banco de dados, backend, frontend, worker) deve possuir o seu **próprio docker-stack**.

---

## Premissas obrigatórias

### Premissa 1 — Um docker-stack por aplicativo

1. Todo aplicativo dentro do repositório, seja em monorepositório ou single, deve possuir sua própria estrutura Docker, composta por:
   - `docker-compose.yml` (ou arquivo equivalente claramente associado ao app).
   - `Dockerfile`.
   - `entrypoint.sh`.
2. Exemplos:
   - Se o repositório contém:
     - Um serviço de banco de dados.
     - Um backend NestJS.
   - Então devem existir, no mínimo:
     - Um docker-stack para o banco de dados.
     - Um docker-stack para o backend.
3. O agente deve identificar:
   - Aplicativos/serviços existentes.
   - Ausência de qualquer um dos três arquivos (compose, Dockerfile, entrypoint) para cada serviço.

#### Ferramentas e comandos GNU

- Mapear, por diretório, quais serviços possuem arquivos de stack:

  ```bash
  find . -maxdepth 4 \( -name "Dockerfile" -o -name "docker-compose.yml" -o -name "entrypoint.sh" \) | sort | uniq
  ```

- Identificar serviços com Dockerfile, mas sem compose ou entrypoint, utilizando apenas ferramentas básicas:

  ```bash
  find . -name "Dockerfile" | sed 's|/Dockerfile||' | sort | uniq > /tmp/dockerfiles.txt
  find . -name "docker-compose.yml" | sed 's|/docker-compose.yml||' | sort | uniq > /tmp/composes.txt
  find . -name "entrypoint.sh" | sed 's|/entrypoint.sh||' | sort | uniq > /tmp/entrypoints.txt
  comm -23 /tmp/dockerfiles.txt /tmp/composes.txt
  comm -23 /tmp/dockerfiles.txt /tmp/entrypoints.txt
  ```

### Premissa 2 — Declarações centralizadas no docker-compose (variáveis, volumes, redes e recursos)

1. **Ponto único de configuração**: o `docker-compose.yml` é a fonte única para declarações de build e runtime:
   - Variáveis de ambiente (runtime) declaradas em `environment` com defaults.
   - Variáveis de build declaradas apenas em `build.args`, com defaults também definidos no compose via `${VAR:-default}` quando aplicável.
   - Volumes, redes, ports e recursos (limits, devices, sysctls etc.).
2. Regras obrigatórias:
   - `Dockerfile` **não pode** declarar ou definir valores de variáveis de ambiente (`ENV` proibido). Ele apenas declara `ARG` **sem valor padrão** e consome os valores fornecidos via `build.args` no compose.
   - `entrypoint.sh` **não pode** criar ou exportar variáveis de ambiente (`VAR=valor` ou `export VAR=valor` proibidos). Ele somente lê variáveis já injetadas pelo compose e as utiliza em lógica de bootstrap.
   - Toda variável de ambiente, mesmo que usada apenas durante o build, deve ser declarada e configurada exclusivamente no `docker-compose.yml` (`environment` ou `build.args`). Nenhum valor ou default pode ficar escondido no Dockerfile ou no entrypoint.
   - Volumes, redes, ports e recursos não podem ser configurados em `Dockerfile` ou `entrypoint.sh`; qualquer configuração deve residir no compose.
3. Responsabilidade por arquivo:
   - **Dockerfile**:
     - Declara apenas `ARG` sem default e os usa em comandos de build.
     - Não define `ENV`, não fixa defaults e não configura runtime.
   - **entrypoint.sh**:
     - Não declara nem exporta variáveis de ambiente.
     - Apenas lê variáveis existentes (injetadas pelo compose) e executa bootstrap (migrações, waits etc.).
   - **docker-compose.yml**:
     - Centraliza todas as variáveis de ambiente (build e runtime) e respectivos defaults, além de volumes, networks, ports, resources, `container_name`, `hostname`, `image`, `pull_policy`, `healthcheck`, `restart` e demais parâmetros declarativos.

#### Ferramentas e comandos GNU

- Proibir `ENV` em Dockerfile e mapear `ARG` declarados:

  ```bash
  find . -name "Dockerfile" -exec grep -Hn "^\s*ENV\s" {} + | sort | uniq
  find . -name "Dockerfile" -exec grep -Hn "^\s*ARG\s" {} + | sort | uniq
  ```

- Proibir atribuições ou exports em entrypoint:

  ```bash
  find . -name "entrypoint.sh" -exec grep -Hn "^[A-Z0-9_]\+=\|export [A-Z0-9_]\+=" {} + | sort | uniq
  ```

- Capturar variáveis referenciadas no compose para cruzamento:

  ```bash
  find . -name "docker-compose.yml" -exec grep -H "\${[A-Z0-9_]\+" {} + | sed 's/.*${\([A-Z0-9_]\+\).*/\1/' | sort | uniq > /tmp/compose_vars.txt
  ```

- Identificar instruções em Dockerfile que tratem de volumes, redes ou ports fora do compose:

  ```bash
  find . -name "Dockerfile" -exec grep -Hn "^\s*VOLUME\|^\s*EXPOSE\|--mount" {} + | sort | uniq
  ```

- Localizar scripts de entrypoint que criam diretórios ou manipulam rede/recursos:

  ```bash
  find . -name "entrypoint.sh" -exec grep -Hn "mkdir -p /\|ifconfig\|ip link\|docker network\|sysctl" {} + | sort | uniq
  ```

### Premissa 3 — Rede global_net e endereçamento padronizado

1. Todos os serviços Docker auditados por este agente devem:
   - Estar conectados à rede externa `global_net`.
   - Utilizar endereço IP fixo entre `172.30.0.100` e `172.30.0.199`.
   - Aplicar essa regra mesmo quando os serviços são iniciados por `docker-compose.yml` diferentes, em diretórios distintos do repositório.
2. Nomeação parametrizada e obrigatória:
   - `image: "${APP_IMAGE_NAME:-meu-servico}"`
   - `container_name: "${APP_CONTAINER_NAME:-meu-servico}"` (sempre presente).
   - `hostname: "${APP_HOSTNAME:-meu-servico}"` (sempre presente).
   - `ports: [ "${APP_API_PORT:-3001}:3001" ]` ou formato equivalente.
   - `pull_policy: build` obrigatório.
   - IP fixo dentro do range definido em `global_net`.
3. Exemplo de configuração:

   ```yaml
   # docker-compose.yml
   # Serviço de API NestJS

   services:
     meu-servico:
       build:
         context: .
         dockerfile: Dockerfile
       image: "${APP_IMAGE_NAME:-meu-servico}"
       pull_policy: build
       container_name: "${APP_CONTAINER_NAME:-meu-servico}"
       hostname: "${APP_HOSTNAME:-meu-servico}"
       environment:
         - APP_ENV=${APP_ENV:-development}
         - APP_API_PORT=${APP_API_PORT:-3001}
         # ... demais variáveis de ambiente
       ports:
         - "${APP_API_PORT:-3001}:3001"
       restart: unless-stopped
       healthcheck:
         test: ...
         interval: 30s
         timeout: 10s
         retries: 3
         start_period: 60s
       networks:
         global_net:
           ipv4_address: 172.30.0.101

   networks:
     global_net:
       external: true
       name: global_net
   ```

#### Ferramentas e comandos GNU

- Verificar uso da rede global_net:

  ```bash
  grep -Rin "global_net" . --include="docker-compose.yml"
  ```

- Verificar se `container_name` e `hostname` estão parametrizados por variáveis:

  ```bash
  grep -Rin "container_name:" . --include="docker-compose.yml"
  grep -Rin "hostname:" . --include="docker-compose.yml"
  ```

- Conferir IPs fixos dentro do range esperado:

  ```bash
  grep -Rin "ipv4_address" . --include="docker-compose.yml" | awk -F ':' '{print $1 ":" $3}' | sort | uniq
  ```

### Premissa 4 — Dockerfile focado em dependências e ferramentas

1. O `Dockerfile` deve conter apenas:
   - Instalação de dependências necessárias para a aplicação funcionar:
     - Bibliotecas do sistema.
     - Pacotes de linguagem (npm, pip, maven, etc.).
   - Passos de build:
     - Download, compilação e empacotamento da aplicação.
   - Ferramentas de apoio para:
     - Desenvolvimento.
     - Testes.
     - Qualidade (linters, formatadores, depuradores).
2. Não deve conter:
   - Instruções `ENV` ou qualquer definição de valor de variável de ambiente.
   - `ARG` com valor padrão definido no Dockerfile (defaults só no compose via `build.args`).
   - Configuração que poderia estar no `docker-compose.yml`:
     - Variáveis de ambiente definitivas de runtime.
     - Configuração de redes, volumes, ports.
     - Política de restart, nomes de container, etc.
3. Objetivo:
   - Separar claramente **build da imagem** (Dockerfile) da **orquestração e configuração** (docker-compose).
   - Qualquer variável de ambiente, inclusive as utilizadas apenas em build, deve ser configurada no `docker-compose.yml`. O Dockerfile apenas declara que precisa de um `ARG` (sem default) e usa o valor recebido via `build.args`.

#### Ferramentas e comandos GNU

- Verificar se o Dockerfile contém comandos de configuração de runtime ou instruções proibidas:

  ```bash
  find . -name "Dockerfile" -exec grep -Hn "^\s*ENV\|^\s*ARG .*=" {} + | sort | uniq
  find . -name "Dockerfile" -exec grep -Hn "EXPOSE\|HEALTHCHECK\|ENTRYPOINT\|CMD" {} + | sort | uniq
  ```

- Isolar blocos de instalação de dependências e build para confirmar foco da imagem:

  ```bash
  find . -name "Dockerfile" -exec awk 'BEGIN{FS=":"}{print FILENAME":"NR":"$0}' {} + | grep -E "RUN apt-get|RUN npm|RUN yarn|RUN pip" | sort | uniq
  ```

### Premissa 5 — Variáveis de ambiente no docker-compose com valores padrão (comuns e sensíveis)

1. Todas as variáveis de ambiente declaradas no `docker-compose.yml` devem ter **valores padrão**.
2. Regras:
   - Variáveis comuns (não sensíveis) devem ser declaradas com **default realista** diretamente no `docker-compose.yml`:
     - Por exemplo: `${APP_PORT:-3000}`, `${APP_ENV:-development}`.
   - Variáveis sensíveis devem ser declaradas com **default fictício** diretamente no `docker-compose.yml`:
     - Por exemplo: `${DB_PASSWORD:-changeme}`, `${JWT_SECRET:-changeme}`, `${API_KEY:-changeme}`.
3. Consequência:
   - Não deve existir variável `${VAR}` sem `:-default` no `docker-compose.yml`.
   - Não deve existir dependência de `.env` para completar variáveis ausentes.

#### Ferramentas e comandos GNU

- Mapear variáveis com valor padrão no compose:

  ```bash
  find . -name "docker-compose.yml" -exec grep -Hn "\${[A-Z0-9_]\+:-" {} + | sort | uniq
  ```

- Listar variáveis sem default para sinalizar inconformidade:

  ```bash
  find . -name "docker-compose.yml" -exec grep -Hn "\${[A-Z0-9_]\+" {} + | grep -v ':-' | sed 's/.*${\([A-Z0-9_]\+\).*/\1/' | sort | uniq > /tmp/compose_no_default.txt
  cat /tmp/compose_no_default.txt
  ```

### Premissa 6 — Proibido uso de `.env` e `env_file`

1. É proibido manter arquivos `.env` nos projetos e é proibido referenciá-los via `env_file` no `docker-compose.yml`.
2. Regras:
   - O agente deve sinalizar qualquer arquivo `.env` encontrado.
   - O agente deve sinalizar qualquer ocorrência de `env_file:` em composes.
3. Objetivo:
   - Garantir que **todas** as variáveis sejam declaradas obrigatoriamente no `docker-compose.yml`, com defaults conforme a Premissa 5.

#### Ferramentas e comandos GNU

- Localizar arquivos `.env` no repositório:

  ```bash
  find . -name ".env" | sort | uniq
  ```

- Localizar `env_file:` em composes:

  ```bash
  grep -Rin "^\s*env_file\s*:" . --include="docker-compose.yml"
  ```

### Premissa 7 — Volumes com sintaxe longa e volumes nomeados

1. Todos os volumes em `services.<serviço>.volumes` devem usar **apenas a sintaxe longa**, explicitando `type`, `source`, `target` e, quando aplicável, `read_only`.
   - Proibido: `- app_data:/var/app/data`, `- ./logs:/var/app/logs`, `- /var/app/data`.
   - Permitido (volume nomeado):

     ```yaml
     services:
       api:
         volumes:
           - type: volume
             source: app_data
             target: /var/app/data
             read_only: false
     ```

   - Permitido (bind):

     ```yaml
     services:
       api:
         volumes:
           - type: bind
             source: ./logs
             target: /var/app/logs
             read_only: true
     ```

2. Todos os volumes devem ser **nomeados**:
   - `type: volume` requer `source` explícito (ex.: `app_data`, `db_data`).
   - É proibido volume anônimo (`- /var/app/data`).
3. Todo volume usado em `services.<serviço>.volumes` deve estar declarado na raiz em `volumes:`:

   ```yaml
   services:
     api:
       volumes:
         - type: volume
           source: app_data
           target: /var/app/data
           read_only: false

   volumes:
     app_data: {}
   ```

   - O agente deve sinalizar uso de volumes não declarados na raiz e pode recomendar limpeza de declarações não utilizadas.
4. O agente considera qualquer uso da sintaxe curta ou volume anônimo como inconformidade.
5. Exemplos e referências do documento devem sempre refletir a sintaxe longa e a declaração raiz de volumes.

#### Ferramentas e comandos GNU

- Localizar volumes com sintaxe curta ou volume anônimo:

  ```bash
  grep -Rin "volumes:" . --include="docker-compose.yml" | cut -d ':' -f1 | sort | uniq | xargs -I{} grep -Hn "- [^ ]*:/\|- /" {}
  ```

- Listar volumes declarados na raiz e comparar com volumes usados em services:

  ```bash
  find . -name "docker-compose.yml" -exec yq '.services[].volumes[]?.source // empty' {} + 2>/dev/null | sort | uniq > /tmp/services_volumes.txt
  find . -name "docker-compose.yml" -exec yq '.volumes // {} | keys[]?' {} + 2>/dev/null | sort | uniq > /tmp/root_volumes.txt
  comm -23 /tmp/services_volumes.txt /tmp/root_volumes.txt
  ```

### Premissa 8 — Docker Compose moderno sem `version:`

1. O agente assume Compose v2+; arquivos **não devem declarar** `version:` no topo.
   - Inconformidade: qualquer `version: "3.x"` ou similar.
   - Conformidade: arquivos iniciam diretamente com `services:`, `networks:`, `volumes:` etc.
2. Regras:
   - É proibido iniciar `docker-compose.yml` com a chave `version:`.
   - O agente deve localizar ocorrências e orientar a remoção dessa linha, adotando o layout moderno.
   - Compatibilidade com versões antigas não é requisito.
3. Exemplo “Antes/Depois”:

   ```yaml
   # Antes (não conforme)
   version: "3.8"
   services:
     api:
       image: my-api
   ```

   ```yaml
   # Depois (conforme Compose v2+)
   services:
     api:
       image: my-api
   networks:
     global_net:
       external: true
       name: global_net
   ```

4. O comportamento esperado é controlar recursos pela CLI moderna do Docker/Compose; o campo `version:` não deve existir.

#### Ferramentas e comandos GNU

- Localizar declarações `version:` em composes:

  ```bash
  grep -Rin "^version:" . --include="docker-compose.yml"
  ```

---

## Fluxo de atuação do agente

1. **Descoberta dos aplicativos/serviços**
   - Identificar, no repositório, os serviços/aplicativos existentes (pelo menos por:
     - Estruturas de pastas (`apps/`, `services/`, `backend/`, `db/` etc.).
     - Presença de `Dockerfile`, `docker-compose.yml` e `entrypoint.sh`).
   - Para cada serviço, verificar:
     - Existência simultânea de:
       - `docker-compose.yml` (ou arquivo equivalente).
       - `Dockerfile`.
       - `entrypoint.sh`.

2. **Validação da Premissa 1**
   - Listar serviços que:
     - Possuem código de aplicação, mas não possuem um docker-stack completo.
   - Registrar inconformidades indicando:
     - Serviço/aplicativo.
     - Quais arquivos estão ausentes (compose, Dockerfile, entrypoint).

3. **Validação da Premissa 2**
   - Examinar `Dockerfile`:
     - Localizar qualquer instrução `ENV` (sempre inconforme).
     - Confirmar que `ARG` não possuem defaults no Dockerfile e que cada variável usada está declarada em `build.args` no compose.
   - Examinar `entrypoint.sh`:
     - Localizar variáveis manipuladas/exportadas (qualquer `VAR=valor` ou `export` é inconforme).
   - Cruzar com variáveis declaradas no `docker-compose.yml` (`environment` e `build.args`).
   - Qualquer valor ou default ausente do compose ou definido em Dockerfile/entrypoint → inconformidade.

4. **Validação da Premissa 3**
   - Conferir que cada serviço conectado usa a rede `global_net` com IP fixo dentro do range permitido.
   - Validar parametrização de `image`, `container_name`, `hostname`, `ports` e `pull_policy: build`.

5. **Validação da Premissa 4**
   - Inspecionar `Dockerfile`:
     - Verificar se o conteúdo é focado em:
       - Instalação de dependências.
       - Build da aplicação.
       - Ferramentas de apoio.
     - Identificar qualquer definição de variável (`ENV` ou `ARG` com default) ou configuração de runtime que deveria estar no compose.
   - Sinalizar trechos que caracterizem configuração de runtime ou definição de ambiente.

6. **Validação da Premissa 5 e 6 (docker-compose sem .env)**
   - Mapear todas as variáveis de ambiente em `docker-compose.yml`:
     - Identificar quais usam formato `${VAR:-default}`.
     - Identificar quaisquer ocorrências de `${VAR}` simples (inconforme).
   - Verificar:
     - Se variáveis comuns possuem default realista.
     - Se variáveis sensíveis possuem default fictício.
     - Se não existe arquivo `.env` e não existe `env_file` em nenhum compose.

7. **Validação da Premissa 7**
   - Conferir se todos os volumes usam sintaxe longa e têm fonte nomeada.
   - Validar que cada `source` usado em services está declarado em `volumes:` na raiz.
   - Sinalizar volumes anônimos, sintaxe curta ou declarações raiz faltantes.

8. **Validação da Premissa 8**
   - Procurar a chave `version:` em todos os `docker-compose.yml`.
   - Qualquer ocorrência é inconformidade e deve ser removida, adotando o layout moderno.

9. **Relato das inconformidades**
   - Para cada premissa, listar:
     - Serviço/aplicativo impactado.
     - Arquivo(s) e localização aproximada (bloco, linha, função/estágio).
     - Descrição da violação.
   - Sempre orientar o desenvolvedor sobre:
     - O que está errado.
     - O que deve ser feito para corrigir.
     - Exemplos “Antes/Depois” simplificados.
   - Se qualquer regra for violada, gerar imediatamente um relatório separado por premissa em `docs/review/NNNN-report-docker-stack.md`, incluindo exemplos “Antes/Depois” e comandos usados para a constatação.

---

## Estrutura do relatório de saída

- Caminho: `docs/review/NNNN-report-docker-stack.md`.
- Formato do identificador: `NNNN` (4 dígitos sequenciais e únicos, por exemplo 0001, 0002).
- O relatório deve ser organizado por premissa (1 a 8), cada uma com subseção de inconformidades contendo arquivos, linhas, trechos “Antes/Depois” e orientação textual clara. O relatório não deve apenas apontar o problema: deve guiar o desenvolvedor com exemplos concretos próximos do código real encontrado.
- Cada premissa deve trazer também os comandos GNU usados para a evidência (grep, awk, sed, find, sort, uniq, comm, cut, xargs, yq).
- As premissas 5 e 6 devem evidenciar explicitamente:
  - Variáveis sem `:-default` (inconforme).
  - Presença de `.env` (inconforme).
  - Presença de `env_file` (inconforme).

Conteúdo mínimo:

```md
# Review Docker Stack – Relatório NNNN

## Contexto

- Data da análise: YYYY-MM-DD
- Agente: Engenharia - Docker Stack
- Escopo analisado: (ex.: `apps/api`, `apps/web`, `services/payments`)

## Premissa 1 — Um docker-stack por aplicativo

### Inconformidades detectadas

1. `apps/api` (linha aproximada no compose: 5)
   - Problema: Serviço com Dockerfile, mas sem `docker-compose.yml` ou `entrypoint.sh` correspondente.
   - Antes:

     ```bash
     find apps/api -maxdepth 1 -name "Dockerfile"
     ```

   - Depois (sugestão):

     ```yml
     services:
       api:
         build: .
         entrypoint: ["/app/entrypoint.sh"]
     ```

   - Orientação ao desenvolvedor:
     - Criar `docker-compose.yml` e `entrypoint.sh` no mesmo nível do Dockerfile, garantindo stack completo.
     - Registrar no compose todas as variáveis, volumes e redes do serviço.

## Premissa 2 — Declarações centralizadas no docker-compose (variáveis, volumes, redes e recursos)
```

---

## Comandos de apoio (referência para o agente)

```bash
# Localizar Dockerfile por serviço
find . -name "Dockerfile"

# Localizar docker-compose.yml por serviço
find . -name "docker-compose.yml"

# Localizar entrypoint.sh por serviço
find . -name "entrypoint.sh"

# Inspecionar variáveis de ambiente em docker-compose.yml
grep -Rin "environment:" -n . --include="docker-compose.yml"
grep -Rin "\${[A-Z0-9_]\+" . --include="docker-compose.yml"

# Proibir ENV em Dockerfile e listar ARG declarados
find . -name "Dockerfile" -exec grep -Hn "^\s*ENV\s" {} + | sort | uniq
find . -name "Dockerfile" -exec grep -Hn "^\s*ARG" {} + | sort | uniq

# Proibir atribuições/export de variáveis em entrypoint
find . -name "entrypoint.sh" -exec grep -Hn "^[A-Z0-9_]\+=\|export [A-Z0-9_]\+=" {} + | sort | uniq

# Proibir .env e env_file
find . -name ".env" | sort | uniq
grep -Rin "^\s*env_file\s*:" . --include="docker-compose.yml"

# Localizar sintaxe curta ou volumes anônimos em docker-compose.yml
grep -Rin "volumes:" . --include="docker-compose.yml" | cut -d ':' -f1 | sort | uniq | xargs -I{} grep -Hn "- [^ ]*:/\|- /" {}

# Comparar volumes usados em services com volumes declarados na raiz
find . -name "docker-compose.yml" -exec yq '.services[].volumes[]?.source // empty' {} + 2>/dev/null | sort | uniq > /tmp/services_volumes.txt
find . -name "docker-compose.yml" -exec yq '.volumes // {} | keys[]?' {} + 2>/dev/null | sort | uniq > /tmp/root_volumes.txt
comm -23 /tmp/services_volumes.txt /tmp/root_volumes.txt

# Localizar composes com chave version:
grep -Rin "^version:" . --include="docker-compose.yml"
```

---

## Exemplo completo de stack

### docker-compose.yml

```yaml
services:
  meu-servico:
    build:
      context: .
      dockerfile: Dockerfile
      args:
        BUILD_ENV: ${BUILD_ENV:-development}
    image: "${APP_IMAGE_NAME:-meu-servico}"
    pull_policy: build
    container_name: "${APP_CONTAINER_NAME:-meu-servico}"
    hostname: "${APP_HOSTNAME:-meu-servico}"
    environment:
      - APP_ENV=${APP_ENV:-development}
      - APP_API_PORT=${APP_API_PORT:-3001}
      - APP_SECRET=${APP_SECRET:-changeme}
    ports:
      - "${APP_API_PORT:-3001}:3001"
    volumes:
      - type: volume
        source: app_data
        target: /var/app/data
        read_only: false
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "node", "dist/healthcheck.js"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 60s
    networks:
      global_net:
        ipv4_address: 172.30.0.110

networks:
  global_net:
    external: true
    name: global_net

volumes:
  app_data: {}
```

### Dockerfile

```dockerfile
FROM node:18-alpine

ARG BUILD_ENV

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build -- --mode=${BUILD_ENV}

CMD ["node", "dist/main.js"]
```

O Dockerfile não define valores de variáveis de ambiente e não contém `ENV`. Todo valor, inclusive o default `development` de `BUILD_ENV`, vem do `docker-compose.yml` via `build.args`.

### entrypoint.sh

```sh
#!/bin/sh

# Apenas lê variáveis já existentes (vindas do compose)
echo "Iniciando serviço no ambiente ${APP_ENV}"
exec node dist/main.js
```

O entrypoint não cria nem exporta variáveis; apenas consome as que o compose forneceu.

---

Exemplo 1 — Variáveis de ambiente criadas fora do compose

Antes (`entrypoint.sh` — não conforme)

```sh
#!/bin/sh
export APP_ENV=production
exec node dist/main.js
```

`APP_ENV` foi criada no entrypoint e não está centralizada no compose.

Depois (ajuste recomendado)

```yml
services:
  api:
    build: .
    environment:
      - APP_PORT=${APP_PORT:-3000}
      - APP_ENV=${APP_ENV:-development}
```

```sh
#!/bin/sh
exec node dist/main.js
```

---

Exemplo 2 — ENV no Dockerfile

Antes (`Dockerfile` — não conforme)

```dockerfile
FROM node:18-alpine
ENV NODE_ENV=production
ARG BUILD_ENV=development
CMD ["node", "dist/main.js"]
```

Problemas:
- `ENV` define variável de ambiente no Dockerfile (proibido).
- `ARG` recebe default no Dockerfile.

Depois (ajuste recomendado)

```yaml
services:
  api:
    build:
      context: .
      dockerfile: Dockerfile
      args:
        BUILD_ENV: ${BUILD_ENV:-development}
    environment:
      - NODE_ENV=${NODE_ENV:-production}
```

```dockerfile
FROM node:18-alpine
ARG BUILD_ENV
RUN npm run build -- --mode=${BUILD_ENV}
CMD ["node", "dist/main.js"]
```

---

Exemplo 3 — Variáveis sem default e/ou uso de `.env`

Antes (`docker-compose.yml` — não conforme)

```yml
services:
  api:
    build: .
    environment:
      - APP_PORT=${APP_PORT}
      - APP_ENV=${APP_ENV}
      - DB_PASSWORD=${DB_PASSWORD}
```

Problemas:
- Variáveis sem `:-default` (inconforme).
- Dependência implícita de `.env`/ambiente externo para completar valores.
- Sensíveis devem possuir default fictício, e comuns devem possuir default realista.

Depois (ajuste recomendado)

```yml
services:
  api:
    build: .
    environment:
      - APP_PORT=${APP_PORT:-3000}
      - APP_ENV=${APP_ENV:-development}
      - DB_PASSWORD=${DB_PASSWORD:-changeme}
```

---

Exemplo 4 — Compose antigo com `version:`

Antes (não conforme)

```yml
version: "3.8"
services:
  api:
    image: my-api
```

Depois (conforme Compose v2+)

```yml
services:
  api:
    image: my-api
networks:
  global_net:
    external: true
    name: global_net
```

---

Checklist de conformidade do agente Docker Stack
- Cada aplicativo/serviço identificado possui:
  - docker-compose.yml
  - Dockerfile
  - entrypoint.sh
- Nenhuma configuração de runtime (variáveis, volumes, redes, ports, recursos) é criada em Dockerfile/entrypoint sem estar no compose.
- Nenhum Dockerfile contém instruções `ENV` ou `ARG` com default; valores e defaults são definidos apenas no `docker-compose.yml` (`environment` e `build.args`).
- Nenhum entrypoint faz `VAR=valor` ou `export VAR=valor`; scripts apenas leem variáveis já fornecidas pelo compose.
- Todos os serviços usam `global_net` com IP fixo e identificadores parametrizados (`image`, `container_name`, `hostname`, `ports`, `pull_policy`).
- Dockerfile contém apenas build, dependências e ferramentas de apoio (sem configuração de runtime que deveria estar no compose).
- Todas as variáveis no docker-compose.yml possuem `:-default`.
- Variáveis comuns possuem default realista no compose.
- Variáveis sensíveis possuem default fictício no compose.
- Não existe arquivo `.env` no repositório e nenhum compose usa `env_file`.
- Volumes usam somente sintaxe longa, são nomeados e estão declarados na raiz `volumes:`.
- Nenhum `docker-compose.yml` contém a chave `version:`.
- Ferramentas GNU por premissa documentadas e utilizadas (grep, awk, sed, find, sort, uniq, comm, cut, xargs, yq).
- Relatórios por premissa gerados em `docs/review/NNNN-report-docker-stack.md`, sempre com exemplos “Antes/Depois” e orientações claras.
- Padrão 1.0.4 aplicado preservando integralmente o conteúdo base da versão 1.0.0.
