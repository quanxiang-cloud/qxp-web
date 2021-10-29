import { isProduction } from './env';

export default {
  // All options are optional
  include: /\.[jt]sx?$/, // default, inferred from `loaders` option
  exclude: /node_modules/, // default
  sourceMap: false, // default
  minify: isProduction,
  target: 'es2017', // default, or 'es20XX', 'esnext'
  jsx: 'transform', // default, or 'preserve'
  jsxFactory: 'React.createElement',
  jsxFragment: 'React.Fragment',
  // Like @rollup/plugin-replace
  define: {
    'process.env.NODE_ENV': JSON.stringify(isProduction ? 'production' : 'dev'),
    __VERSION__: '"x.y.z"',
  },
  tsconfig: 'tsconfig.json', // default
  // Add extra loaders
  loaders: {
    // Add .json files support
    // require @rollup/plugin-commonjs
    '.json': 'json',
    // Enable JSX in .js files too
    '.js': 'jsx',
  },
};
