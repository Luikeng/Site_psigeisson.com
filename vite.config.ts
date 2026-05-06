import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';
import prerender from '@prerenderer/rollup-plugin';

export default defineConfig(({mode, command}) => {
  const env = loadEnv(mode, '.', '');
  const isBuild = command === 'build';
  return {
    base: '/',
    plugins: [
      react(),
      tailwindcss(),
      isBuild && prerender({
        routes: ['/', '/terapiaonline'],
        renderer: '@prerenderer/renderer-puppeteer',
        rendererOptions: {
          renderAfterDocumentEvent: 'app-rendered',
          maxConcurrentRoutes: 1,
          headless: true,
        },
      }),
    ].filter(Boolean),
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
