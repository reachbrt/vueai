import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  esbuildOptions(options) {
    options.resolveExtensions = ['.ts', '.js'];
  },
  format: ['cjs', 'esm'],
  dts: true, // Enable TypeScript declaration generation
  clean: true,
  external: ['vue', 'eventsource-parser'],
  sourcemap: true,
  minify: false,
  splitting: false,
  outDir: 'dist',
  outExtension({ format }) {
    return {
      js: format === 'cjs' ? '.js' : '.mjs',
    };
  },
});
