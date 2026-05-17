import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon-192.png', 'icon-512.png', 'favicon.svg'],
      manifest: {
        name: '浮世絵アート - 写真を浮世絵に変換',
        short_name: '浮世絵アート',
        description: '描いた絵や写真を葛飾北斎・歌川広重スタイルの浮世絵に変換するアプリ',
        theme_color: '#1a0a00',
        background_color: '#1a0a00',
        display: 'standalone',
        orientation: 'portrait',
        lang: 'ja',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,json,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.stability\.ai\/.*/i,
            handler: 'NetworkOnly',
          },
        ],
      },
    }),
  ],
})
