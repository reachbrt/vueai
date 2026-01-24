import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    vue(),
    dts({
      insertTypesEntry: true,
      rollupTypes: true,
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'AiVueGuidedForm',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'mjs' : 'js'}`,
    },
    rollupOptions: {
      external: ['vue', 'vue-demi', '@aivue/core'],
      output: {
        globals: {
          vue: 'Vue',
          'vue-demi': 'VueDemi',
          '@aivue/core': 'AiVueCore',
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') return 'guided-form.css';
          return assetInfo.name || '';
        },
      },
    },
    sourcemap: true,
  },
});

