// sspa/dashboard/src/profile-menu.tsx
import type { JSX } from 'react';

import type { UserProfile } from './auth-service';

export type ThemeMode = 'light' | 'dark';
export type LocaleCode = 'pt-BR' | 'en-US';

type CopyDictionary = {
  account: string;
  settings: string;
  language: string;
  logout: string;
  themeLabel: string;
  light: string;
  dark: string;
};

type ProfileMenuProps = {
  locale: LocaleCode;
  user: UserProfile | null;
  theme: ThemeMode;
  menuOpen: boolean;
  onToggleMenu: () => void;
  onCloseMenu: () => void;
  onToggleTheme: () => void;
  onLocaleChange: (locale: LocaleCode) => void;
  onLogout: () => void;
};

const copyByLocale: Record<LocaleCode, CopyDictionary> = {
  'pt-BR': {
    account: 'Conta',
    settings: 'Preferencias',
    language: 'Idioma',
    logout: 'Logout',
    themeLabel: 'Tema',
    light: 'Claro',
    dark: 'Escuro',
  },
  'en-US': {
    account: 'Account',
    settings: 'Preferences',
    language: 'Language',
    logout: 'Logout',
    themeLabel: 'Theme',
    light: 'Light',
    dark: 'Dark',
  },
};

function buildFallbackAvatar(name: string): string {
  const initial = name.trim().charAt(0).toUpperCase() || 'U';
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='96' height='96'><rect width='96' height='96' fill='%231f2937'/><text x='50%' y='56%' font-size='42' fill='%23f9fafb' text-anchor='middle' font-family='Arial'>${initial}</text></svg>`;
  return `data:image/svg+xml,${svg}`;
}

export function ProfileMenu({
  locale,
  user,
  theme,
  menuOpen,
  onToggleMenu,
  onCloseMenu,
  onToggleTheme,
  onLocaleChange,
  onLogout,
}: ProfileMenuProps): JSX.Element {
  const copy = copyByLocale[locale];
  const userName = user?.name || user?.email || 'User';
  const avatarSrc = user?.picture || buildFallbackAvatar(userName);

  return (
    <div className="ds-menu-wrapper">
      <button
        type="button"
        className="user-menu-trigger ds-menu-trigger"
        onClick={onToggleMenu}
        aria-expanded={menuOpen}
        aria-label="user menu"
      >
        <img className="user-avatar ds-menu-avatar" src={avatarSrc} alt="user avatar" />
        <span className="user-profile-name ds-menu-user-label">{userName}</span>
      </button>

      {menuOpen ? (
        <div className="user-menu-dropdown ds-menu-dropdown">
          <div className="ds-menu-section-title">{copy.account}</div>
          <div className="ds-menu-label-text">
            {copy.settings}
          </div>

          <div className="ds-menu-row">
            <span>{copy.themeLabel}</span>
            <button
              type="button"
              className="theme-toggle ds-menu-action-btn"
              onClick={onToggleTheme}
            >
              {theme === 'dark' ? copy.dark : copy.light}
            </button>
          </div>

          <div className="ds-menu-row">
            <span>{copy.language}</span>
            <select
              className="language-switcher ds-menu-action-btn"
              value={locale}
              onChange={(event) => onLocaleChange(event.target.value as LocaleCode)}
            >
              <option value="pt-BR">pt-BR</option>
              <option value="en-US">en-US</option>
            </select>
          </div>

          <button
            type="button"
            className="logout-button ds-menu-logout-btn"
            onClick={() => {
              onCloseMenu();
              onLogout();
            }}
          >
            {copy.logout}
          </button>
        </div>
      ) : null}
    </div>
  );
}
