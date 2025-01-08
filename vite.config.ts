import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/v1/gas': {
        target: `http://localhost:3001/v1/gas`,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/v1\/gas/, ''),
      },
    },
  },
});
