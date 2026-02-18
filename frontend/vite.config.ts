import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // For GitHub Pages deployment, use repo name as base
  // For Vercel, this is overridden (Vercel serves from root)
  base: process.env.GITHUB_PAGES === 'true' ? '/tokenomicsradar/' : '/',
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'chart-vendor': ['recharts'],
        },
      },
    },
  },
})
