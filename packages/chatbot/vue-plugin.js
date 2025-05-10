const { compile } = require('@vue/compiler-sfc');
const fs = require('fs');

// Simple Vue plugin for esbuild
function vuePlugin() {
  return {
    name: 'vue',
    setup(build) {
      build.onLoad({ filter: /\.vue$/ }, async (args) => {
        const source = await fs.promises.readFile(args.path, 'utf8');
        const { descriptor } = compile(source, {
          filename: args.path,
        });

        const script = descriptor.script || descriptor.scriptSetup;
        if (!script) {
          return {
            errors: [{ text: 'No script block found in Vue component' }],
          };
        }

        const content = script.content;
        const lang = script.lang || 'js';

        return {
          contents: content,
          loader: lang,
        };
      });
    },
  };
}

module.exports = vuePlugin;
