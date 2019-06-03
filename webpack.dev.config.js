let path = require('path');
let webpack = require('webpack');
let env = process.env.WEBPACK_BUILD || 'development';
let nginx = 'http://10.10.10.201:1180';
let nginx1 = 'http://10.10.10.201:1882';
let config = [{
  devtool: 'source-map',
  devServer: {
    contentBase: './build',
    historyApiFallback: true,
    stats: {
      chunks: false
    },
    proxy: {
      '/auth_s': {
        target: nginx,
        changeOrigin: true
      },
      '/wisdompark_s': {
        target: nginx,
        changeOrigin: true
      },
    },
  },
  entry: {
    wisdomPark:'./docs/wisdomPark/main/app'
  },
  node: {
    fs: 'empty'
  },
  output: {
    path: path.resolve(__dirname,'build'),
    filename: '[name].js',
  },

  plugins: require('./plugin.config.js'),
  module: require('./module.config.js'),
  resolve: require('./resolve.config.js')
}];

module.exports = config;

