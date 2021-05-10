const path = require('path');
const webpack=require('webpack');

module.exports={
  mode: "development",
  entry: {
    vendor: [
      '@formily/antd',
      '@formily/antd-components',
      '@QCFE/lego-ui',
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  output: {
    filename: "vendor.bundle.js",
    path: path.join(__dirname, 'dist'),
    library: '[name]_[fullhash]'
  },
  plugins: [
    new webpack.DllPlugin({
      path: path.join(__dirname, 'dist/vendor-manifest.json'),
      name: '[name]_[fullhash]',
    })
  ]
}
