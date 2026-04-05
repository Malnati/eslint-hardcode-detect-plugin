// sspa/mfe-chatbot/frontend/vite.standalone.config.ts
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist-standalone',
    sourcemap: false,
  },
  esbuild: {
    jsxFactory: 'React.createElement',
    jsxFragment: 'React.Fragment',
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
});
