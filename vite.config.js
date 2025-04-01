import { defineConfig } from 'vite';
import { resolve } from 'path';
import { existsSync, readdirSync, statSync } from 'fs';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import VitePluginSvgSpritemap from '@spiriit/vite-plugin-svg-spritemap';

const additionalFiles = Object.fromEntries(
  readdirSync(resolve(__dirname, 'src/js'))
    .filter((file) => file.endsWith('.js'))
    .map((file) => [file.replace('.js', ''), `src/js/${file}`]),
);

const sprites = readdirSync('src/sprites').filter((file) =>
  statSync(`src/sprites/${file}`).isDirectory(),
);

// Автоматически собираем все HTML файлы из папки src/pages
const htmlPages = existsSync(resolve(__dirname, 'src/pages'))
  ? Object.fromEntries(
      readdirSync(resolve(__dirname, 'src/pages'))
        .filter((file) => file.endsWith('.html'))
        .map((file) => [file.replace('.html', ''), resolve(__dirname, file)]),
    )
  : {};

export default defineConfig({
  root: './',
  build: {
    outDir: 'assets',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        ...htmlPages,
        ...additionalFiles,
      },
      output: {
        assetFileNames: (chunkInfo) => {
          const ext = chunkInfo.name.split('.').pop();
          if (ext === 'css') {
            return 'css/[name].[ext]';
          } else if (['woff2', 'woff', 'ttf', 'eot'].includes(ext)) {
            return 'fonts/[name].[ext]';
          } else {
            return '[ext]/[name].[ext]';
          }
        },
        entryFileNames: 'js/[name].js',
      },
    },
    minify: false, // 'esbuild',
  },
  plugins: [
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
