import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/stock-hype-risk-analyzer/',
  plugins: [react()],
})
