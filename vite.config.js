import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    headers: {
      'Content-Security-Policy': `
        default-src 'self' https://checkout.wompi.co https://api.wompi.co;
        script-src 'self' 'unsafe-inline' 'unsafe-eval' https://checkout.wompi.co;
        style-src 'self' 'unsafe-inline';
        img-src 'self' data: /api/placeholder/;
        connect-src 'self' https://checkout.wompi.co https://api.wompi.co https://api-sandbox.wompi.co https://wompi-backend-k7g6.onrender.com;
        frame-src 'self' https://checkout.wompi.co;
      `.replace(/\n/g, '')
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      external: ['https://checkout.wompi.co/widget.js']
    }
  }
})