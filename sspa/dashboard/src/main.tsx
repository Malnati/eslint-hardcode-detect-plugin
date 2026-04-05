// sspa/dashboard/src/main.tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { Dashboard } from './dashboard';
import { setupDynamicApplications } from './root-config';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Missing #root element');
}

const root = createRoot(rootElement);
root.render(
  <StrictMode>
    <Dashboard />
  </StrictMode>
);

setupDynamicApplications().catch((error) => {
  console.error('[sspa/dashboard] failed to setup applications', error);
});
