/**
 * Catálogo de mensagens e códigos fixos para a massa e2e (contagens documentadas em specs/e2e-fixture-nest.md).
 */
export const CATALOG_DOMAIN = 'fixture-hardcodes';

export const MESSAGE_CODES = {
  ITEM_CREATED: 'MSG-ITEM-CREATED-001',
  ITEM_INVALID: 'MSG-ITEM-INVALID-002',
  RATE_LIMIT: 'MSG-RATE-LIMIT-003',
} as const;

export const HTTP_MESSAGES = {
  badRequest: 'Requisição inválida para o catálogo',
  notFound: 'Recurso não encontrado no catálogo',
  conflict: 'Conflito ao aplicar regra de negócio',
} as const;

export const NUMERIC_DEFAULTS = {
  maxRetries: 3,
  pageSize: 25,
  timeoutMs: 5000,
} as const;
