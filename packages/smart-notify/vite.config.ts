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
      name: 'AivueSmartNotify',
      formats: ['es', 'cjs'],
      fileName: (format) => format === 'es' ? 'index.mjs' : 'index.js'
    },
    rollupOptions: {
      external: ['vue', '@aivue/core', 'compromise'],
      output: {
        globals: {
          vue: 'Vue',
          '@aivue/core': 'AivueCore',
          compromise: 'nlp'
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') return 'smart-notify.css';
          return assetInfo.name || '';
        }
      }
    },
    cssCodeSplit: false
  }
});

