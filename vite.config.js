import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base must match the GitHub Pages project path: https://<user>.github.io/meatymunch-mmos/
// https://vite.dev/config/
export default defineConfig({
  base: '/meatymunch-mmos/',
  plugins: [react()],
})
