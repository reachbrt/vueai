import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

export default defineConfig({
  plugins: [vue()],
  define: {
    'process.env': {}
  },
  resolve: {
    alias: {
      '@aivue/core': resolve(__dirname, '../packages/core/dist'),
      '@aivue/chatbot': resolve(__dirname, '../packages/chatbot/dist'),
      '@aivue/autosuggest': resolve(__dirname, '../packages/autosuggest/dist'),
      '@aivue/smartform': resolve(__dirname, '../packages/smartform/dist')
    }
  },
  build: {
    // Don't externalize any dependencies to ensure everything is bundled
    commonjsOptions: {
      include: [/node_modules/]
    }
  }
});
