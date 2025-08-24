import path from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react-swc';
import { defineConfig, loadEnv } from 'vite';
import mkcert from 'vite-plugin-mkcert';
import { VitePWA } from 'vite-plugin-pwa';
import removeConsole from 'vite-plugin-remove-console';

const isRelated = (id: string, modules: string[]): boolean => {
  return modules.some((module) => id.includes(module));
};

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load environment variables based on the current mode
  const env = loadEnv(mode, process.cwd(), '');

  const basePath = env.VITE_BASE_URL || '/';
  const enableHttps = env.VITE_ENABLE_HTTPS === 'true';

  return {
    base: basePath,
    plugins: [
      react(),
      tailwindcss(),
      removeConsole(),
      enableHttps && mkcert(),
      VitePWA({
        manifest: {
          name: 'Nonogram Online & Generator',
          short_name: 'Nonogram',
          description: 'A web-based Nonogram puzzle generator and solver',
          start_url: basePath,
          display: 'standalone',
          theme_color: '#000000',
          background_color: '#000000',
          icons: [
            {
              src: 'icon.svg',
              sizes: 'any',
              type: 'image/svg+xml',
              purpose: 'any',
            },
          ],
        },
        registerType: 'autoUpdate',
        devOptions: {
          enabled: true,
          type: 'module',
        },
      }),
    ].filter(Boolean),
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      rollupOptions: {
        output: {
          // Manual chunking logic
          manualChunks: (id: string) => {
            if (id.includes('node_modules')) {
              if (isRelated(id, ['marvinj', 'rand'])) return 'vendor-logic';
              if (isRelated(id, ['motion'])) return 'vendor-motion';
              if (isRelated(id, ['radix', 'lucide', 'floating-ui', 'tailwind', 'input-otp'])) return 'vendor-ui';
              return 'vendor';
            }
            return null;
          },
        },
      },
    },
  };
});
