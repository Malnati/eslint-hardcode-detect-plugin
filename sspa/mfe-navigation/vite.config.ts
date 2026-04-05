// sspa/mfe-navigation/vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import singleSpa from 'vite-plugin-single-spa';

export default defineConfig({
  plugins: [
    react(),
    singleSpa({
      name: 'mfe-navigation',
      entry: 'src/index.tsx',
      entryName: 'mfe-navigation',
    }),
  ],
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
  build: {
    outDir: 'output',
    rollupOptions: {
      external: ['react', 'react-dom', 'react-dom/client', 'single-spa'],
      output: {
        format: 'system',
        assetFileNames: 'assets/[name][extname]',
      },
    },
  },
});
