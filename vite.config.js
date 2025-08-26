import { fileURLToPath, URL } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import tailwindcss from 'tailwindcss';

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
  base: '/',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    chunkSizeWarningLimit: 3000,
  },
  server: {
    proxy: {
      // This will match any request starting with /v1/api and proxy it
      '/v1/api': {
        target: 'http://103.1.101.244/:9091', // your backend
        changeOrigin: true,
        secure: false,
        // remove /v1/api if your backend doesn't expect it
        // rewrite: (path) => path.replace(/^\/v1\/api/, '')
      },
    },
  },
});
