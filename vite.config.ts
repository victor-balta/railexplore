import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
        proxy: {
          '/api/deepseek': {
            target: 'https://api.deepseek.com',
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api\/deepseek/, ''),
            configure: (proxy) => {
              proxy.on('proxyReq', (proxyReq) => {
                if (env.DEEPSEEK_API_KEY) {
                  proxyReq.setHeader('Authorization', `Bearer ${env.DEEPSEEK_API_KEY}`);
                }
              });
            }
          }
        }
      },
      plugins: [vue()],
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
