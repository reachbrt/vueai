import { defineConfig } from 'tsup';
import { readFileSync } from 'fs';
import { join } from 'path';
import vuePlugin from './vue-plugin';

// Parse package.json to get dependencies and peerDependencies
const pkg = JSON.parse(
  readFileSync(join(__dirname, 'package.json'), 'utf-8')
);

const external = [
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {})
];

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external,
  esbuildPlugins: [
    vuePlugin()
  ],
  // Make sure to include .vue files in the build
  outExtension({ format }) {
    return {
      js: format === 'esm' ? '.mjs' : '.js',
    };
  },
  // Ensure TypeScript files are properly processed
  tsconfig: 'tsconfig.json',
  // Define Vue constants
  define: {
    __VUE_OPTIONS_API__: 'true',
    __VUE_PROD_DEVTOOLS__: 'false'
  }
});
