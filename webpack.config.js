const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WebpackNotifierPlugin = require('webpack-notifier');
const WebpackBar = require('webpackbar');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

// {
//   mode: 'production' | 'development';
// }
module.exports = function({ mode }) {
  return {
    mode: mode,
    watch: mode !== 'production',
    bail: mode === 'production',
    devtool: mode === 'production' ? false : 'source-map',
    entry: {
      portal: './clients/portal/index.tsx',
      register: './clients/register/index.ts',
      'login-password': './clients/login/password.ts',
      'login-captcha': './clients/login/captcha.ts',
      '404': './clients/404/index.ts',
    },

    output: {
      path: path.join(__dirname, 'dist'),
      filename: mode === 'production' ? '[name].[hash].js' : '[name].js',
      chunkFilename: mode === 'production' ? '[name].[chunkhash].js' : '[name].js',
      publicPath: '/dist/',
    },

    resolve: {
      // Add '.ts' and '.tsx' as resolvable extensions.
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
      plugins: [new TsconfigPathsPlugin()]
    },

    module: {
      rules: [
        {
          test: /\.s[ac]ss$/,
          exclude: /node_modules/,
          use: [
            MiniCssExtractPlugin.loader,
            { loader: 'css-loader' },
            {
              loader: 'postcss-loader',
              options: {
                plugins: [
                  require('autoprefixer')(),
                ],
              },
            },
            { loader: 'sass-loader' },
          ],
        },
        {
          test: /\.ts(x?)$/,
          exclude: /node_modules/,
          use: [
            { loader: 'ts-loader' },
          ],
        },
        // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
        {
          enforce: 'pre',
          test: /\.js$/,
          loader: 'source-map-loader',
        },
      ],
    },
    
    plugins: [
      new WebpackBar(),
      new MiniCssExtractPlugin({
        filename: mode === 'production' ? '[name].[contenthash].css' : '[name].css',
      }),
      new HtmlWebpackPlugin({
        inject: false,
        chunks: ['portal'],
        template: './clients/templates/portal.html',
        filename: `${__dirname}/dist/templates/portal.html`,
      }),
      new HtmlWebpackPlugin({
        inject: false,
        chunks: ['login-password'],
        template: './clients/templates/login-password.html',
        filename: `${__dirname}/dist/templates/login-password.html`,
      }),
      new HtmlWebpackPlugin({
        inject: false,
        chunks: ['login-captcha'],
        template: './clients/templates/login-captcha.html',
        filename: `${__dirname}/dist/templates/login-captcha.html`,
      }),
      new HtmlWebpackPlugin({
        inject: false,
        chunks: ['register'],
        template: './clients/templates/register.html',
        filename: `${__dirname}/dist/templates/register.html`,
      }),
      new HtmlWebpackPlugin({
        inject: false,
        template: './clients/templates/404.html',
        filename: `${__dirname}/dist/templates/404.html`,
      }),
      mode !== 'production' ? new WebpackNotifierPlugin({ alwaysNotify: true }) : null,
    ].filter(Boolean),
  };
};
