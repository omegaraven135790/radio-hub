import { defineConfig } from 'vite';

// https://vitejs.dev/config
export default defineConfig({
  main: {
    build: {
      rollupOptions: {
        external: ['electron-store'] // <-- Add this here
      }
    }
  }
  // ... rest of config
})
