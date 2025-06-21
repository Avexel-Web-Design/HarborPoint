import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8788',
        changeOrigin: true,
        secure: false,
        configure: (proxy, options) => {
          proxy.on('proxyRes', (proxyRes, req, res) => {
            // Log cookie handling for debugging
            if (proxyRes.headers['set-cookie']) {
              console.log('Backend set cookies:', proxyRes.headers['set-cookie']);
            }
          });
          
          proxy.on('proxyReq', (proxyReq, req, res) => {
            // Log outgoing requests with cookies
            if (req.headers.cookie) {
              console.log('Forwarding cookies to backend:', req.headers.cookie);
            }
          });
        }
      }
    }
  }
})
