import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import adonisjs from '@adonisjs/vite/client'
import inertia from '@adonisjs/inertia/vite'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const root = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  server: {
    allowedHosts: ['wawancara.smkpluspnb.sch.id'],
  },
  plugins: [
    vue(),
    inertia({ ssr: { enabled: false, entrypoint: 'inertia/ssr.ts' } }),
    adonisjs({ entrypoints: ['inertia/app.ts'], reload: ['resources/views/**/*.edge'] }),
  ],

  resolve: {
    alias: {
      '~/': resolve(root, 'inertia') + '/',
      '@/': resolve(root, 'inertia') + '/',
      '@generated': resolve(root, '.adonisjs/client') + '/',
    },
  },
})
