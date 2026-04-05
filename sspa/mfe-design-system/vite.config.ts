// sspa/mfe-design-system/vite.config.ts
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [tailwindcss()],
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
  build: {
    outDir: 'output',
    cssCodeSplit: false,
    lib: {
      entry: 'src/index.ts',
      name: 'MfeDesignSystem',
      fileName: () => 'spa.js',
      formats: ['system'],
    },
    rollupOptions: {
      external: [],
    },
  },
});
