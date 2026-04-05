// sspa/mfe-chatbot/frontend/vite.config.ts
import { defineConfig } from 'vite';
import vitePluginSingleSpa from 'vite-plugin-single-spa';

export default defineConfig({
  plugins: [
    vitePluginSingleSpa({
      type: 'mife',
      serverPort: 4200,
      spaEntryPoints: 'src/spa.tsx',
    }),
  ],
  server: {
    port: 4200,
    cors: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
  },
});
