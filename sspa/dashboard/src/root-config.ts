// sspa/dashboard/src/root-config.ts
import { registerApplication, start } from 'single-spa';
import type { LifeCycles } from 'single-spa';
import {
  applyRuntimeAuthFromConfig,
  registerAuthModule,
  logout,
  getSession,
  getToken,
  getUser,
  completeLogin,
  hydrateAuthFromIndexedDb,
} from './auth-service';

export type StaticApplication = {
  name: string;
  module: string;
  route: string;
  title: string;
  description: string;
  importUrl: string;
  mfeKey: keyof RuntimeMfeUrls;
};

declare const System: {
  import: (moduleName: string) => Promise<LifeCycles<{}>>;
};

const IMPORT_MAP_SCRIPT_ID = 'sspa-static-import-map';
const SYSTEMJS_IMPORTMAP_TYPE = 'systemjs-importmap';
const DESIGN_SYSTEM_MODULE = '@mfe/design-system';
const API_MODULE = '@mfe/api';
const AUTH_MODULE = '@mfe/auth';
const RUNTIME_CONFIG_ENDPOINT = '/runtime-config';
const RUNTIME_CONFIG_KEY = '__RUNTIME_CONFIG__';
const AUTH_LOGIN_URL_CONFIG_KEY = 'authLoginUrl';
const POST_LOGIN_REDIRECT_PATH = '/';

type RuntimeMfeUrls = {
  account: string;
  authtorization: string;
  api: string;
  config: string;
  designSystem: string;
  key: string;
  login: string;
  profile: string;
  rating: string;
  usage: string;
};

type RuntimeConfig = {
  authLoginUrl: string;
  authApiLoginUrl: string;
  bootstrapToken?: string | null;
  mfeUrls?: Partial<RuntimeMfeUrls>;
  bootstrapUser?: {
    email: string;
    name?: string;
    picture?: string;
    sub: string;
    permissions?: string[];
  };
  features?: {
    bypassApiKey?: boolean;
  };
};

type LoginMountPayload = {
  jwt?: string;
  token?: string;
  expiresIn?: string | number;
  profile?: {
    email: string;
    name?: string;
    picture?: string;
  };
};

type LoginMountProps = {
  auth?: {
    completeLogin: typeof completeLogin;
  };
  mode: 'embedded';
  onSuccess: (payload: LoginMountPayload) => void;
  runtimeConfig?: RuntimeConfig;
};

type AccountMountProps = {
  auth: {
    logout: typeof logout;
    getSession: typeof getSession;
    getToken: typeof getToken;
    getUser: typeof getUser;
  };
  mode: 'embedded';
  title: string;
  showTitle: boolean;
};

type RatingMountProps = {
  mode: 'embedded';
  title: string;
  showTitle: boolean;
};

type UsageMountProps = {
  mode: 'embedded';
  title: string;
  showTitle: boolean;
};

type AuthtorizationMountProps = {
  mode: 'embedded';
  title: string;
  showTitle: boolean;
  onRulesChange?: (rules: unknown[]) => void;
};

type ProfileMountProps = {
  auth: {
    logout: typeof logout;
    getSession: typeof getSession;
    getToken: typeof getToken;
    getUser: typeof getUser;
  };
  mode: 'embedded';
  title: string;
  showTitle: boolean;
};

const STATIC_APPLICATIONS: StaticApplication[] = [
  {
    name: '@mfe/account',
    module: '@mfe/account',
    route: '/account',
    title: 'Account',
    description: 'API Account + MFE',
    importUrl: '/mfe/account/spa.js',
    mfeKey: 'account',
  },
  {
    name: '@mfe/authtorization',
    module: '@mfe/authtorization',
    route: '/authtorization',
    title: 'Authtorization',
    description: 'API Authorization + MFE',
    importUrl: '/mfe/authtorization/spa.js',
    mfeKey: 'authtorization',
  },
  {
    name: '@mfe/config',
    module: '@mfe/config',
    route: '/config',
    title: 'Config',
    description: 'Runtime config CRUD',
    importUrl: '/mfe/config/spa.js',
    mfeKey: 'config',
  },
  {
    name: '@mfe/key',
    module: '@mfe/key',
    route: '/key',
    title: 'Key',
    description: 'API Key + MFE',
    importUrl: '/mfe/key/spa.js',
    mfeKey: 'key',
  },
  {
    name: '@mfe/login',
    module: '@mfe/login',
    route: '/login',
    title: 'Login',
    description: 'API Login + MFE',
    importUrl: '/api/login/mfe-app/spa.js',
    mfeKey: 'login',
  },
  {
    name: '@mfe/rating',
    module: '@mfe/rating',
    route: '/rating',
    title: 'Rating',
    description: 'API Rating + MFE',
    importUrl: '/mfe/rating/spa.js',
    mfeKey: 'rating',
  },
  {
    name: '@mfe/usage',
    module: '@mfe/usage',
    route: '/usage',
    title: 'Usage',
    description: 'API Usage + MFE',
    importUrl: '/mfe/usage/spa.js',
    mfeKey: 'usage',
  },
  {
    name: '@mfe/profile',
    module: '@mfe/profile',
    route: '/profile',
    title: 'Profile',
    description: 'User Profile + Preferences',
    importUrl: '/mfe/profile/spa.js',
    mfeKey: 'profile',
  },
];

export function getStaticApplications(): StaticApplication[] {
  return STATIC_APPLICATIONS;
}

export function isKnownRoute(pathname: string): boolean {
  if (pathname === '/') {
    return true;
  }

  return STATIC_APPLICATIONS.some((application) => pathname.startsWith(application.route));
}

function resolveRuntimeMfeUrl(runtimeConfig: RuntimeConfig | null, key: keyof RuntimeMfeUrls, fallback: string): string {
  const runtimeUrl = runtimeConfig?.mfeUrls?.[key];
  return typeof runtimeUrl === 'string' && runtimeUrl.length > 0 ? runtimeUrl : fallback;
}

function buildImportMap(runtimeConfig: RuntimeConfig | null): { imports: Record<string, string> } {
  const imports: Record<string, string> = {
    react: 'https://unpkg.com/react@18.2.0/umd/react.production.min.js',
    'react-dom': 'https://unpkg.com/react-dom@18.2.0/umd/react-dom.production.min.js',
    'react-dom/client': 'https://unpkg.com/react-dom@18.2.0/umd/react-dom.production.min.js',
    'single-spa': 'https://cdn.jsdelivr.net/npm/single-spa@5.9.4/lib/system/single-spa.min.js',
    'react-router-dom': 'https://cdn.jsdelivr.net/npm/react-router-dom@6.20.0/dist/umd/react-router-dom.production.min.js',
    axios: 'https://cdn.jsdelivr.net/npm/axios@1.6.2/dist/axios.min.js',
  };

  imports[AUTH_MODULE] = '/assets/auth-service.js'; // Placeholder to allow bare specifier
  STATIC_APPLICATIONS.forEach((application) => {
    imports[application.module] = resolveRuntimeMfeUrl(runtimeConfig, application.mfeKey, application.importUrl);
  });
  imports[DESIGN_SYSTEM_MODULE] = resolveRuntimeMfeUrl(runtimeConfig, 'designSystem', '/mfe/design-system/spa.js');
  imports[API_MODULE] = resolveRuntimeMfeUrl(runtimeConfig, 'api', '/mfe/api/spa.js');

  return { imports };
}

function ensureStaticImportMap(runtimeConfig: RuntimeConfig | null): void {
  const existingScript = document.getElementById(IMPORT_MAP_SCRIPT_ID);
  if (existingScript) {
    existingScript.textContent = JSON.stringify(buildImportMap(runtimeConfig));
    return;
  }

  const importMapScript = document.createElement('script');
  importMapScript.id = IMPORT_MAP_SCRIPT_ID;
  importMapScript.type = SYSTEMJS_IMPORTMAP_TYPE;
  importMapScript.textContent = JSON.stringify(buildImportMap(runtimeConfig));
  document.head.appendChild(importMapScript);
}

function resolveRuntimeConfig(input: unknown): RuntimeConfig {
  if (
    typeof input === 'object' &&
    input !== null &&
    typeof (input as { authLoginUrl?: unknown }).authLoginUrl === 'string' &&
    (input as { authLoginUrl: string }).authLoginUrl.length > 0
  ) {
    return input as RuntimeConfig;
  }

  throw new Error(`Missing runtime config key: ${AUTH_LOGIN_URL_CONFIG_KEY}`);
}

function renderBootstrapError(message: string): void {
  const root = document.getElementById('root');
  if (!root) {
    return;
  }

  root.innerHTML = `
    <section style="padding: 24px; font-family: sans-serif;">
      <h1>Runtime config error</h1>
      <p>${message}</p>
    </section>
  `;
}

async function loadRuntimeConfig(): Promise<RuntimeConfig> {
  const response = await window.fetch(RUNTIME_CONFIG_ENDPOINT);
  if (!response.ok) {
    throw new Error(`Runtime config request failed with status ${response.status}`);
  }

  const runtimeConfig = resolveRuntimeConfig(await response.json());
  (window as unknown as Record<string, RuntimeConfig | undefined>)[RUNTIME_CONFIG_KEY] = runtimeConfig;
  applyRuntimeAuthFromConfig(runtimeConfig);
  return runtimeConfig;
}

let started = false;

export async function setupDynamicApplications(): Promise<void> {
  let runtimeConfig: RuntimeConfig;
  try {
    runtimeConfig = await loadRuntimeConfig();
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown runtime config error';
    console.error('[sspa/dashboard] runtime bootstrap failed', error);
    renderBootstrapError(message);
    return;
  }

  registerAuthModule();
  await hydrateAuthFromIndexedDb();
  ensureStaticImportMap(runtimeConfig);
  try {
    await System.import(DESIGN_SYSTEM_MODULE);
    await System.import(API_MODULE);
  } catch (error) {
    console.warn('[sspa/dashboard] failed to preload shared modules', error);
  }

  const authProps = {
    auth: {
      logout,
      getSession,
      getToken,
      getUser,
    },
  };

  const isLoginRoute = window.location.pathname.startsWith('/login');
  const hasToken = Boolean(getToken());
  if (isLoginRoute && hasToken) {
    window.location.assign(POST_LOGIN_REDIRECT_PATH);
    return;
  }

  if (!isLoginRoute && !hasToken) {
    window.location.assign('/login');
    return;
  }

  STATIC_APPLICATIONS.forEach((application) => {
    const customProps =
      application.name === '@mfe/login'
        ? {
          ...authProps,
          auth: {
            completeLogin,
          },
          mode: 'embedded' as const,
          runtimeConfig: runtimeConfig ?? undefined,
          onSuccess: (_payload: LoginMountPayload) => {
            window.location.assign(POST_LOGIN_REDIRECT_PATH);
          },
        } satisfies LoginMountProps
        : application.name === '@mfe/account'
          ? {
              ...authProps,
              mode: 'embedded' as const,
              title: 'Accounts',
              showTitle: false,
            } satisfies AccountMountProps
          : application.name === '@mfe/usage'
            ? {
                mode: 'embedded' as const,
                title: 'Usage',
                showTitle: false,
              } satisfies UsageMountProps
          : application.name === '@mfe/authtorization'
            ? {
                mode: 'embedded' as const,
                title: 'Authorization',
                showTitle: false,
                onRulesChange: () => undefined,
              } satisfies AuthtorizationMountProps
          : application.name === '@mfe/rating'
            ? {
                mode: 'embedded' as const,
                title: 'Ratings',
                showTitle: false,
              } satisfies RatingMountProps
            : application.name === '@mfe/profile'
              ? {
                  ...authProps,
                  mode: 'embedded' as const,
                  title: 'Profile',
                  showTitle: false,
                } satisfies ProfileMountProps
          : authProps;

    registerApplication({
      name: application.name,
      app: () => System.import(application.module || application.name),
      activeWhen: (location) =>
        application.name === '@mfe/account'
          ? location.pathname === '/' || location.pathname.startsWith(application.route)
          : application.name === '@mfe/rating'
            ? location.pathname.startsWith(application.route)
          : location.pathname.startsWith(application.route),
      customProps,
    });
  });

  if (!started) {
    start();
    started = true;
  }
}
