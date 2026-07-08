import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { defineConfig } from 'vite';

const root = resolve(__dirname);

export default defineConfig({
  plugins: [react()],
  root,
  base: './',
  resolve: {
    alias: {
      '@': resolve(root, 'src'),
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  server: {
    port: 5173,
    strictPort: false,
  },
});
