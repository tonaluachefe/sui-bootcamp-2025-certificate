import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    // Skip type checking during build to avoid issues with external libs
    emptyOutDir: true,
  },
  optimizeDeps: {
    include: ['@mysten/wallet-kit', '@mysten/sui.js'],
  },
})


