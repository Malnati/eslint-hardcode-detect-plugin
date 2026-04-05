// sspa/mfe-navigation/src/index.ts
// MFE Navigation - Header + Sidebar + Breadcrumb

import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

const NAV_ITEMS = [
  { path: '/account', label: 'Account', icon: '👤' },
  { path: '/key', label: 'Key', icon: '🔑' },
  { path: '/proxy', label: 'Proxy', icon: '⭐' },
  { path: '/usage', label: 'Usage', icon: '📊' },
];

function Navigation() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [showSidebar, setShowSidebar] = useState(true);

  useEffect(() => {
    const handlePopState = () => setCurrentPath(window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const isLoginPage = currentPath === '/login';
  const navItems = NAV_ITEMS;

  if (isLoginPage) {
    return null;
  }

  return (
    <div className="mfe-navigation">
      <header className="ds-nav-header">
        <div className="ds-nav-brand">SSPA</div>
      </header>
      
      <aside className="ds-nav-sidebar">
        <nav>
          {navItems.map((item) => (
            <a
              key={item.path}
              href={item.path}
              className={`ds-nav-link ${currentPath === item.path ? 'ds-nav-link-active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                window.history.pushState({}, '', item.path);
                setCurrentPath(item.path);
              }}
            >
              <span className="ds-nav-icon">{item.icon}</span>
              {item.label}
            </a>
          ))}
        </nav>
      </aside>

      <main className="ds-nav-main">
        <div className="ds-breadcrumb">
          Home {currentPath !== '/' && ` / ${currentPath.slice(1).charAt(0).toUpperCase() + currentPath.slice(2)}`}
        </div>
      </main>
    </div>
  );
}

// Mount function for single-spa
export function mount() {
  const container = document.getElementById('mfe-navigation');
  if (container) {
    const root = createRoot(container);
    root.render(<Navigation />);
  }
}

// Unmount function for single-spa
export function unmount() {
  const container = document.getElementById('mfe-navigation');
  if (container) {
    container.innerHTML = '';
  }
}

// Bootstrap for standalone dev
export function bootstrap() {
  mount();
}

export default Navigation;
