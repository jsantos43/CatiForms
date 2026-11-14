import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // Caminho onde o app é servido. Em produção: VITE_BASE_PATH=/catiforms/
  base: process.env.VITE_BASE_PATH ?? '/',
  plugins: [react()],
  server: {
    // Escuta em todas as interfaces para ser acessível de fora do container
    host: true,
    port: 5173,
    // Requisições para /api são repassadas para a API (evita CORS em dev)
    proxy: {
      '/api': {
        target: process.env.API_PROXY_TARGET ?? 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
