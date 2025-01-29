// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';
// import tsconfigPaths from 'vite-tsconfig-paths';
// import path from 'path';

// export default defineConfig(() => ({
//   plugins: [react(), tsconfigPaths()],
//   server: {
//     proxy: {
//       '/api': {
//         target: 'https://itunes.apple.com',
//         changeOrigin: true,
//         rewrite: (path) => path.replace(/^\/api/, ''),
//         secure: false, // Disable SSL verification for development
//       },
//     },
//   },
//   build: {
//     outDir: 'dist',
//     sourcemap: false,
//   },
//   resolve: {
//     alias: {
//       '@': path.resolve(__dirname, 'src'),
//     },
//   },
// }));
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';

export default defineConfig(({ mode }) => ({
  plugins: [react(), tsconfigPaths()],
  server: {
    proxy: {
      '/api': {
        target: 'https://itunes.apple.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        secure: true, // Ensure SSL is respected
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: mode === 'development', // Enable sourcemaps only for development
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  define: {
    'process.env.NODE_ENV': `"${mode}"`,
  },
}));
