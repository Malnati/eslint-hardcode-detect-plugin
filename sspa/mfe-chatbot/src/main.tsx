// sspa/mfe-chatbot/frontend/src/main.tsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import { ChatBot } from './components/ChatBot';
import './styles/chatbot.css';

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <ChatBot />
    </React.StrictMode>,
  );
}
