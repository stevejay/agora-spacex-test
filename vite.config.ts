/// <reference types="vitest" />

import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    react({
      exclude: [/\.(stories|spec|test)\.(t|j)sx?$/, /__tests__/]
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  build: {
    minify: true,
    sourcemap: true
  },
  test: {
    exclude: ['node_modules', 'dist', '.idea', '.git', '.cache', 'e2e-tests'],
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
    coverage: {
      reporter: ['html']
    },
    clearMocks: true,
    mockReset: true,
    restoreMocks: true
  }
});
