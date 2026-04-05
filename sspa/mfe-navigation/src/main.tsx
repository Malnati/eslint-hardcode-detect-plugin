// sspa/mfe-navigation/src/main.tsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import Navigation from './index';

const container = document.getElementById('mfe-navigation');
if (container) {
  const root = createRoot(container);
  root.render(<Navigation />);
}
