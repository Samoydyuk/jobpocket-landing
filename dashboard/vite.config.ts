import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/dashboard/',
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://jobpocketapp-production.up.railway.app',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
