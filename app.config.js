const webpack = require('webpack');
let path = require('path');
let CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
let resolve  = require('./resolve.config');

module.exports = {
  devtool: false,
  entry: {
    wisdomPark: ['babel-polyfill', './docs/wisdomPark/main/app']
  },
  
  node: {
    fs: 'empty'
  },
  
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].js',
  },
  
  plugins: [
    new CopyWebpackPlugin([{from: './docs/public/static', to: 'assets'}]),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
  
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        // Disabled because of an issue with Uglify breaking seemingly valid code:
        // https://github.com/facebookincubator/create-react-app/issues/2376
        // Pending further investigation:
        // https://github.com/mishoo/UglifyJS2/issues/2011
        comparisons: false,
        drop_debugger: true,
        drop_console: true
      },
      mangle: {
        safari10: true,
      },
      output: {
        comments: false,
        // Turned on because emoji and regex is not minified properly using default
        // https://github.com/facebookincubator/create-react-app/issues/2488
        ascii_only: true,
      },
      // sourceMap: shouldUseSourceMap,
      sourceMap:false
    }),
    
    new webpack.NoEmitOnErrorsPlugin(),
    
    // new ExtractTextPlugin('react_lz.css'),
    
    new webpack.DllReferencePlugin({
      context: __dirname,
      manifest: require('./manifest.json'),
    }),
  ],
  
  module: {
    loaders: [
      {
        test: /\.json$/,
        loaders: [
          'json-loader?cacheDirectory'
        ]
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loaders: [
          'babel-loader?cacheDirectory'
        ]
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader','postcss-loader']
      },
      {
        test: /\.jpg$/,
        loader: 'file-loader'
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|svg)$/,
        loader: 'url-loader?limit=100000'
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        loader: 'style-loader!css-loader!sass-loader!postcss-loader'
      },
    ]
  },
  resolve,
};

