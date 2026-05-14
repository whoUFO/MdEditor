import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import electron from 'vite-plugin-electron';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    electron([
      {
        entry: 'src/main/index.ts',
        onstart: (options) => options.startup(),
        vite: {
          build: {
            outDir: 'dist/main',
            rollupOptions: {
              external: ['electron', 'path', 'fs'],
              output: {
                format: 'es',
              },
            },
          },
        },
      },
      {
        entry: 'src/preload/index.ts',
        onstart: (options) => options.reload(),
        vite: {
          build: {
            outDir: 'dist/preload',
            rollupOptions: {
              external: ['electron'],
            },
          },
        },
      },
    ]),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src/renderer'),
      '@main': path.resolve(__dirname, 'src/main'),
      '@preload': path.resolve(__dirname, 'src/preload'),
      '@shared': path.resolve(__dirname, '../../packages/shared/src'),
    },
  },
  root: 'src/renderer',
  build: {
    outDir: '../../dist/renderer',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('codemirror')) return 'codemirror';
          if (id.includes('unified') || id.includes('remark') || id.includes('rehype')) return 'markdown';
          if (id.includes('react') || id.includes('react-dom') || id.includes('zustand')) return 'vendor';
        },
      },
    },
  },
});
