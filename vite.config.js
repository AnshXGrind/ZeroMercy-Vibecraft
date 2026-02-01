import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Plugin to inject env vars into HTML files
function htmlEnvPlugin() {
  return {
    name: 'html-env-injection',
    transformIndexHtml(html, ctx) {
      const env = process.env
      return html
        .replace(/%VITE_SUPABASE_URL%/g, env.VITE_SUPABASE_URL || '')
        .replace(/%VITE_SUPABASE_ANON_KEY%/g, env.VITE_SUPABASE_ANON_KEY || '')
    }
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react(), htmlEnvPlugin()],
    root: '.',
    base: '/',
    publicDir: 'public',
    preview: {
      allowedHosts: ['icy-pets-arrive.loca.lt']
    },
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      copyPublicDir: true,
      rollupOptions: {
        input: {
          // React app
          app: resolve(__dirname, 'app.html'),
          // Static pages
          main: resolve(__dirname, 'index.html'),
          'video-hero': resolve(__dirname, 'video-hero.html'),
          event: resolve(__dirname, 'event.html'),
          about: resolve(__dirname, 'about.html'),
          competition: resolve(__dirname, 'competition.html'),
          faq: resolve(__dirname, 'faq.html'),
          login: resolve(__dirname, 'login.html'),
          register: resolve(__dirname, 'register.html'),
          'event-registration': resolve(__dirname, 'event-registration.html'),
          'competition-registration': resolve(__dirname, 'competition-registration.html'),
          'workshop-registration': resolve(__dirname, 'workshop-registration.html'),
          sponsors: resolve(__dirname, 'sponsors.html'),
          stalls: resolve(__dirname, 'stalls.html'),
          workshop: resolve(__dirname, 'workshop.html'),
          'events/car-rally': resolve(__dirname, 'events/car-rally.html'),
          'events/dj-campfire': resolve(__dirname, 'events/dj-campfire.html'),
          'events/dj-nights': resolve(__dirname, 'events/dj-nights.html'),
          'events/game-night': resolve(__dirname, 'events/game-night.html'),
          'events/inauguration-ceremony': resolve(__dirname, 'events/inauguration-ceremony.html'),
          'events/movie-night': resolve(__dirname, 'events/movie-night.html'),
          'events/music-night': resolve(__dirname, 'events/music-night.html'),
          'events/super-car-expo': resolve(__dirname, 'events/super-car-expo.html')
        }
      }
    }
  }
})
