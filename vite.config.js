import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
base: '/fiszki/' // <--- bardzo ważne dla GitHub Pages
})
