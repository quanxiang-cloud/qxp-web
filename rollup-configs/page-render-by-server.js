import styles from 'rollup-plugin-styles';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import progress from 'rollup-plugin-progress';
import html from '@rollup/plugin-html';
import esbuild from 'rollup-plugin-esbuild';

import esbuildConfig from './esbuild-config';
import typescriptPaths from './plugins/rollup-plugin-typescript-paths';
import { isProduction } from './env';

export const inputs = [
  ['login-by-password', './clients/login/password.ts'],
  ['login-by-captcha', './clients/login/captcha.ts'],
  ['reset-password', './clients/login/reset-password.ts'],
  ['retrieve-password', './clients/login/retrieve-password.ts'],
];

function templateRender(name) {
  return ({ files, publicPath }) => {
    const scripts = (files.js || []).map(({ fileName }) => {
      return `<script src="${publicPath}${fileName}"></script>`;
    }).join('\n');
    const links = (files.css || []).map(({ fileName }) => {
      return `<link href="${publicPath}${fileName}" rel="stylesheet">`;
    }).join('\n');

    return `
{{define "_${name}_scripts"}}${scripts}{{end}}
{{define "_${name}_links"}}${links}{{end}}`;
  };
}

export default inputs.map(([name, filePath]) => {
  return {
    input: filePath,
    output: {
      format: 'iife',
      entryFileNames: isProduction ? `${name}-[hash].js` : `${name}.js`,
      chunkFileNames: isProduction ? `${name}-[hash].js` : `${name}.js`,
      dir: 'dist',
    },

    plugins: [
      progress({ clearLine: true }),
      styles({ mode: 'extract' }),
      json(),
      resolve({
        preferBuiltins: false,
        browser: true,
        mainFields: ['main'],
      }),
      typescriptPaths(),
      html({
        fileName: `templates/_${name}_assets.html`,
        publicPath: '/dist/',
        template: templateRender(name),
      }),
      esbuild(esbuildConfig),
    ],
  };
});
