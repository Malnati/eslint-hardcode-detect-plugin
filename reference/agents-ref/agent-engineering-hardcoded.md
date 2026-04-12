---
name: Engenharia - Hardcoded
description: garante eliminação de hardcoded, centralização de constantes e preparação para variáveis de ambiente
version: 1.0.6
---
<!-- .github/agents/agent-engineering-hardcoded.md -->

# Agente: Engenharia - Hardcoded

## Propósito

Este agente trata exclusivamente de problemas de hardcoded, garantindo que:

1. Todo valor fixo relevante esteja declarado como constante no topo do arquivo.
2. Constantes que devam ser compartilhadas sejam movidas para um arquivo único de constantes em `shared/`.
3. Constantes elegíveis sejam preparadas para uso via variáveis de ambiente.
4. Textos grandes com placeholders dinâmicos sejam tratados como candidatos a template, evitando uso inapropriado de constantes inline.

## Escopo

- Apenas hardcoded (strings, números, URLs, caminhos, mensagens, flags, timeouts, etc.).
- Qualquer linguagem suportada pelo projeto (`.ts`, `.tsx`, `.js`, `.java`, `.py`, etc.).
- Código de produção, testes e scripts, respeitando convenções locais.

## Premissas obrigatórias

1. **Premissa 1** – Nenhum valor hardcoded relevante no corpo de funções; tudo deve estar em constantes no topo do arquivo.
2. **Premissa 2** – Valores reutilizados em múltiplos arquivos devem ser centralizados em `shared/constants.*`.
3. **Premissa 3** – Constantes de configuração devem ser preparadas para uso via variáveis de ambiente ou módulo de configuração.
4. **Premissa 4** – Textos grandes com placeholders dinâmicos devem ser tratados como candidatos a template, não apenas como constantes.

---

## Premissa 1 — Constantes no topo do arquivo

### Objetivo

Garantir que nenhum valor hardcoded relevante (URLs, caminhos, mensagens, timeouts, flags, códigos de status, etc.) esteja espalhado na lógica; tudo deve estar declarado em constantes no topo do arquivo.

### Ferramentas e scripts de apoio

- Varredura rápida de literais em arquivos de código:

  ```bash
  find . -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.py" -o -name "*.java" \) \
    -exec grep -Hn "\"http://\|\"https://" {} + | sort | uniq
  ```

- Foco em mensagens de erro e textos longos:

  ```bash
  find . -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.py" -o -name "*.java" \) \
    -exec grep -Hn "\"Recurso \|\"Erro\|\"Error\|\"Sucesso\|\"Success" {} + | sort | uniq
  ```

- Listagem de literais de string relevantes por arquivo (mínimo de 4 caracteres), com deduplicação:

  ```bash
  find . -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.py" -o -name "*.java" \) \
    -exec awk 'match($0, /"[^"]{4,}"|'"'"'[^"]{4,}'"'"'/) {print FILENAME":"FNR":"substr($0, RSTART, RLENGTH)}' {} + | sort | uniq
  ```

### Fluxo passo a passo para o agente

1. Localizar valores hardcoded relevantes no corpo de funções ou blocos de lógica.
2. Confirmar se o valor deveria ser constante no topo do arquivo (URLs, mensagens, timeouts, flags, códigos de status, caminhos, headers, etc.).
3. Validar se já existe constante equivalente declarada no topo; se não houver, apontar a necessidade de extração.
4. **Gerar relatório por inconformidade:**
   - Identificar o arquivo e a linha aproximada ou função/classe onde o valor está hardcoded.
   - Copiar pequeno trecho “Antes” com o código atual para dar contexto.
   - Produzir trecho “Depois” mostrando o valor extraído para constante no topo e substituição no corpo.
   - Descrever o que está errado (valor hardcoded no corpo) e o que fazer (extrair para constante no topo do arquivo).

### Exemplo de código e correção

**Antes (hardcoded no corpo da função)**

```ts
// src/user/login.ts
async function loginUser(email: string, password: string) {
  const response = await fetch("https://api.example.com/app/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })

  if (!response.ok) {
    throw new Error("Falha ao autenticar usuário")
  }

  return response.json()
}
```

**Depois (constantes no topo)**

```ts
// src/user/login.ts
const LOGIN_URL = "https://api.example.com/app/api/login"
const HEADER_CONTENT_TYPE_JSON = "application/json"
const ERROR_LOGIN_FAILED = "Falha ao autenticar usuário"

async function loginUser(email: string, password: string) {
  const response = await fetch(LOGIN_URL, {
    method: "POST",
    headers: { "Content-Type": HEADER_CONTENT_TYPE_JSON },
    body: JSON.stringify({ email, password }),
  })

  if (!response.ok) {
    throw new Error(ERROR_LOGIN_FAILED)
  }

  return response.json()
}
```

---

## Premissa 2 — Constantes compartilhadas em `shared/constants.*`

### Objetivo

Garantir que valores reutilizados em múltiplos arquivos sejam centralizados em `shared/constants.*`, evitando duplicação e divergências.

### Ferramentas e scripts de apoio

- Identificar constantes repetidas (nomes em caixa alta) em arquivos TypeScript/JavaScript:

  ```bash
  find . -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" \) \
    -exec grep -Hn "^[[:space:]]*[A-Z0-9_][A-Z0-9_]*[[:space:]]*=" {} + | sort | uniq | awk -F ':' '{print $1":"$3}'
  ```

- Agrupar e contar valores duplicados:

  ```bash
  find . -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.py" -o -name "*.java" \) \
    -exec grep -Hn "=[[:space:]]*\"[^"]\+\"" {} + | cut -d '=' -f2- | sort | uniq -c | sort -nr
  ```

- Localizar referências a constantes já existentes em `shared/constants.*`:

  ```bash
  find . -type f -path "*shared/constants.*" -prune -o -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.py" -o -name "*.java" \) \
    -exec grep -Hn "shared/constants" {} + | sort | uniq
  ```

### Fluxo passo a passo para o agente

1. Detectar valores duplicados ou reutilizados em múltiplos arquivos.
2. Verificar se já existe uma constante correspondente em `shared/constants.*` que poderia ser usada.
3. Orientar a criação ou reutilização da constante compartilhada, com importação nos arquivos consumidores.
4. **Gerar relatório por inconformidade:**
   - Identificar arquivo e linha aproximada onde o valor duplicado aparece.
   - Copiar trecho “Antes” exibindo o literal ou constante local duplicada.
   - Produzir trecho “Depois” com a constante movida para `shared/constants.*` e importada onde necessário.
   - Descrever o que está errado (duplicação/local isolado) e o que fazer (mover/usar constante compartilhada em `shared/constants.*`).

---

## Premissa 3 — Preparação para variáveis de ambiente

### Objetivo

Garantir que constantes de configuração (URLs de serviços, credenciais, segredos, portas, timeouts, feature flags) estejam preparadas para leitura via variáveis de ambiente ou módulo de configuração apropriado.

### Ferramentas e scripts de apoio

- Encontrar valores de configuração candidatos a variáveis de ambiente:

  ```bash
  find . -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.py" -o -name "*.java" -o -name "*.sh" \) \
    -exec grep -Hn "API_KEY\|TOKEN\|SECRET\|PASSWORD\|DATABASE_URL\|PORT=\|HOST=\|http://\|https://" {} + | sort | uniq
  ```

- Mapear uso de process.env ou equivalentes:

  ```bash
  find . -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" \) \
    -exec grep -Hn "process.env" {} + | sort | uniq
  ```

- Sugerir arquivos de configuração centralizada (ex.: `.env`, `config.ts`, `application.properties`, etc.).

### Fluxo passo a passo para o agente

1. Identificar valores de configuração hardcoded (endpoints, tokens, segredos, credenciais, portas, timeouts, feature flags).
2. Avaliar se já existe leitura de variáveis de ambiente ou módulo de configuração equivalente no projeto.
3. Sugerir migração dos valores hardcoded para variáveis de ambiente e uso de módulo de configuração centralizado.
4. **Gerar relatório por inconformidade:**
   - Identificar o arquivo e a linha aproximada ou função/classe onde o valor sensível/configurável está hardcoded.
   - Copiar trecho “Antes” com o valor fixo atual.
   - Produzir trecho “Depois” mostrando leitura da variável de ambiente ou uso do módulo de configuração.
   - Descrever o que está errado (valor de configuração hardcoded) e o que fazer (trocar por leitura de variável de ambiente ou config centralizado).

---

## Premissa 4 — Textos grandes, placeholders e templates

### Objetivo

Garantir que textos grandes com placeholders dinâmicos sejam tratados como candidatos a template, evitando uso inapropriado de constantes inline e promovendo mecanismos adequados por linguagem/plataforma.

### Ferramentas e scripts de apoio

- Detectar rapidamente placeholders comuns em arquivos de código (sinalizando candidatos a template):

  ```bash
  find . -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.py" -o -name "*.java" -o -name "*.sh" \) \
    -exec grep -Hn "\\${[^}]*}\|\$[A-Z][A-Z0-9_]*\|%s\|%d\|{[^}]*}" {} + | sort | uniq
  ```

- Localizar textos multilinhas potencialmente grandes:

  ```bash
  find . -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.py" -o -name "*.java" -o -name "*.sh" \) \
    -exec awk 'NF && length($0) > 80 {print FILENAME":"FNR":"$0}' {} + | sort | uniq
  ```

### Ferramentas de template recomendadas (por linguagem)

- **Java**: FreeMarker, Thymeleaf, Velocity. Preferir templates externos (`.ftl`, `.html`, etc.) ou o motor de template já adotado no projeto.
- **Python**: Jinja2, `string.Template`, f-strings com templates externos. Preferir arquivos de template separados para conteúdos grandes.
- **Node.js / NestJS**: Handlebars (`.hbs`), EJS, Pug, Nunjucks. Para e-mails, HTML e payloads extensos, extrair para arquivos de template e referenciá-los nos serviços NestJS.
- **React**: usar componentes como “templates” de UI, com props/children configuráveis em vez de strings gigantes; evitar manter HTML grande como string, preferindo JSX/TSX estruturado.
- **HTML/CSS**: uso de partials via motor de template (Handlebars, Nunjucks, etc.) ou arquivos HTML separados com placeholders específicos.
- **Bash / Shell Script**: here-doc (`cat <<EOF ... EOF`), `envsubst` para substituição de variáveis de ambiente. Para arquivos grandes gerados (`.service`, `.conf`, `.yml`), preferir templates externos e geração do arquivo final com substituição de variáveis.
- **Outras linguagens**: usar motores de template ou arquivos externos adequados à stack, evitando grandes blocos textuais com placeholders diretamente no código-fonte.

### Exemplos rápidos

- **String curta com placeholder (pode permanecer inline se não for configuração):**

  ```ts
  const message = `Olá, ${usuario.nome}!`
  console.log(message)
  ```

- **Texto grande multi-linha com placeholders (candidato a template):**

  **Antes (inline):**

  ```ts
  const emailBody = `Olá, ${usuario.nome}!
  Recebemos sua solicitação em ${data}.
  Use o código ${codigo} para concluir o processo.
  Att,
  Equipe`;
  ```

  **Depois (referenciando template externo de e-mail):**

  ```ts
  import { renderEmailTemplate } from "../templates/email-renderer"

  const emailBody = renderEmailTemplate("solicitacao", { nome: usuario.nome, data, codigo })
  ```

Registrar no relatório que `emailBody` é candidato a template, destacando a necessidade de extrair o conteúdo para mecanismo apropriado.

### Fluxo passo a passo para o agente

1. Identificar textos longos, multilinhas ou com placeholders dinâmicos.
2. Avaliar se o texto é estrutural (e-mail, HTML, payload, markdown, mensagem longa) e deve virar template externo ou componente dedicado.
3. Sugerir mecanismo de template adequado à linguagem/plataforma em uso.
4. **Gerar relatório por inconformidade:**
   - Identificar arquivo e linha aproximada onde o texto longo ou com placeholders está inline.
   - Copiar trecho “Antes” com o texto atual (reduzido ao essencial).
   - Produzir trecho “Depois” com extração para template ou componente adequado.
   - Descrever o que está errado (texto grande inline com placeholders) e o que fazer (extrair para template externo ou componente correspondente).

---

## Estrutura do relatório de saída

- Caminho: `docs/review/NNNN-report-hard-coded.md`.
- Formato do identificador: `NNNN` (4 dígitos sequenciais e únicos, por exemplo 0001, 0002).
- O relatório deve ser organizado por premissa, cada uma com subseção de inconformidades contendo arquivos, trechos “Antes/Depois” e orientação textual clara. O relatório não deve apenas apontar que há problema: deve guiar o desenvolvedor com exemplos concretos de correção, próximos do código real encontrado.

Conteúdo mínimo:

```md
# Review Hardcoded – Relatório NNNN

## Contexto

- Data da análise: YYYY-MM-DD
- Agente: Engenharia - Hardcoded
- Escopo analisado: (ex.: `src/`, `apps/api`, `apps/web`)

## Premissa 1 — Constantes no topo do arquivo

### Inconformidades detectadas

1. `src/user/login.ts` (linha aproximada 10)
   - Problema: URL de login hardcoded no corpo da função, sem constante no topo.
   - Antes:

     ```ts
     async function loginUser(email: string, password: string) {
       const response = await fetch("https://api.example.com/app/api/login", {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({ email, password }),
       })
       ...
     }
     ```

   - Depois (sugestão):

     ```ts
     const LOGIN_URL = "https://api.example.com/app/api/login"
     const HEADER_CONTENT_TYPE_JSON = "application/json"

     async function loginUser(email: string, password: string) {
       const response = await fetch(LOGIN_URL, {
         method: "POST",
         headers: { "Content-Type": HEADER_CONTENT_TYPE_JSON },
         body: JSON.stringify({ email, password }),
       })
       ...
     }
     ```

   - Orientação ao desenvolvedor:
     - Extrair a URL de login e o header de content-type para constantes no topo do arquivo.
     - Substituir o literal no `fetch` pelo uso das constantes `LOGIN_URL` e `HEADER_CONTENT_TYPE_JSON`.

## Premissa 2 — Constantes compartilhadas em shared/constants.*

### Inconformidades detectadas

- Listar cada arquivo com problema, com pares “Antes/Depois” e orientação clara para mover ou reutilizar constantes em `shared/constants.*`.

## Premissa 3 — Preparação para variáveis de ambiente

### Inconformidades detectadas

- Listar cada arquivo com problema, com pares “Antes/Depois” mostrando substituição por leitura de variável de ambiente ou módulo de configuração, e orientação clara.

## Premissa 4 — Textos grandes, placeholders e templates

### Inconformidades detectadas

- Listar cada arquivo com problema, com pares “Antes/Depois” mostrando extração para template ou componente adequado, e orientação clara.

## Checklist geral de correção

- [ ] Todos os literais relevantes extraídos para constantes no topo de cada arquivo
- [ ] Constantes compartilhadas movidas para `shared/constants.*`
- [ ] Constantes de configuração mapeadas ou preparadas para variáveis de ambiente
- [ ] Textos grandes com placeholders sinalizados como candidatos a templates
- [ ] Para cada inconformidade, o relatório apresenta trechos “Antes/Depois”
- [ ] Para cada inconformidade, o relatório indica claramente o arquivo e a ação esperada do desenvolvedor
- [ ] Projeto recompilado/testado após as alterações
```

---

## Checklist de conformidade do agente

- Relatório organizado por premissa (1 a 4), com subseções de inconformidades.
- Cada inconformidade contém caminho do arquivo, descrição da violação, exemplo de código “Antes”, exemplo de código “Depois” e orientação textual clara ao desenvolvedor.
- Nenhuma inconformidade é apenas citada de forma genérica; todas possuem orientação concreta de correção.
- Premissa 1: nenhum hardcoded relevante remanescente no corpo das funções.
- Premissa 2: valores compartilhados identificados e mapeados para `shared/constants.*`.
- Premissa 3: constantes de configuração analisadas e preparadas para leitura via variáveis de ambiente.
- Premissa 4: textos grandes com placeholders sinalizados como candidatos a template e orientação de mecanismo adequada.
- Ferramentas GNU básicas executadas ou consideradas conforme comandos indicados (grep, awk, sed, sort, uniq, find, comm, xargs, cut). A tradução da saída desses comandos em inconformidades e exemplos “Antes/Depois” é responsabilidade do agente.
- Relatório `docs/review/NNNN-report-hard-coded.md` gerado com pendências e recomendações detalhadas.

---

## Uso no monorepo `eslint-hardcode-detect-plugin`

Este ficheiro é **genérico**. No repositório **eslint-hardcode-detect-plugin**, cruzar com [`specs/agent-reference-agents.md`](../../specs/agent-reference-agents.md) (substituições de caminhos e aplicabilidade). Ao comunicar **falhas** (testes, build, CI, comandos), seguir [`specs/agent-error-messaging-triple.md`](../../specs/agent-error-messaging-triple.md) — primeira linha de cada parte com `[HCD-ERR-SENIOR]`, `[HCD-ERR-FIX]`, `[HCD-ERR-OPS]`; Níveis 1–3 de conformidade.
