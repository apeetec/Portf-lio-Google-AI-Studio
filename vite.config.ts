import tailwindcss from '@tailwindcss/vite';
import legacy from '@vitejs/plugin-legacy';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    base: '/Portf-lio-Google-AI-Studio/',
    plugins: [
      react(),
      tailwindcss(),
      // Transpiles modern JS for older iOS Safari (iPhone 11 = iOS 13-15).
      // Generates a <script nomodule> legacy bundle + injects polyfills automatically.
      legacy({
        targets: ['ios >= 13'],
        additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
      }),
    ],
    css: {
      // Use Lightning CSS to downgrade modern CSS (oklch, @property, color-mix, etc.)
      // to syntax supported by iOS Safari 13+.
      transformer: 'lightningcss',
      lightningcss: {
        targets: {
          // Safari 13 = iOS 13 (iPhone 11 ships with iOS 13)
          safari: (13 << 16) | (0 << 8),
        },
      },
    },
    build: {
      cssMinify: 'lightningcss',
    },
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'import.meta.env.VITE_API_URL': JSON.stringify(env.VITE_API_URL ?? ''),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      port: 3000,
      host: 'localhost',
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true'
        ? { host: 'localhost', port: 3000, clientPort: 3000 }
        : false,
    },
  };
});
