import { defineConfig } from 'vite';
import { resolve } from 'path';
import { readFileSync } from 'fs';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';

// Parse package.json to get dependencies and peerDependencies
const pkg = JSON.parse(
  readFileSync(resolve(__dirname, 'package.json'), 'utf-8')
);

const external = [
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {})
];

export default defineConfig({
  plugins: [
    vue(),
    dts({
      include: ['src/**/*.ts', 'src/**/*.vue'],
      outDir: 'dist',
      staticImport: true,
      skipDiagnostics: false,
      logDiagnostics: true
    })
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'AiVueSmartForm',
      fileName: (format) => `index.${format === 'es' ? 'mjs' : 'js'}`
    },
    rollupOptions: {
      external,
      output: {
        globals: {
          vue: 'Vue',
          '@aivue/core': 'AiVueCore'
        }
      }
    },
    sourcemap: true,
    minify: false
  }
});
