const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require("terser-webpack-plugin");
const WebpackNotifierPlugin = require('webpack-notifier');
const WebpackBar = require('webpackbar');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

// env: 'production' | 'development';
module.exports = function (env) {
  return {
    mode: env.mode ? env.mode : 'development',
    watch: env.mode !== 'production',
    bail: env.mode === 'production',
    devtool: env.mode === 'production' ? false : 'source-map',

    entry: {
      portal: './clients/portal/index.tsx',
      register: './clients/register/index.ts',
      'login-by-password': './clients/login/password.ts',
      'login-by-captcha': './clients/login/captcha.ts',
      'reset-password': './clients/login/reset-password',
      404: './clients/404/index.ts',
    },

    output: {
      path: path.join(__dirname, 'dist'),
      filename: env.mode === 'production' ? '[name].[fullhash].js' : '[name].js',
      chunkFilename: env.mode === 'production' ? '[name].[chunkhash].js' : '[name].js',
      publicPath: '/dist/',
    },

    resolve: {
      // Add '.ts' and '.tsx' as resolvable extensions.
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
      plugins: [new TsconfigPathsPlugin()],
    },

    module: {
      rules: [
        {
          test: /\.s[ac]ss$/,
          exclude: /node_modules/,
          use: [
            MiniCssExtractPlugin.loader,
            { loader: 'css-loader' },
            { loader: 'postcss-loader', },
            { loader: 'sass-loader' },
          ],
        },
        {
          test: /\.css$/,
          use: [
            MiniCssExtractPlugin.loader,
            { loader: 'css-loader' },
            { loader: 'postcss-loader', },
          ],
        },
        {
          test: /\.ts(x?)$/,
          exclude: /node_modules/,
          use: [{ loader: 'ts-loader' }],
        },
        // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
        {
          enforce: 'pre',
          test: /\.js$/,
          loader: 'source-map-loader',
        },
      ],
    },

    optimization: {
      // minimize: true,
      minimizer: [
        new CssMinimizerPlugin(),
        new TerserPlugin(),
      ],
    },

    plugins: [
      new WebpackBar(),
      new MiniCssExtractPlugin({
        filename: env.mode === 'production' ? '[name].[contenthash].css' : '[name].css',
      }),
      new HtmlWebpackPlugin({
        inject: false,
        chunks: ['portal'],
        template: './clients/templates/portal.html',
        filename: `${__dirname}/dist/templates/portal.html`,
      }),
      new HtmlWebpackPlugin({
        inject: false,
        chunks: ['login-by-password'],
        template: './clients/templates/login-by-password.html',
        filename: `${__dirname}/dist/templates/login-by-password.html`,
      }),
      new HtmlWebpackPlugin({
        inject: false,
        chunks: ['login-by-captcha'],
        template: './clients/templates/login-by-captcha.html',
        filename: `${__dirname}/dist/templates/login-by-captcha.html`,
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
      new HtmlWebpackPlugin({
        inject: false,
        chunks: ['reset-password'],
        template: './clients/templates/reset-password.html',
        filename: `${__dirname}/dist/templates/reset-password.html`,
      }),
      env !== 'production' ? new WebpackNotifierPlugin({ alwaysNotify: true }) : null,
    ].filter(Boolean),
  };
};
