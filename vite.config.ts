import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  server: {
    proxy: {
      '/v1/gas': {
        target: `http://localhost:3001/v1/gas`,
        changeOrigin: true,
        rewrite: (path:string) => path.replace(/^\/v1\/gas/, ''),
      },

      '/api/auth': {
        target: `http://localhost:3001/api/auth`,
        changeOrigin: true,
        rewrite: (path:string) => path.replace(/^\/api\/auth/, ''),
      },
      '/faucet/github': {
        target: `http://localhost:3001/faucet/github`,
        changeOrigin: true,
        rewrite: (path:string) => path.replace(/^\/faucet\/github/, ''),
      },
    },
  },

})
