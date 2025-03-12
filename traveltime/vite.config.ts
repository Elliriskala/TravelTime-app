import react from '@vitejs/plugin-react-swc';
import {defineConfig} from 'vite';
import {VitePWA} from 'vite-plugin-pwa';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  base: './',
  publicDir: "./public",
  build: {
    outDir: "./dist",
    rollupOptions: {
        external: [],
      input: {
        home: path.resolve(__dirname, "index.html"),
      }
    }
  },
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {enabled: true},
      workbox: {
        navigateFallback: '/',
        maximumFileSizeToCacheInBytes: 5000000, // 5MB
        globPatterns: ['**/*.{js,css,html,ico,png,jpg,jpeg,svg,ttf,json}'], // Match all assets
      },
      includeAssets: ['png/logo-color.png','png/logo-no-background.png', 'svg/logo-color.svg', 'svg/logo-no-background.svg', 'index.css'],
      manifest: {
        name: 'TravelTime',
        short_name: 'TravelTime',
        theme_color: '#ffffff',
        description:
          'TravelTime media sharing web application built with React, TypeScript, Node.js, Express.js, and MySQL.',
        icons: [
          {
            src: 'svg/logo-color.svg',
            sizes: '192x192',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // Make 'src' an alias for easier imports
    },
  },
});
