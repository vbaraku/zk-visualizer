import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['snarkjs']
  },
  build: {
    target: 'esnext'
  },
  server: {
    allowedHosts: [
      'nakisha-nonsegregative-overscrupulously.ngrok-free.dev'
    ]
  }
})
