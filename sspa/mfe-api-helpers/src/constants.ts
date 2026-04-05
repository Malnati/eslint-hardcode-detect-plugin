// sspa/mfe-api-helpers/src/constants.ts

const RUNTIME_CONFIG_KEY = '__RUNTIME_CONFIG__';

interface RuntimeConfig {
  apiBase: string;
}

const DEFAULT_RUNTIME_CONFIG: RuntimeConfig = {
  apiBase: '/api',
};

function getRuntimeConfig(): RuntimeConfig {
  const config = (window as unknown as Record<string, RuntimeConfig | undefined>)[RUNTIME_CONFIG_KEY];
  return config ?? DEFAULT_RUNTIME_CONFIG;
}

export function getApiUrl(service: string): string {
  const { apiBase } = getRuntimeConfig();
  return `${apiBase}/${service}`;
}

export const API_URLS = {
  account: getApiUrl('account'),
  key: getApiUrl('key'),
  rating: getApiUrl('rating'),
  usage: getApiUrl('usage'),
  login: getApiUrl('login'),
};
