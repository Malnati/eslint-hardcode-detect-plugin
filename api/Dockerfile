# mfe/mfe-chatbot/Dockerfile
FROM node:18-alpine AS base

FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY mfe/mfe-chatbot/package.json ./package.json
RUN npm install

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY mfe/mfe-chatbot/ .
RUN rm -rf frontend
RUN npm run build

FROM base AS frontend-deps
WORKDIR /app/frontend
COPY mfe/mfe-chatbot/frontend/package.json ./package.json
RUN npm install

FROM base AS frontend-builder
WORKDIR /app/frontend
COPY --from=frontend-deps /app/frontend/node_modules ./node_modules
COPY mfe/mfe-chatbot/frontend/ .
RUN npm run build
RUN npm run build:standalone

FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
RUN apk add --no-cache curl
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=frontend-builder /app/frontend/dist ./public/mfe
COPY --from=frontend-builder /app/frontend/dist-standalone ./public

USER nestjs

CMD ["node", "dist/main"]
