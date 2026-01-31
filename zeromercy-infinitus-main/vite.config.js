import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html'),
        'video-hero': resolve(__dirname, 'video-hero.html'),
        event: resolve(__dirname, 'event.html')
      }
    }
  }
})
