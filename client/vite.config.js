import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  base: "/",

  // Proxy configuration for API requests
  server: {
    proxy: {
      '/api': {
        target: 'https://portal-lomba-be.azurewebsites.net', // Your backend URL
        changeOrigin: true,  // Allows for proxying API requests
        rewrite: (path) => path.replace(/^\/api/, ''), // Remove /api prefix before forwarding to the backend
      },
    },
  },

  plugins: [react()],
});
