// sspa/dashboard/public/assets/auth-service.js
System.register([], function (exports) {
  return {
    execute: function () {
      const AUTH_SESSION_STORAGE_KEY = 'SSPA_AUTH_SESSION';
      const AUTH_TOKEN_STORAGE_KEY = 'auth_token';
      const LEGACY_AUTH_TOKEN_KEY = 'SSPA_AUTH_TOKEN';
      const AUTH_USER_STORAGE_KEY = 'auth_user';
      const LOGIN_REDIRECT_PATH = '/login';
      const RUNTIME_CONFIG_KEY = '__RUNTIME_CONFIG__';
      const AUTH_LOGIN_URL_CONFIG_KEY = 'authLoginUrl';
      const AUTH_IDB_NAME = 'auth_db';
      const AUTH_IDB_STORE = 'session';
      const AUTH_IDB_RECORD_KEY = 'current';
      const AUTH_IDB_VERSION = 1;
      const AUTH_EVENTS = {
        LOGIN: 'auth:login',
        LOGOUT: 'auth:logout',
        UNAUTHORIZED: 'auth:unauthorized',
      };

      let unauthorizedHandler = null;
      let fetchInterceptorInstalled = false;
      let memorySession = null;
      let sessionHydrated = false;

      function parseStoredJson(rawValue) {
        if (!rawValue) {
          return null;
        }
        try {
          return JSON.parse(rawValue);
        } catch {
          return null;
        }
      }

      function clearStoredSession() {
        localStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
        localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
        localStorage.removeItem(LEGACY_AUTH_TOKEN_KEY);
        localStorage.removeItem(AUTH_USER_STORAGE_KEY);
      }

      function readLegacySessionFromLocalStorage() {
        const raw = localStorage.getItem(AUTH_SESSION_STORAGE_KEY);
        const parsed = raw ? parseStoredJson(raw) : null;
        if (parsed && parsed.token && parsed.user && parsed.user.email && parsed.user.sub) {
          return {
            token: parsed.token,
            user: parsed.user,
            expiresAt: typeof parsed.expiresAt === 'string' ? parsed.expiresAt : null,
          };
        }
        const token = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY) || localStorage.getItem(LEGACY_AUTH_TOKEN_KEY);
        const user = parseStoredJson(localStorage.getItem(AUTH_USER_STORAGE_KEY));
        if (!token || !user || !user.email || !user.sub) {
          return null;
        }
        return { token, user, expiresAt: null };
      }

      function isSessionExpired(session) {
        if (!session || !session.expiresAt) {
          return false;
        }
        const t = Date.parse(session.expiresAt);
        if (Number.isNaN(t)) {
          return false;
        }
        return t <= Date.now();
      }

      function openAuthIdb() {
        return new Promise(function (resolve, reject) {
          const req = indexedDB.open(AUTH_IDB_NAME, AUTH_IDB_VERSION);
          req.onerror = function () {
            reject(req.error || new Error('indexedDB.open failed'));
          };
          req.onsuccess = function () {
            resolve(req.result);
          };
          req.onupgradeneeded = function () {
            const db = req.result;
            if (!db.objectStoreNames.contains(AUTH_IDB_STORE)) {
              db.createObjectStore(AUTH_IDB_STORE);
            }
          };
        });
      }

      function idbGetSession() {
        return openAuthIdb()
          .then(function (db) {
            return new Promise(function (resolve, reject) {
              const tx = db.transaction(AUTH_IDB_STORE, 'readonly');
              const store = tx.objectStore(AUTH_IDB_STORE);
              const getReq = store.get(AUTH_IDB_RECORD_KEY);
              getReq.onsuccess = function () {
                const row = getReq.result;
                if (!row || !row.token || !row.user || !row.user.email || !row.user.sub) {
                  resolve(null);
                  return;
                }
                resolve({
                  token: row.token,
                  user: row.user,
                  expiresAt: row.expiresAt || null,
                });
              };
              getReq.onerror = function () {
                reject(getReq.error);
              };
            });
          })
          .catch(function () {
            return null;
          });
      }

      function idbPutSession(session) {
        return openAuthIdb().then(function (db) {
          return new Promise(function (resolve, reject) {
            const record = {
              token: session.token,
              user: session.user,
              expiresAt: session.expiresAt,
            };
            const tx = db.transaction(AUTH_IDB_STORE, 'readwrite');
            tx.objectStore(AUTH_IDB_STORE).put(record, AUTH_IDB_RECORD_KEY);
            tx.oncomplete = function () {
              resolve();
            };
            tx.onerror = function () {
              reject(tx.error);
            };
          });
        });
      }

      function idbDeleteSession() {
        return openAuthIdb()
          .then(function (db) {
            return new Promise(function (resolve, reject) {
              const tx = db.transaction(AUTH_IDB_STORE, 'readwrite');
              tx.objectStore(AUTH_IDB_STORE).delete(AUTH_IDB_RECORD_KEY);
              tx.oncomplete = function () {
                resolve();
              };
              tx.onerror = function () {
                reject(tx.error);
              };
            });
          })
          .catch(function () {});
      }

      function hydrateAuthFromIndexedDb() {
        if (sessionHydrated) {
          return Promise.resolve();
        }
        return idbGetSession().then(function (session) {
          var next = session;
          if (!next) {
            const legacy = readLegacySessionFromLocalStorage();
            if (legacy && !isSessionExpired(legacy)) {
              return idbPutSession(legacy).then(function () {
                clearStoredSession();
                return legacy;
              });
            }
            return null;
          }
          return next;
        }).then(function (session) {
          if (session && isSessionExpired(session)) {
            memorySession = null;
            clearStoredSession();
            return idbDeleteSession();
          }
          memorySession = session;
          return undefined;
        }).then(function () {
          sessionHydrated = true;
        });
      }

      function readStoredSession() {
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

      function getSession() {
        return readStoredSession();
      }

      function getToken() {
        const session = getSession();
        return session ? session.token : null;
      }

      function getUser() {
        const session = getSession();
        return session ? session.user : null;
      }

      function dispatchAuthEvent(type, detail) {
        window.dispatchEvent(new CustomEvent(type, { detail, bubbles: true }));
      }

      function getLoginUrl() {
        const runtimeConfig = window[RUNTIME_CONFIG_KEY];
        const authLoginUrl = runtimeConfig && runtimeConfig[AUTH_LOGIN_URL_CONFIG_KEY];
        return typeof authLoginUrl === 'string' && authLoginUrl.length > 0 ? authLoginUrl : LOGIN_REDIRECT_PATH;
      }

      function parseDurationToMilliseconds(value) {
        if (typeof value !== 'string') {
          return null;
        }
        const match = /^(\d+)(ms|s|m|h|d)$/.exec(value.trim().toLowerCase());
        if (!match) {
          return null;
        }
        const amount = Number(match[1]);
        const units = {
          ms: 1,
          s: 1000,
          m: 60000,
          h: 3600000,
          d: 86400000,
        };
        return amount * units[match[2]];
      }

      function resolveExpiresAt(input) {
        if (typeof input.expiresAt === 'string' && input.expiresAt.length > 0) {
          return input.expiresAt;
        }
        if (typeof input.expiresIn === 'number' && Number.isFinite(input.expiresIn)) {
          return new Date(Date.now() + input.expiresIn * 1000).toISOString();
        }
        if (typeof input.expiresIn === 'string') {
          const ms = parseDurationToMilliseconds(input.expiresIn);
          return ms === null ? null : new Date(Date.now() + ms).toISOString();
        }
        return null;
      }

      function completeLogin(input) {
        const session = {
          token: input.token,
          user: input.user,
          expiresAt: resolveExpiresAt(input),
        };
        memorySession = session;
        clearStoredSession();
        return idbPutSession(session)
          .then(function () {
            dispatchAuthEvent(AUTH_EVENTS.LOGIN, { session });
          })
          .catch(function (err) {
            console.warn('[MFE-LOGIN] CAUSE: IndexedDB write failed after completeLogin');
            console.warn('[MFE-LOGIN] TODO: Check browser storage / auth_db quota (' + (err && err.message ? err.message : String(err)) + ')');
            throw err;
          });
      }

      function handleUnauthorized() {
        const previousSession = memorySession;
        memorySession = null;
        clearStoredSession();
        void idbDeleteSession();
        dispatchAuthEvent(AUTH_EVENTS.UNAUTHORIZED, { session: previousSession });
        if (typeof unauthorizedHandler === 'function') {
          unauthorizedHandler();
          return;
        }
        window.location.assign(getLoginUrl());
      }

      function notifyUnauthorized() {
        handleUnauthorized();
      }

      function getAuthHeaders() {
        const token = getToken();
        return token ? { Authorization: 'Bearer ' + token } : {};
      }

      function withAuth(init) {
        const baseHeaders = init && init.headers ? init.headers : {};
        return {
          ...(init || {}),
          headers: {
            ...baseHeaders,
            ...getAuthHeaders(),
          },
        };
      }

      function authFetch(input, init) {
        return window.fetch(input, withAuth(init)).then(function (response) {
          if (response.status === 401) {
            handleUnauthorized();
          }
          return response;
        });
      }

      function installFetchInterceptor() {
        if (fetchInterceptorInstalled) {
          return;
        }
        const originalFetch = window.fetch.bind(window);
        window.fetch = function (input, init) {
          return originalFetch(input, withAuth(init)).then(function (response) {
            if (response.status === 401) {
              handleUnauthorized();
            }
            return response;
          });
        };
        fetchInterceptorInstalled = true;
      }

      function hasPermission(permission) {
        const user = getUser();
        return Boolean(user && Array.isArray(user.permissions) && user.permissions.includes(permission));
      }

      function onUnauthorized(handler) {
        unauthorizedHandler = typeof handler === 'function' ? handler : null;
      }

      function setupAuthEventListeners() {
        window.addEventListener('storage', function (event) {
          if (
            event.key !== AUTH_SESSION_STORAGE_KEY &&
            event.key !== AUTH_TOKEN_STORAGE_KEY &&
            event.key !== AUTH_USER_STORAGE_KEY
          ) {
            return;
          }
          void idbGetSession().then(function (session) {
            if (session && isSessionExpired(session)) {
              memorySession = null;
              return idbDeleteSession();
            }
            memorySession = session;
            return undefined;
          }).then(function () {
            const session = memorySession;
            dispatchAuthEvent(session ? AUTH_EVENTS.LOGIN : AUTH_EVENTS.LOGOUT, { session });
          });
        });
      }

      function login() {
        window.location.assign(getLoginUrl());
        return Promise.resolve();
      }

      function logout() {
        const previousSession = memorySession;
        memorySession = null;
        clearStoredSession();
        void idbDeleteSession();
        dispatchAuthEvent(AUTH_EVENTS.LOGOUT, { session: previousSession });
        window.location.assign(getLoginUrl());
      }

      function checkAuth() {
        return Promise.resolve(Boolean(getToken()));
      }

      exports('AUTH_EVENTS', AUTH_EVENTS);
      exports('login', login);
      exports('logout', logout);
      exports('notifyUnauthorized', notifyUnauthorized);
      exports('getSession', getSession);
      exports('getToken', getToken);
      exports('checkAuth', checkAuth);
      exports('getUser', getUser);
      exports('hasPermission', hasPermission);
      exports('onUnauthorized', onUnauthorized);
      exports('authFetch', authFetch);
      exports('installFetchInterceptor', installFetchInterceptor);
      exports('setupAuthEventListeners', setupAuthEventListeners);
      exports('completeLogin', completeLogin);
      exports('hydrateAuthFromIndexedDb', hydrateAuthFromIndexedDb);
    },
  };
});
