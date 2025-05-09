import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  // Plugins
  plugins: [
    react(),            // enable JSX/TSX support
  ],

  // Resolve aliases
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),  // import { Foo } from '@/components/Foo'
    },
  },

  // Dev server configuration
  server: {
    host: '0.0.0.0',    // listen on all interfaces
    port: 5173,         // default Vite port
    open: true,         // auto-open browser
    proxy: {
      // Proxy API calls to your FastAPI backend
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
    },
  },

  // Build output
  build: {
    outDir: 'dist',     // build output directory
    sourcemap: false,   // set to true if you need source maps
  },
})
