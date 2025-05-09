import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  define: {
    'process.env': {}
  },
  base: '/vueai/', // Set the base path for GitHub Pages
  build: {
    commonjsOptions: {
      include: [/node_modules/]
    },
    rollupOptions: {
      // Make sure to externalize deps that shouldn't be bundled
      external: ['vue'],
      output: {
        // Global vars to use in UMD build for externalized deps
        globals: {
          vue: 'Vue'
        }
      }
    }
  }
});
