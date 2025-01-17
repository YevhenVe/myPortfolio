import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr';
import Pages from 'vite-plugin-pages';
import Sitemap from 'vite-plugin-sitemap';

export default defineConfig({
  build: {
    outDir: 'build',
    emptyOutDir: true,
  },
  plugins: [
    react(), 
    svgr(), 
    Pages(), 
    Sitemap({
      hostname: 'https://yevhen-portfolio-page.web.app',
    }),
  ],
  server: {
    watch: {
      usePolling: true,
    },
    host: true,
    strictPort: true,
    port: 5173
  },
  cacheDir: '/tmp/.vite-temp'
})
