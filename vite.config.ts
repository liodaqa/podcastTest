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
import { defineConfig, loadEnv } from 'vite';
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');

  return {
    define: {
      'import.meta.env': env,
    },
    server: {
      port: 3000,
      open: true,
      proxy: {
        '/api': {
          target: 'https://itunes.apple.com', // The CORS proxy
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '/'), // Rewrite /api to /get for allorigins.win
        },
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      outDir: 'dist',
      sourcemap: mode === 'development',
    },
  };
});
