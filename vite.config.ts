import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  // Prevents Vite from walking up to the parent Freelaunch monorepo's
  // postcss.config.mjs (a Next.js config using string plugin names, which
  // isn't valid for Vite's raw PostCSS pipeline). @tailwindcss/vite doesn't
  // need PostCSS at all, so an empty inline config is enough.
  css: { postcss: {} },
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'Atelier plan de course',
        short_name: 'Plan de course',
        description:
          "Générateur de plan d'entraînement course à pied (et vélo) personnalisé à partir de la VMA et du temps disponible.",
        theme_color: '#1f9e63',
        background_color: '#eef2f0',
        display: 'standalone',
        start_url: '/',
        scope: '/',
        lang: 'fr',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          {
            src: '/icons/icon-maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff2}'],
      },
    }),
  ],
  test: {
    environment: 'node',
    globals: true,
  },
})
