import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  define: {
    'process.env': {}
  },
  build: {
    // Don't externalize any dependencies to ensure everything is bundled
    commonjsOptions: {
      include: [/node_modules/]
    }
  }
});
