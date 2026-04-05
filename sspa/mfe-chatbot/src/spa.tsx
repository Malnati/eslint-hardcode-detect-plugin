// sspa/mfe-chatbot/frontend/src/spa.tsx
import React from 'react';
import ReactDOMClient from 'react-dom/client';
import singleSpaReact from 'single-spa-react';
import { ChatBot } from './components/ChatBot';

const lifecycles = singleSpaReact({
  React,
  ReactDOMClient,
  rootComponent: ChatBot,
  errorBoundary(_err: Error, _info: React.ErrorInfo, _props: Record<string, unknown>) {
    return <div style={{ padding: '16px', color: '#dc2626' }}>Erro ao carregar o chatbot Chatbot.</div>;
  },
});

export const bootstrap = lifecycles.bootstrap;
export const mount = lifecycles.mount;
export const unmount = lifecycles.unmount;
