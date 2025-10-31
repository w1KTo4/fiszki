import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/fiszki/', // musi być zgodne z nazwą repozytorium
  plugins: [react()],
})
