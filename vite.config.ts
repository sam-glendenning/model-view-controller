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
        advancedChunks: {
          groups: [
            {
              name: 'react-vendor',
              test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
              priority: 20,
            },
            {
              name: 'mui-vendor',
              test: /[\\/]node_modules[\\/](@mui|@emotion)[\\/]/,
              priority: 15,
            },
            {
              name: 'query-vendor',
              test: /[\\/]node_modules[\\/]@tanstack[\\/]react-query/,
              priority: 10,
            },
          ],
          minSize: 20000,
          minShareCount: 1,
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
