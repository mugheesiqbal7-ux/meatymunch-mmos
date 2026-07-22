import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// base must match the GitHub Pages project path: https://<user>.github.io/meatymunch-mmos/
// https://vite.dev/config/
export default defineConfig({
  base: '/meatymunch-mmos/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['apple-touch-icon.png', 'favicon.svg'],
      manifest: {
        name: 'MeatyMunch MMOS · Mitarbeiter-App',
        short_name: 'MeatyMunch',
        description: 'Mitarbeiter-App für MeatyMunch — Checklisten, SOPs, Zeiterfassung, Lieferanten & mehr.',
        lang: 'de',
        theme_color: '#17130f',
        background_color: '#17130f',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/meatymunch-mmos/',
        scope: '/meatymunch-mmos/',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: 'pwa-maskable-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,jpeg,png,svg,woff2}'],
        navigateFallback: '/meatymunch-mmos/index.html',
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
            handler: 'CacheFirst',
            options: { cacheName: 'google-fonts', expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 365 } },
          },
        ],
      },
      devOptions: { enabled: false },
    }),
  ],
})
