import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    vue(),
    dts({
      include: ['src/**/*.ts', 'src/**/*.vue'],
      outDir: 'dist',
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'AiVueChatbot',
      fileName: (format) => `index.${format === 'es' ? 'mjs' : 'js'}`,
    },
    rollupOptions: {
      external: ['vue', '@aivue/core', 'markdown-it', 'uuid'],
      output: {
        globals: {
          vue: 'Vue',
          '@aivue/core': 'AiVueCore',
          'markdown-it': 'MarkdownIt',
          'uuid': 'uuid'
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') return 'chatbot.css';
          return assetInfo.name;
        },
      },
    },
    outDir: 'dist',
    emptyOutDir: false, // Changed to false to prevent clearing the dist directory
    sourcemap: true,
    cssCodeSplit: false, // Ensure CSS is not split
    // Make sure CSS is included in the bundle
    css: {
      // Extract all CSS to a single file
      extract: {
        filename: 'chatbot.css'
      },
    },
  },
});
