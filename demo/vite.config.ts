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
      '@aivue/smartform': resolve(__dirname, '../packages/smartform/dist'),
      '@aivue/smart-datatable': resolve(__dirname, '../packages/smart-datatable/dist'),
      '@aivue/voice-actions': resolve(__dirname, '../packages/voice-actions/dist'),
      '@aivue/smart-notify': resolve(__dirname, '../packages/smart-notify/dist'),
      '@aivue/smart-notify/style.css': resolve(__dirname, '../packages/smart-notify/dist/smart-notify.css')
      // Note: @aivue/emotion-ui, @aivue/doc-intelligence, and @aivue/predictive-input
      // are now using npm packages instead of local aliases
    }
  },
  optimizeDeps: {
    include: ['compromise'],
    exclude: []
  },
  build: {
    // Don't externalize any dependencies to ensure everything is bundled
    commonjsOptions: {
      include: [/node_modules/]
    }
  }
});
