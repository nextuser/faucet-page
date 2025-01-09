/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config https://vitest.dev/config
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: '.vitest/setup',
    include: ['**/test.{ts,tsx}']
  },
  server: {
    proxy: {
      '/v1/gas': {
        target: `http://localhost:3001/v1/gas`,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/v1\/gas/, ''),
      },
    },
  },

})
