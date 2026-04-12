# Imagem de tooling para ESLint (Composite Action `.github/actions/ops-eslint`).
# Contexto de build: raiz do repositório (ver `assets/run.sh`).
FROM node:22-bookworm-slim

WORKDIR /workspace

# Versão alinhada ao devDependency `eslint` do pacote do plugin (ajuste ao bumpar ESLint).
RUN npm install -g eslint@9.18.0

ENV ESLINT_USE_FLAT_CONFIG=true

ENTRYPOINT ["eslint"]
