// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';
// import tsconfigPaths from 'vite-tsconfig-paths';
// import path from 'path';
// import viteCompression from 'vite-plugin-compression';

// export default defineConfig(({ mode }) => ({
//   plugins: [react(), tsconfigPaths(), viteCompression()],
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
//     minify: 'terser', // Minify JavaScript
//     terserOptions: {
//       compress: true,
//     },
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

export default defineConfig(() => {
  return {
    plugins: [react(), tsconfigPaths()],
    server: {
      port: 3000,
      proxy: {
        '/api': {
          target: 'https://itunes.apple.com',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
    build: {
      outDir: 'dist',
      sourcemap: false,
      minify: 'esbuild',
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
  };
});
