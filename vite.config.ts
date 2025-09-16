import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  // Development server configuration
  server: {
    port: 3000,
    open: true,
    host: true, // Allows access from network (useful for mobile testing)
  },

  // Build optimizations
  build: {
    target: 'es2022', // Match your tsconfig target
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate vendor chunks for better caching
          'react-vendor': ['react', 'react-dom'],
          'mui-vendor': [
            '@mui/material',
            '@mui/icons-material',
            '@emotion/react',
            '@emotion/styled',
          ],
          'query-vendor': [
            '@tanstack/react-query',
            '@tanstack/react-query-devtools',
          ],
        },
      },
    },
  },

  // Preview server (for production builds)
  preview: {
    port: 3000,
    open: true,
  },

  // Dependency optimization
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      '@mui/material',
      '@mui/icons-material',
      '@tanstack/react-query',
    ],
  },
});
