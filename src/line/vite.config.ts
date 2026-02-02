import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        // Environment variables for OpenRouter AI
        'import.meta.env.VITE_OPENROUTER_API_KEY': JSON.stringify(env.VITE_OPENROUTER_API_KEY),
        // Environment variables for LIFF
        'import.meta.env.VITE_LIFF_ID': JSON.stringify(env.VITE_LIFF_ID),
        // Backend API URL
        'import.meta.env.VITE_API_URL': JSON.stringify(env.VITE_API_URL || 'http://localhost:8080')
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
