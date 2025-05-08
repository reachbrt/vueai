import { defineConfig } from 'tsup';
import { readFileSync } from 'fs';
import { join } from 'path';

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
  esbuildOptions(options) {
    options.loader = {
      ...options.loader,
      '.vue': 'ts', // Handle Vue files
    };
  },
});
