import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'AiVueAnalytics',
      fileName: 'index',
      formats: ['es']
    },
    rollupOptions: {
      external: [
        'vue',
        '@aivue/core',
        'chart.js',
        'vue-chartjs',
        'date-fns'
      ],
      output: {
        globals: {
          vue: 'Vue',
          '@aivue/core': 'AiVueCore',
          'chart.js': 'Chart',
          'vue-chartjs': 'VueChartJs',
          'date-fns': 'dateFns'
        }
      }
    },
    cssCodeSplit: false,
    outDir: 'dist',
    emptyOutDir: true
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
});
