import { defineConfig } from 'vite';
import { resolve } from 'path';
import { readdirSync, statSync } from 'fs';
import esbuild from 'esbuild';
import VitePluginSvgSpritemap from '@spiriit/vite-plugin-svg-spritemap';
import handlebars from 'vite-plugin-handlebars';

const additionalFiles = Object.fromEntries(
  readdirSync(resolve(__dirname, 'src/js'))
    .filter((file) => file.endsWith('.js'))
    .map((file) => [file.replace('.js', ''), `src/js/${file}`]),
);

const sprites = readdirSync('src/sprites').filter((file) =>
  statSync(`src/sprites/${file}`).isDirectory(),
);

export default defineConfig({
  root: './',
  build: {
    outDir: 'assets',
    minify: false,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'public/index.html'),
        ...additionalFiles,
      },
      output: [
        {
          assetFileNames: ({ name }) => {
            const ext = name.split('.').pop();
            if (['woff2', 'woff', 'ttf', 'eot'].includes(ext)) {
              return 'fonts/[name].[ext]';
            }
            return '[ext]/[name].[ext]';
          },
          entryFileNames: 'js/[name].js',
        },
        {
          assetFileNames: ({ name }) => {
            const ext = name.split('.').pop();
            if (['woff2', 'woff', 'ttf', 'eot'].includes(ext)) {
              return 'fonts/[name].[ext]';
            }
            return '[ext]/[name].min.[ext]';
          },
          entryFileNames: 'js/[name].min.js',
        },
      ],
    },
  },
  plugins: [
    {
      name: 'minify-only-min-files',
      apply: 'build',
      enforce: 'post',
      async generateBundle(_, bundle) {
        for (const [file, chunk] of Object.entries(bundle)) {
          const isMinJs = file.endsWith('.min.js') && chunk.type === 'chunk';
          const isMinCss = file.endsWith('.min.css') && chunk.type === 'asset';

          if (isMinJs || isMinCss) {
            const result = await esbuild.transform(
              isMinJs ? chunk.code : chunk.source.toString(),
              {
                minify: true,
                loader: isMinJs ? 'js' : 'css',
                legalComments: 'none', // remove all comments
              },
            );

            chunk[isMinJs ? 'code' : 'source'] = result.code;
          }
        }
      },
    },
    handlebars({
      context: {
        user: {
          name: 'John Doe',
          age: 30,
          location: { city: 'Moscow', country: 'Russia' },
        },
      },
      partialDirectory: resolve(__dirname, 'src/blocks'),
    }),
    ...sprites.map((sprite) =>
      VitePluginSvgSpritemap(`./src/sprites/${sprite}/*.svg`, {
        output: {
          filename: `../sprites/${sprite}.[ext]`,
          view: false,
          use: true,
        },
      }),
    ),
  ],
});
