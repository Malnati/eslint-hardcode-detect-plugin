// sspa/dashboard/src/dashboard.tsx
import type { JSX } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { navigateToUrl } from 'single-spa';

import { checkAuth, getUser, logout } from './auth-service';
import { type LocaleCode, ProfileMenu, type ThemeMode } from './profile-menu';
import { getStaticApplications, isKnownRoute } from './root-config';

const THEME_STORAGE_KEY = 'theme';
const LOCALE_STORAGE_KEY = 'locale';

const THEME_CLASS_NAME = 'dark';
const DEFAULT_THEME: ThemeMode = 'light';
const DEFAULT_LOCALE: LocaleCode = 'pt-BR';

const navRoutes = ['/account', '/authtorization', '/config', '/key', '/profile', '/proxy', '/usage'];

const copyByLocale: Record<LocaleCode, Record<string, string>> = {
  'pt-BR': {
    appName: 'SSPA',
    navigation: 'Navegacao',
    home: 'Home',
    login: 'Login',
    footer: 'Container MFE Orquestrador',
    authenticated: 'Autenticado',
    notAuthenticated: 'Nao autenticado',
    notFoundTitle: '404 - Nao encontrado',
    notFoundLabel: 'Rota nao encontrada:',
    accountEmbeddedTitle: 'Accounts',
    accountEmbeddedDescription: 'Micro-frontend de contas montado dentro do shell do dashboard.',
    authtorizationEmbeddedTitle: 'Authorization',
    authtorizationEmbeddedDescription: 'Micro-frontend de autorizacao montado dentro do shell do dashboard.',
    usageEmbeddedTitle: 'Usage',
    usageEmbeddedDescription: 'Micro-frontend de uso de API montado dentro do shell do dashboard.',
    proxyEmbeddedTitle: 'Proxys',
    proxyEmbeddedDescription: 'Micro-frontend de proxy montado dentro do shell do dashboard.',
    profileEmbeddedTitle: 'Profile',
    profileEmbeddedDescription: 'Micro-frontend de perfil montado dentro do shell do dashboard.',
  },
  'en-US': {
    appName: 'SSPA',
    navigation: 'Navigation',
    home: 'Home',
    login: 'Login',
    footer: 'MFE Orchestrator Container',
    authenticated: 'Authenticated',
    notAuthenticated: 'Not authenticated',
    notFoundTitle: '404 - Not Found',
    notFoundLabel: 'Route not found:',
    accountEmbeddedTitle: 'Accounts',
    accountEmbeddedDescription: 'Account micro-frontend mounted inside the dashboard shell.',
    authtorizationEmbeddedTitle: 'Authorization',
    authtorizationEmbeddedDescription: 'Authorization micro-frontend mounted inside the dashboard shell.',
    usageEmbeddedTitle: 'Usage',
    usageEmbeddedDescription: 'API usage micro-frontend mounted inside the dashboard shell.',
    proxyEmbeddedTitle: 'Proxys',
    proxyEmbeddedDescription: 'Proxy micro-frontend mounted inside the dashboard shell.',
    profileEmbeddedTitle: 'Profile',
    profileEmbeddedDescription: 'Profile micro-frontend mounted inside the dashboard shell.',
  },
};

function resolveTheme(): ThemeMode {
  const rawTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
  return rawTheme === 'dark' ? 'dark' : DEFAULT_THEME;
}

function resolveLocale(): LocaleCode {
  const rawLocale = window.localStorage.getItem(LOCALE_STORAGE_KEY);
  return rawLocale === 'en-US' ? 'en-US' : DEFAULT_LOCALE;
}

function buildBreadcrumb(pathname: string, locale: LocaleCode): string {
  const copy = copyByLocale[locale];
  if (pathname === '/') {
    return copy.home;
  }

  const segment = pathname.replace(/^\//, '').split('/')[0];
  if (!segment) {
    return copy.home;
  }

  return `${copy.home} / ${segment.charAt(0).toUpperCase()}${segment.slice(1)}`;
}

function isHomeRoute(pathname: string): boolean {
  return pathname === '/';
}

function isProxyRoute(pathname: string): boolean {
  return pathname.startsWith('/proxy');
}

function isAuthtorizationRoute(pathname: string): boolean {
  return pathname.startsWith('/authtorization');
}

function isUsageRoute(pathname: string): boolean {
  return pathname.startsWith('/usage');
}

function isProfileRoute(pathname: string): boolean {
  return pathname.startsWith('/profile');
}

export function Dashboard(): JSX.Element {
  const applications = getStaticApplications();
  const [pathname, setPathname] = useState(window.location.pathname);
  const [theme, setTheme] = useState<ThemeMode>(resolveTheme);
  const [locale, setLocale] = useState<LocaleCode>(resolveLocale);
  const [authLabel, setAuthLabel] = useState(copyByLocale[DEFAULT_LOCALE].notAuthenticated);
  const [menuOpen, setMenuOpen] = useState(false);
  const routeKnown = useMemo(() => isKnownRoute(pathname), [pathname]);
  const breadcrumb = useMemo(() => buildBreadcrumb(pathname, locale), [pathname, locale]);
  const isPublicRoute = pathname.startsWith('/login');
  const isHome = isHomeRoute(pathname);
  const isAuthtorization = isAuthtorizationRoute(pathname);
  const isProxy = isProxyRoute(pathname);
  const isUsage = isUsageRoute(pathname);
  const isProfile = isProfileRoute(pathname);
  const copy = copyByLocale[locale];
  const user = getUser();
  const menuRef = useRef<HTMLDivElement | null>(null);

  const isDark = theme === 'dark';

  const containerClass = `ds-dashboard-container${isDark ? ' dark' : ''}`;
  const panelClass = `ds-panel${isDark ? ' dark' : ''}`;
  const headerClass = `${panelClass} ds-header`;
  const footerClass = `ds-panel ds-footer${isDark ? ' dark' : ''}`;
  const shellClass = 'ds-shell';
  const sidebarClass = `${panelClass} ds-sidebar`;
  const sidebarListClass = 'ds-sidebar-list';
  const sidebarItemClass = `ds-sidebar-item${isDark ? ' dark' : ''}`;
  const sidebarLinkClass = `ds-sidebar-link${isDark ? ' dark' : ''}`;
  const contentClass = `${panelClass} ds-content`;
  const mountClass = `ds-mount${isDark ? ' dark' : ''}`;
  const notFoundClass = `ds-not-found${isDark ? ' dark' : ''}`;
  const breadcrumbClass = `ds-breadcrumb-text${isDark ? ' dark' : ''}`;
  const publicContentClass = `${panelClass} ds-public-content`;
  const authLabelClass = `ds-auth-label${isDark ? ' dark' : ''}`;

  useEffect(() => {
    const syncPathname = () => {
      setPathname(window.location.pathname);
      setMenuOpen(false);
    };

    window.addEventListener('popstate', syncPathname);
    window.addEventListener('single-spa:routing-event', syncPathname);

    return () => {
      window.removeEventListener('popstate', syncPathname);
      window.removeEventListener('single-spa:routing-event', syncPathname);
    };
  }, []);

  useEffect(() => {
    if (!pathname.startsWith('/login')) {
      return;
    }

    let active = true;
    const validateSession = async (): Promise<void> => {
      const authenticated = await checkAuth();
      if (active && authenticated) {
        navigateToUrl('/');
      }
    };

    void validateSession();

    return () => {
      active = false;
    };
  }, [pathname]);

  useEffect(() => {
    let active = true;

    const resolveAuthStatus = async (): Promise<void> => {
      const authenticated = await checkAuth();
      const currentUser = getUser();
      if (!active) {
        return;
      }

      if (authenticated && currentUser?.email) {
        setAuthLabel(currentUser.email);
        return;
      }

      if (authenticated) {
        setAuthLabel(copy.authenticated);
        return;
      }

      setAuthLabel(copy.notAuthenticated);

      if (!authenticated && !isPublicRoute) {
        navigateToUrl('/login');
      }
    };

    void resolveAuthStatus();
  }, [pathname, copy.authenticated, copy.notAuthenticated, isPublicRoute]);

  useEffect(() => {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    document.documentElement.classList.toggle(THEME_CLASS_NAME, theme === 'dark');
  }, [theme]);

  useEffect(() => {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  }, [locale]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (menuRef.current && event.target instanceof Node && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    window.addEventListener('click', handleOutsideClick);
    return () => {
      window.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  return (
    <div className={containerClass}>
      {!isPublicRoute ? (
        <header className={headerClass}>
          <strong>{copy.appName}</strong>
          <div className="ds-row">
            <span className={authLabelClass}>{authLabel}</span>
            <div ref={menuRef}>
              <ProfileMenu
                locale={locale}
                user={user}
                theme={theme}
                menuOpen={menuOpen}
                onToggleMenu={() => setMenuOpen((value) => !value)}
                onCloseMenu={() => setMenuOpen(false)}
                onToggleTheme={() => setTheme((value) => (value === 'light' ? 'dark' : 'light'))}
                onLocaleChange={setLocale}
                onLogout={() => {
                  logout();
                  setAuthLabel(copy.notAuthenticated);
                  navigateToUrl('/login');
                }}
              />
            </div>
          </div>
        </header>
      ) : null}

      {!isPublicRoute ? (
        <div className={shellClass}>
          <aside className={sidebarClass}>
            <strong>{copy.navigation}</strong>
            <div className={sidebarListClass}>
              <div className={sidebarItemClass}>
                <a
                  href="/"
                  className={sidebarLinkClass}
                  onClick={(event) => {
                    event.preventDefault();
                    navigateToUrl('/');
                  }}
                >
                  {copy.home}
                </a>
              </div>
              {applications
                .filter((application) => navRoutes.includes(application.route))
                .map((application) => (
                  <div key={`nav-${application.name}`} className={sidebarItemClass}>
                    <a
                      href={application.route}
                      className={sidebarLinkClass}
                      onClick={(event) => {
                        event.preventDefault();
                        navigateToUrl(application.route);
                      }}
                    >
                      {application.title}
                    </a>
                  </div>
                ))}
            </div>
          </aside>

          <main className={contentClass}>
            <div className={breadcrumbClass}>{breadcrumb}</div>

            {!routeKnown ? (
              <section className={notFoundClass}>
                <h2>{copy.notFoundTitle}</h2>
                <p>{copy.notFoundLabel} {pathname}</p>
              </section>
            ) : null}

            {isHome ? (
              <section className={mountClass}>
                <div className={panelClass}>
                  <h2>{copy.accountEmbeddedTitle}</h2>
                  <p>{copy.accountEmbeddedDescription}</p>
                  <div id="single-spa-application:@mfe/account"></div>
                </div>
              </section>
            ) : (
              <section className={mountClass}>
                {isProxy ? (
                  <div className={panelClass}>
                    <h2>{copy.proxyEmbeddedTitle}</h2>
                    <p>{copy.proxyEmbeddedDescription}</p>
                  </div>
                ) : null}
                {isAuthtorization ? (
                  <div className={panelClass}>
                    <h2>{copy.authtorizationEmbeddedTitle}</h2>
                    <p>{copy.authtorizationEmbeddedDescription}</p>
                    <div id="single-spa-application:@mfe/authtorization"></div>
                  </div>
                ) : null}
                {isUsage ? (
                  <div className={panelClass}>
                    <h2>{copy.usageEmbeddedTitle}</h2>
                    <p>{copy.usageEmbeddedDescription}</p>
                    <div id="single-spa-application:@mfe/usage"></div>
                  </div>
                ) : null}
                {isProfile ? (
                  <div className={panelClass}>
                    <h2>{copy.profileEmbeddedTitle}</h2>
                    <p>{copy.profileEmbeddedDescription}</p>
                    <div id="single-spa-application:@mfe/profile"></div>
                  </div>
                ) : null}
                {applications
                  .filter((application) => !isAuthtorization || application.name !== '@mfe/authtorization')
                  .filter((application) => !isUsage || application.name !== '@mfe/usage')
                  .filter((application) => !isProfile || application.name !== '@mfe/profile')
                  .map((application) => (
                    <div key={application.name} id={`single-spa-application:${application.name}`}></div>
                  ))}
              </section>
            )}
          </main>
        </div>
      ) : (
        <main className={publicContentClass}>
          <h1>{copy.login}</h1>
          <section className={mountClass}>
            {applications.map((application) => (
              <div key={application.name} id={`single-spa-application:${application.name}`}></div>
            ))}
          </section>
        </main>
      )}

      <footer className={footerClass}>{copy.footer}</footer>
    </div>
  );
}
