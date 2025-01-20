import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  server: {
    proxy:
      mode === 'development'
        ? {
            '/api': {
              target: 'https://itunes.apple.com',
              changeOrigin: true,
              rewrite: (path) => path.replace(/^\/api/, ''),
            },
          }
        : undefined,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(mode),
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
}));
