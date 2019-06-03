var webpack = require('webpack');
var path = require('path');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var StaticSiteGeneratorPlugin = require('static-site-generator-webpack-plugin');
var env = process.env.WEBPACK_BUILD || 'development';

var paths = [
  '/'
];

module.exports = [
//    new CleanWebpackPlugin(['build']),
    new CopyWebpackPlugin([{ from: './docs/public/static', to: 'assets' }]),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(env)
    }),
    new webpack.NoEmitOnErrorsPlugin(),
    new ExtractTextPlugin("/assets/style.css"),
    new webpack.DllReferencePlugin({
      context: __dirname, //
      manifest: require('./manifest.json'), //
   }),
];
