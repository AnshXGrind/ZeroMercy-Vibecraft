import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default defineConfig({
  plugins: [react()],
  root: '.',
  base: '/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        'video-hero': resolve(__dirname, 'video-hero.html'),
        event: resolve(__dirname, 'event.html'),
        about: resolve(__dirname, 'about.html'),
        competition: resolve(__dirname, 'competition.html'),
        faq: resolve(__dirname, 'faq.html'),
        login: resolve(__dirname, 'login.html'),
        register: resolve(__dirname, 'register.html'),
        sponsors: resolve(__dirname, 'sponsors.html'),
        stalls: resolve(__dirname, 'stalls.html'),
        workshop: resolve(__dirname, 'workshop.html')
      }
    }
  }
})
