import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import adonisjs from '@adonisjs/vite/client'
import inertia from '@adonisjs/inertia/vite'

export default defineConfig({
  base: '/assets/',
  plugins: [
    vue(),
    inertia({ ssr: { enabled: false, entrypoint: 'inertia/ssr.ts' } }),
    adonisjs({ entrypoints: ['inertia/app.ts'], reload: ['resources/views/**/*.edge'] }),
  ],

  resolve: {
    alias: {
      '~/': `${import.meta.dirname}/inertia/`,
      '@/': `${import.meta.dirname}/inertia/`,
      '@generated': `${import.meta.dirname}/.adonisjs/client/`,
    },
  },

  server: {
    allowedHosts: true,
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    hmr: {
      protocol: 'wss',
      clientPort: 443
    },
    watch: {
      ignored: ['**/storage/**', '**/tmp/**'],
    },
  },

})
