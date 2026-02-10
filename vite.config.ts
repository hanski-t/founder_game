import { defineConfig } from 'vite'
import { resolve } from 'path'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/foundergame/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@assets': resolve(__dirname, 'src/assets/used'),
    },
  },
})
