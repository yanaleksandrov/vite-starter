import { defineConfig } from 'vite';
import { resolve } from 'path';
import { readdirSync, statSync } from 'fs';
import eslint from 'vite-plugin-eslint';
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

export default defineConfig({
  root: './',
  build: {
    outDir: 'assets',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        ...additionalFiles,
      },
      output: {
        assetFileNames: '[ext]/[name].[ext]',
        entryFileNames: 'js/[name].js',
        chunkFileNames: 'js/[name].js',
      },
    },
    minify: false, // 'esbuild',
  },
  plugins: [
    eslint({
      cache: false,
      fix: true,
    }),
    viteStaticCopy({
      targets: [
        {
          src: './src/fonts/*',
          dest: resolve(__dirname, 'assets/fonts/'),
        },
      ],
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
