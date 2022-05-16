import commonjs from '@rollup/plugin-commonjs';
import esbuild from 'rollup-plugin-esbuild-ts';
import json from '@rollup/plugin-json';
import outputManifest from 'rollup-plugin-output-manifest';
import progress from 'rollup-plugin-progress';
import replace from '@rollup/plugin-replace';
import resolve from '@rollup/plugin-node-resolve';
import styles from 'rollup-plugin-styles';
import webWorkerLoader from 'rollup-plugin-web-worker-loader';
// import tsChecker from 'rollup-plugin-fork-ts-checker';

import typescriptPaths from './plugins/rollup-plugin-typescript-paths';
import notifier from './plugins/rollup-plugin-notifier';
import esbuildConfig from './esbuild-config';
import dll from './plugins/rollup-plugin-dll';

import { isProduction } from './env';

const output = {
  format: 'system',
  entryFileNames: isProduction ? '[name]-[hash].js' : '[name].js',
  chunkFileNames: isProduction ? 'chunk-[name]-[hash].js' : 'chunk-[name].js',
  dir: 'dist',
  sourcemap: isProduction ? false : 'inline',
  plugins: [
    isProduction ? false : notifier(),
  ],
};

const input = {
  portal: 'clients/portal/index.tsx',
  home: 'clients/home/index.tsx',
  appLand: 'clients/app-land/index.tsx',
};

const config = {
  treeshake: isProduction,
  preserveEntrySignatures: false,

  input,
  output,

  external: [
    'react',
    'react-dom',
    'react-is',
    'elkjs',

    '@formily/antd-components',
    '@formily/antd',
    '@formily/core',
    '@formily/react-schema-renderer',
    '@formily/react-shared-components',
    '@formily/react',
    '@formily/shared',
    '@formily/validator',
    'antd',
    'rxjs',
    /rxjs\/.*/,
    'moment',
    'lodash',
    // 'lodash/fp',
    'ramda',
    // 'react-use',
    // /react-use\/.*/,

    'draft-js',
    // 'html-to-draftjs',
    // 'react-draft-wysiwyg',
    'jszip',
    'react-beautiful-dnd',
    'react-dnd',
    // 'react-dnd-html5-backend',
    'react-flow-renderer',
    'xlsx',

    /@one-for-all\/.*/,
  ],

  plugins: [
    dll(),
    webWorkerLoader({
      // todo output file name has no hash
      targetPlatform: 'browser',
      inline: false,
      extensions: ['js', 'ts'],
      loadPath: '/dist',
      skipPlugins: ['rollup-plugin-output-manifest'],
    }),
    replace({
      preventAssignment: true,
      values: {
        'process.env.NODE_ENV': JSON.stringify(isProduction ? 'production' : 'development'),
      },
    }),
    resolve({
      preferBuiltins: false,
      browser: true,
      mainFields: ['module', 'main'],
    }),
    commonjs({
      ignoreDynamicRequires: false,
      ignoreTryCatch: false,
    }),
    !isProduction ? progress({ clearLine: true }) : false,
    styles({
      autoModules: /\w+\.(module|m)\.scss/,
    }),
    json(),
    typescriptPaths(),
    outputManifest(),
    esbuild(esbuildConfig),
    // tsChecker(),
  ],
};

const mobileInput = {
  mobile: 'clients/mobile/index.tsx',
};

const mobileConfig = Object.assign(
  {},
  config,
  {
    input: mobileInput,
    output: Object.assign({}, output, {
      chunkFileNames: isProduction ? 'mobile-chunk-[name]-[hash].js' : 'mobile-chunk-[name].js',
    }),
    plugins: [
      ...config.plugins.filter((plugin) => {
        return plugin.name !== 'styles' && plugin.name !== 'rollup-plugin-output-manifest';
      }),
      styles({
        autoModules: /index\.module\.scss/,
        config: {
          path: 'rollup-configs/mobile/postcss.config.js',
        },
      }),
      outputManifest({ isMerge: true }),
    ],
  },
);

export default [
  config,
  mobileConfig,
];
