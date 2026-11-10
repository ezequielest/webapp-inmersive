import path from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  // El build se publica en https://effilms.com.ar/closer-demo/ → los assets se piden bajo esa ruta.
  // En desarrollo (`npm run dev`) se sirve desde la raíz.
  base: command === 'build' ? '/closer-demo/' : '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        // Permite `@use 'mixins' as *;` desde cualquier .module.scss
        loadPaths: [path.resolve(import.meta.dirname, './src/styles')],
      },
    },
  },
}))
