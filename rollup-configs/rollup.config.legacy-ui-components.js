import commonjs from '@rollup/plugin-commonjs';
import esbuild from 'rollup-plugin-esbuild-ts';
import json from '@rollup/plugin-json';
import progress from 'rollup-plugin-progress';
import replace from '@rollup/plugin-replace';
import resolve from '@rollup/plugin-node-resolve';
import styles from 'rollup-plugin-styles';
import webWorkerLoader from 'rollup-plugin-web-worker-loader';

import typescriptPaths from './plugins/rollup-plugin-typescript-paths';
import esbuildConfig from './esbuild-config';
// import { isProduction } from "./env";
const isProduction = true;

const config = {
  treeshake: isProduction,
  // preserveEntrySignatures: false,

  input: 'clients/lib/legacy/legacy-ui-components.ts',
  output: {
    format: 'system',
    // entryFileNames: isProduction ? '[name]-[hash].js' : '[name].js',
    // chunkFileNames: isProduction ? 'chunk-[name]-[hash].js' : 'chunk-[name].js',
    file: './tmp/legacy-ui-component-20220513.js',
    sourcemap: isProduction ? false : 'inline',
  },

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
    esbuild(esbuildConfig),
    // tsChecker(),
  ],
};

export default config;
