import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  build: {
    outDir: 'build',
    emptyOutDir: true,
  },
  plugins: [react(), svgr()],
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
