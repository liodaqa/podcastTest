// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';
// import tsconfigPaths from 'vite-tsconfig-paths';
// import path from 'path';

// export default defineConfig(({ mode }) => ({
//   plugins: [react(), tsconfigPaths()],
//   server: {
//     port: 3000,
//     proxy: {
//       '/api': {
//         target: 'https://itunes.apple.com',
//         changeOrigin: true,
//         rewrite: (path) => path.replace(/^\/api/, ''),
//       },
//     },
//   },
//   build: {
//     outDir: 'dist',
//     sourcemap: false,
//   },
//   define: {
//     'process.env.NODE_ENV': JSON.stringify(mode),
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
    port: 3000,
    strictPort: true,
    proxy: {
      '/lookup': {
        target: 'https://itunes.apple.com',
        changeOrigin: true,
        rewrite: (path) => path, // No need to modify if paths match
        secure: false,
      },
      '/us/rss': {
        target: 'https://itunes.apple.com',
        changeOrigin: true,
        secure: false,
      },
    },
    // proxy: {
    //   '/api': {
    //     target: 'https://itunes.apple.com',
    //     changeOrigin: true,
    //     rewrite: (path) => path.replace(/^\/api/, ''),
    //     // '/api': {
    //     //   target: 'https://api.codetabs.com/v1/proxy/?quest=', // ✅ Alternative CORS Proxy
    //     //   changeOrigin: true,
    //     //   rewrite: (path) => path.replace(/^\/api/, ''),
    //   },
    // },
    // preview: {
    //   port: 5000,
    //   strictPort: true,
    // },
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
      '@': path.resolve(__dirname, 'src'),
    },
  },
}));
