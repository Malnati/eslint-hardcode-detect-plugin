// sspa/mfe-api-helpers/src/external.d.ts

declare module '@mfe/auth' {
  interface UserProfile {
    email: string;
    name?: string;
    picture?: string;
    sub: string;
    permissions?: string[];
  }

  interface AuthSession {
    token: string;
    user: UserProfile;
    expiresAt: string | null;
  }

  interface CompleteLoginPayload {
    token: string;
    user: UserProfile;
    expiresIn?: number | string;
    expiresAt?: string | null;
  }

  interface AuthEvents {
    LOGIN: 'auth:login';
    LOGOUT: 'auth:logout';
    UNAUTHORIZED: 'auth:unauthorized';
  }

  export function login(): Promise<void>;
  export function logout(): void;
  export function notifyUnauthorized(): void;
  export function getSession(): AuthSession | null;
  export function getToken(): string | null;
  export function checkAuth(): Promise<boolean>;
  export function getUser(): UserProfile | null;
  export function hasPermission(permission: string): boolean;
  export function onUnauthorized(handler: () => void): void;
  export function authFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response>;
  export function installFetchInterceptor(): void;
  export function setupAuthEventListeners(): void;
  export function completeLogin(payload: CompleteLoginPayload): Promise<void>;
  export const AUTH_EVENTS: AuthEvents;
}
