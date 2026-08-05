import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vitest/config'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: process.env.VITE_API_PROXY_TARGET ?? 'http://localhost:5010',
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      '@/core': path.resolve(__dirname, './src/core'),
      '@/administration': path.resolve(__dirname, './src/architecture/administration'),
      '@/scheduling': path.resolve(__dirname, './src/architecture/scheduling'),
      '@/identity': path.resolve(__dirname, './src/architecture/identity'),
      '@/shared-architecture': path.resolve(__dirname, './src/architecture/shared'),
      '@/presentation': path.resolve(__dirname, './src/presentation'),
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: "jsdom"
  },
})
