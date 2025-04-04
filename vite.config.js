import { defineConfig } from 'vite';
import { resolve } from 'path';
import { readdirSync, statSync } from 'fs';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import VitePluginSvgSpritemap from '@spiriit/vite-plugin-svg-spritemap';
import handlebars from 'vite-plugin-handlebars';

export const additionalFiles = Object.fromEntries(
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
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'public/index.html'),
        ...additionalFiles,
      },
      output: {
        assetFileNames: ({ name }) => {
          const ext = name.split('.').pop();
          if (['woff2', 'woff', 'ttf', 'eot'].includes(ext)) {
            return 'fonts/[name].[ext]';
          }
          return '[ext]/[name].[ext]';
        },
        entryFileNames: 'js/[name].js',
      },
    },
    minify: false,
  },
  plugins: [
    handlebars({
      context: {
        user: {
          name: 'John Doe',
          age: 30,
          location: { city: 'Moscow', country: 'Russia' }
        }
      },
      partialDirectory: resolve(__dirname, 'src/blocks'),
    }),
    ...(readdirSync('src/fonts').length
      ? viteStaticCopy({
          targets: [
            {
              src: './src/fonts/*',
              dest: resolve(__dirname, 'assets/fonts/'),
            },
          ],
        })
      : []),
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
