import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    vue(),
    dts({
      insertTypesEntry: true,
      copyDtsFiles: true,
      outDir: 'dist'
    })
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'AiVueVoiceActions',
      formats: ['es', 'cjs'],
      fileName: (format) => {
        if (format === 'es') return 'index.mjs';
        if (format === 'cjs') return 'index.js';
        return `index.${format}.js`;
      }
    },
    rollupOptions: {
      external: ['vue', '@aivue/core'],
      output: {
        globals: {
          vue: 'Vue',
          '@aivue/core': 'AiVueCore'
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') return 'voice-actions.css';
          return assetInfo.name || 'asset';
        }
      }
    },
    cssCodeSplit: false,
    sourcemap: true
  },
  resolve: {
    alias: {
      '@aivue/core': resolve(__dirname, '../core/src')
    }
  }
});

