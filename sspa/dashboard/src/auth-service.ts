// sspa/dashboard/src/auth-service.ts
const MODULE_NAME = '@mfe/auth';
const AUTH_SESSION_STORAGE_KEY = 'SSPA_AUTH_SESSION';
const AUTH_TOKEN_STORAGE_KEY = 'auth_token';
const LEGACY_AUTH_TOKEN_KEY = 'SSPA_AUTH_TOKEN';
const AUTH_USER_STORAGE_KEY = 'auth_user';
const LOGIN_REDIRECT_PATH = '/login';
const RUNTIME_CONFIG_KEY = '__RUNTIME_CONFIG__';
const AUTH_LOGIN_URL_CONFIG_KEY = 'authLoginUrl';
const MODULE_REGISTERED_FLAG = '__SSPA_AUTH_MODULE_REGISTERED__';

const AUTH_IDB_NAME = 'auth_db';
const AUTH_IDB_STORE = 'session';
const AUTH_IDB_RECORD_KEY = 'current';
const AUTH_IDB_VERSION = 1;

const AUTH_EVENTS = {
  LOGIN: 'auth:login',
  LOGOUT: 'auth:logout',
  UNAUTHORIZED: 'auth:unauthorized',
} as const;

type AuthEventType = typeof AUTH_EVENTS[keyof typeof AUTH_EVENTS];
type UnauthorizedHandler = (() => void) | null;
type RuntimeConfig = {
  authLoginUrl?: string;
  features?: {
    bypassApiKey?: boolean;
  };
};

export interface UserProfile {
  email: string;
  name?: string;
  picture?: string;
  sub: string;
  permissions?: string[];
}

export interface AuthSession {
  token: string;
  user: UserProfile;
  expiresAt: string | null;
}

export interface CompleteLoginPayload {
  token: string;
  user: UserProfile;
  expiresIn?: number | string;
  expiresAt?: string | null;
}

type IdbSessionRecord = {
  token: string;
  user: UserProfile;
  expiresAt: string | null;
};

let unauthorizedHandler: UnauthorizedHandler = null;
let fetchInterceptorInstalled = false;
let memorySession: AuthSession | null = null;
let sessionHydrated = false;

function parseStoredUser(rawUser: string | null): UserProfile | null {
  if (!rawUser) {
    return null;
  }

  try {
    return JSON.parse(rawUser) as UserProfile;
  } catch {
    return null;
  }
}

function parseStoredSession(rawSession: string | null): AuthSession | null {
  if (!rawSession) {
    return null;
  }

  try {
    const session = JSON.parse(rawSession) as Partial<AuthSession>;
    if (
      typeof session.token !== 'string' ||
      session.token.length === 0 ||
      typeof session.user !== 'object' ||
      session.user === null ||
      typeof session.user.email !== 'string' ||
      session.user.email.length === 0 ||
      typeof session.user.sub !== 'string' ||
      session.user.sub.length === 0
    ) {
      return null;
    }

    return {
      token: session.token,
      user: session.user,
      expiresAt: typeof session.expiresAt === 'string' && session.expiresAt.length > 0
        ? session.expiresAt
        : null,
    };
  } catch {
    return null;
  }
}

function isSessionExpired(session: AuthSession | null): boolean {
  if (!session?.expiresAt) {
    return false;
  }

  const expiresAt = Date.parse(session.expiresAt);
  if (Number.isNaN(expiresAt)) {
    return false;
  }

  return expiresAt <= Date.now();
}

function clearStoredSession(): void {
  window.localStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
  window.localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
  window.localStorage.removeItem(LEGACY_AUTH_TOKEN_KEY);
  window.localStorage.removeItem(AUTH_USER_STORAGE_KEY);
}

function readLegacySessionFromLocalStorage(): AuthSession | null {
  const parsed = parseStoredSession(window.localStorage.getItem(AUTH_SESSION_STORAGE_KEY));
  if (parsed) {
    return parsed;
  }

  const token = window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY)
    ?? window.localStorage.getItem(LEGACY_AUTH_TOKEN_KEY);
  const user = parseStoredUser(window.localStorage.getItem(AUTH_USER_STORAGE_KEY));
  if (!token || !user) {
    return null;
  }

  return {
    token,
    user,
    expiresAt: null,
  };
}

function openAuthIdb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(AUTH_IDB_NAME, AUTH_IDB_VERSION);
    request.onerror = () => {
      reject(request.error ?? new Error('indexedDB.open failed'));
    };
    request.onsuccess = () => {
      resolve(request.result);
    };
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(AUTH_IDB_STORE)) {
        db.createObjectStore(AUTH_IDB_STORE);
      }
    };
  });
}

async function idbGetSession(): Promise<AuthSession | null> {
  try {
    const db = await openAuthIdb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(AUTH_IDB_STORE, 'readonly');
      const store = tx.objectStore(AUTH_IDB_STORE);
      const getReq = store.get(AUTH_IDB_RECORD_KEY);
      getReq.onsuccess = () => {
        const row = getReq.result as IdbSessionRecord | undefined;
        if (
          !row?.token ||
          typeof row.user?.email !== 'string' ||
          typeof row.user?.sub !== 'string'
        ) {
          resolve(null);
          return;
        }
        resolve({
          token: row.token,
          user: row.user,
          expiresAt: row.expiresAt ?? null,
        });
      };
      getReq.onerror = () => {
        reject(getReq.error);
      };
    });
  } catch {
    return null;
  }
}

async function idbPutSession(session: AuthSession): Promise<void> {
  const db = await openAuthIdb();
  const record: IdbSessionRecord = {
    token: session.token,
    user: session.user,
    expiresAt: session.expiresAt,
  };
  return new Promise((resolve, reject) => {
    const tx = db.transaction(AUTH_IDB_STORE, 'readwrite');
    tx.objectStore(AUTH_IDB_STORE).put(record, AUTH_IDB_RECORD_KEY);
    tx.oncomplete = () => {
      resolve();
    };
    tx.onerror = () => {
      reject(tx.error);
    };
  });
}

async function idbDeleteSession(): Promise<void> {
  try {
    const db = await openAuthIdb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(AUTH_IDB_STORE, 'readwrite');
      tx.objectStore(AUTH_IDB_STORE).delete(AUTH_IDB_RECORD_KEY);
      tx.oncomplete = () => {
        resolve();
      };
      tx.onerror = () => {
        reject(tx.error);
      };
    });
  } catch {
    return;
  }
}

export async function hydrateAuthFromIndexedDb(): Promise<void> {
  if (sessionHydrated) {
    return;
  }

  let session = await idbGetSession();

  if (!session) {
    const legacy = readLegacySessionFromLocalStorage();
    if (legacy && !isSessionExpired(legacy)) {
      await idbPutSession(legacy);
      clearStoredSession();
      session = legacy;
    }
  }

  if (session && isSessionExpired(session)) {
    await idbDeleteSession();
    clearStoredSession();
    memorySession = null;
  } else {
    memorySession = session;
  }

  sessionHydrated = true;
}

function readStoredSession(): AuthSession | null {
  if (!memorySession) {
    return null;
  }

  if (isSessionExpired(memorySession)) {
    memorySession = null;
    clearStoredSession();
    void idbDeleteSession();
    return null;
  }

  return memorySession;
}

function dispatchAuthEvent(eventType: AuthEventType, detail?: unknown): void {
  const event = new CustomEvent(eventType, { detail, bubbles: true });
  window.dispatchEvent(event);
}

function handleStorageChange(event: StorageEvent): void {
  if (
    event.key !== AUTH_SESSION_STORAGE_KEY &&
    event.key !== AUTH_TOKEN_STORAGE_KEY &&
    event.key !== AUTH_USER_STORAGE_KEY
  ) {
    return;
  }

  void (async () => {
    memorySession = await idbGetSession();
    if (memorySession && isSessionExpired(memorySession)) {
      await idbDeleteSession();
      memorySession = null;
    }
    const session = memorySession;
    if (session) {
      dispatchAuthEvent(AUTH_EVENTS.LOGIN, { session });
      return;
    }
    dispatchAuthEvent(AUTH_EVENTS.LOGOUT, { session: null });
  })();
}

export function setupAuthEventListeners(): void {
  window.addEventListener('storage', handleStorageChange);
}

export function getSession(): AuthSession | null {
  return readStoredSession();
}

export function getToken(): string | null {
  return getSession()?.token ?? null;
}

export function getUser(): UserProfile | null {
  return getSession()?.user ?? null;
}

export function hasPermission(permission: string): boolean {
  const user = getUser();
  if (!user || !Array.isArray(user.permissions)) {
    return false;
  }

  return user.permissions.includes(permission);
}

export function onUnauthorized(handler: UnauthorizedHandler): void {
  unauthorizedHandler = typeof handler === 'function' ? handler : null;
}

function getAuthLoginUrlFromRuntimeConfig(): string {
  const runtimeConfig = (
    window as unknown as Record<string, RuntimeConfig | undefined>
  )[RUNTIME_CONFIG_KEY];
  const authLoginUrl = runtimeConfig?.[AUTH_LOGIN_URL_CONFIG_KEY];
  if (typeof authLoginUrl === 'string' && authLoginUrl.length > 0) {
    return authLoginUrl;
  }

  return LOGIN_REDIRECT_PATH;
}

function handleUnauthorized(): void {
  const previousSession = memorySession;
  memorySession = null;
  clearStoredSession();
  void idbDeleteSession();
  dispatchAuthEvent(AUTH_EVENTS.UNAUTHORIZED, { session: previousSession });

  if (unauthorizedHandler) {
    unauthorizedHandler();
    return;
  }

  window.location.assign(getAuthLoginUrlFromRuntimeConfig());
}

export function notifyUnauthorized(): void {
  handleUnauthorized();
}

export function applyRuntimeAuthFromConfig(runtimeConfig: RuntimeConfig): void {
  void runtimeConfig;
}

function parseDurationToMilliseconds(input: string): number | null {
  const normalized = input.trim().toLowerCase();
  const match = /^(\d+)(ms|s|m|h|d)$/.exec(normalized);
  if (!match) {
    return null;
  }

  const value = Number(match[1]);
  const unit = match[2];
  const multipliers: Record<string, number> = {
    ms: 1,
    s: 1000,
    m: 60_000,
    h: 3_600_000,
    d: 86_400_000,
  };
  return value * multipliers[unit];
}

function resolveExpiresAt(input: CompleteLoginPayload): string | null {
  if (typeof input.expiresAt === 'string' && input.expiresAt.length > 0) {
    return input.expiresAt;
  }

  if (typeof input.expiresIn === 'number' && Number.isFinite(input.expiresIn)) {
    return new Date(Date.now() + input.expiresIn * 1000).toISOString();
  }

  if (typeof input.expiresIn === 'string') {
    const milliseconds = parseDurationToMilliseconds(input.expiresIn);
    if (milliseconds !== null) {
      return new Date(Date.now() + milliseconds).toISOString();
    }
  }

  return null;
}

export async function completeLogin(input: CompleteLoginPayload): Promise<void> {
  const session = {
    token: input.token,
    user: input.user,
    expiresAt: resolveExpiresAt(input),
  } satisfies AuthSession;
  memorySession = session;
  clearStoredSession();
  try {
    await idbPutSession(session);
    dispatchAuthEvent(AUTH_EVENTS.LOGIN, { session });
  } catch (err: unknown) {
    console.warn('[MFE-LOGIN] CAUSE: IndexedDB write failed after completeLogin');
    console.warn(`[MFE-LOGIN] TODO: Check browser storage / auth_db quota (${err instanceof Error ? err.message : String(err)})`);
    throw err;
  }
}

export async function login(): Promise<void> {
  window.location.assign(getAuthLoginUrlFromRuntimeConfig());
}

export function logout(): void {
  const previousSession = memorySession;
  memorySession = null;
  clearStoredSession();
  void idbDeleteSession();
  dispatchAuthEvent(AUTH_EVENTS.LOGOUT, { session: previousSession });
  window.location.assign(getAuthLoginUrlFromRuntimeConfig());
}

export async function checkAuth(): Promise<boolean> {
  return Boolean(getToken());
}

function getAuthHeaders(): Record<string, string> {
  const token = getToken();
  if (!token) {
    return {};
  }

  return { Authorization: `Bearer ${token}` };
}

function withAuth(init?: RequestInit): RequestInit {
  const baseHeaders = (init?.headers as Record<string, string> | undefined) ?? {};
  return {
    ...(init ?? {}),
    headers: {
      ...baseHeaders,
      ...getAuthHeaders(),
    },
  };
}

export async function authFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const response = await window.fetch(input, withAuth(init));
  if (response.status === 401) {
    handleUnauthorized();
  }

  return response;
}

export function installFetchInterceptor(): void {
  if (fetchInterceptorInstalled) {
    return;
  }

  const originalFetch = window.fetch.bind(window);
  window.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const response = await originalFetch(input, withAuth(init));
    if (response.status === 401) {
      handleUnauthorized();
    }

    return response;
  };

  fetchInterceptorInstalled = true;
}

type AuthServicePublicApi = {
  login: typeof login;
  logout: typeof logout;
  notifyUnauthorized: typeof notifyUnauthorized;
  getSession: typeof getSession;
  getToken: typeof getToken;
  checkAuth: typeof checkAuth;
  getUser: typeof getUser;
  hasPermission: typeof hasPermission;
  onUnauthorized: typeof onUnauthorized;
  authFetch: typeof authFetch;
  installFetchInterceptor: typeof installFetchInterceptor;
  completeLogin: typeof completeLogin;
  setupAuthEventListeners: typeof setupAuthEventListeners;
  AUTH_EVENTS: typeof AUTH_EVENTS;
};

type SystemRegistry = {
  set: (name: string, module: unknown) => void;
  newModule: (module: unknown) => unknown;
};

function getSystemRegistry(): SystemRegistry | null {
  const value = (window as unknown as { System?: Partial<SystemRegistry> }).System;
  if (!value || typeof value.set !== 'function' || typeof value.newModule !== 'function') {
    return null;
  }

  return value as SystemRegistry;
}

export function registerAuthModule(): void {
  const marker = window as unknown as Record<string, boolean>;
  if (marker[MODULE_REGISTERED_FLAG]) {
    return;
  }

  const system = getSystemRegistry();
  if (!system) {
    return;
  }

  const api: AuthServicePublicApi = {
    login,
    logout,
    notifyUnauthorized,
    getSession,
    getToken,
    checkAuth,
    getUser,
    hasPermission,
    onUnauthorized,
    authFetch,
    installFetchInterceptor,
    completeLogin,
    setupAuthEventListeners,
    AUTH_EVENTS,
  };

  system.set(MODULE_NAME, system.newModule(api));
  marker[MODULE_REGISTERED_FLAG] = true;
}
