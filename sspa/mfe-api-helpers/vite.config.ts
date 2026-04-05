// sspa/mfe-api-helpers/vite.config.ts
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'output',
    lib: {
      entry: 'src/index.ts',
      name: 'MfeApi',
      fileName: () => 'spa.js',
      formats: ['system'],
    },
    rollupOptions: {
      external: ['axios', 'single-spa', '@mfe/auth'],
    },
  },
});
