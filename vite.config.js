import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(), tailwindcss()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      "/tmdb": {
        target: "https://api.themoviedb.org",
        changeOrigin: true,
        secure: true,
        configure: (proxy) => {
        proxy.on("proxyReq", (proxyReq) => {
          proxyReq.setHeader("Origin", "https://api.themoviedb.org");
          proxyReq.setHeader("Referer", "https://api.themoviedb.org");
          proxyReq.setHeader("Access-Control-Allow-Origin", "*");
          proxyReq.setHeader("Accept", "application/json");
        });
      },
        rewrite: (path) => path.replace(/^\/tmdb/, ""),
      },
    },
  },
})
