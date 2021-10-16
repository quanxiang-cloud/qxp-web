const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WebpackNotifierPlugin = require('webpack-notifier');
// const WebpackBar = require('webpackbar');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
// const {BundleAnalyzerPlugin}=require('webpack-bundle-analyzer');

module.exports={
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',

  entry: {
    portal: './clients/portal/index.tsx',
    'login-by-password': './clients/login/password.ts',
    'login-by-captcha': './clients/login/captcha.ts',
    'reset-password': './clients/login/reset-password',
    'retrieve-password': './clients/login/retrieve-password',
    404: './clients/404/index.ts',
    home: './clients/home/index.tsx',
  },

  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
    chunkFilename: '[name].js',
    publicPath: '/dist/',
  },

  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.css', '.scss'],
    plugins: [new TsconfigPathsPlugin()],
  },

  module: {
    rules: [
      {
        test: /\.s[ac]ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          { loader: 'css-loader', options: { url: false } },
          { loader: 'postcss-loader' },
          { loader: 'sass-loader' },
        ],
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          { loader: 'css-loader', options: { url: false } },
          { loader: 'postcss-loader' },
        ],
      },
      {
        test: /\.tsx?$/,
        include: [path.resolve(__dirname, 'clients')],
        use: ['swc-loader'],
      },
    ],
  },

  optimization: {
    // splitChunks: {
    //   chunks: "all",
    //   cacheGroups: {
    //     vendors: {
    //       test: /node_modules/,
    //       chunks: "initial",
    //       priority: 10,
    //       reuseExistingChunk: true
    //     }
    //   }
    // }
  },

  plugins: [
    // new WebpackBar(),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      ignoreOrder: true,
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
      chunks: ['404'],
      template: './clients/templates/404.html',
      filename: `${__dirname}/dist/templates/404.html`,
    }),
    new HtmlWebpackPlugin({
      inject: false,
      chunks: ['reset-password'],
      template: './clients/templates/reset-password.html',
      filename: `${__dirname}/dist/templates/reset-password.html`,
    }),
    new HtmlWebpackPlugin({
      inject: false,
      chunks: ['retrieve-password'],
      template: './clients/templates/retrieve-password.html',
      filename: `${__dirname}/dist/templates/retrieve-password.html`,
    }),
    new HtmlWebpackPlugin({
      inject: false,
      chunks: ['home'],
      template: './clients/templates/home.html',
      filename: `${__dirname}/dist/templates/home.html`,
    }),
    new WebpackNotifierPlugin({ alwaysNotify: true }),
    // new BundleAnalyzerPlugin(),
  ],
};
