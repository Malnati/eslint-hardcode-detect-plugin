// sspa/mfe-chatbot/frontend/src/vite-env.d.ts
/// <reference types="vite/client" />

declare module 'single-spa-react' {
  import type { ComponentType, ErrorInfo } from 'react';

  interface SingleSpaReactOptions {
    React: typeof import('react');
    ReactDOMClient: typeof import('react-dom/client');
    rootComponent: ComponentType<Record<string, unknown>>;
    errorBoundary?: (
      err: Error,
      info: ErrorInfo,
      props: Record<string, unknown>,
    ) => JSX.Element;
  }

  interface SingleSpaReactLifecycles {
    bootstrap: (props: Record<string, unknown>) => Promise<void>;
    mount: (props: Record<string, unknown>) => Promise<void>;
    unmount: (props: Record<string, unknown>) => Promise<void>;
  }

  export default function singleSpaReact(
    opts: SingleSpaReactOptions,
  ): SingleSpaReactLifecycles;
}
