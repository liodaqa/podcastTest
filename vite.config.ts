import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        // target: 'http://itunes.apple.com',
        target: 'http://localhost:3000', // Proxy to your local Vercel serverless function

        // target: 'http://localhost:5173',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  // server: {
  //   proxy:
  //     mode === 'development'
  //       ? {
  //           '/api': {
  //             target: 'https://itunes.apple.com',
  //             changeOrigin: true,
  //             rewrite: (path) => path.replace(/^\/api/, ''),
  //             // rewrite: (path) => path.replace(/^\/api/, '/get'),
  //           },
  //         }
  //       : undefined,
  // },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(mode),
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
}));
