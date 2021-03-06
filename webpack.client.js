var webpack = require('webpack');
var path = require('path');

module.exports = {
  devtool: 'cheap-module-source-map',
  entry: [
    'whatwg-fetch',
    'react-hot-loader/patch',
    'webpack-hot-middleware/client',
    './client/main',
  ],
  output: {
    path: path.join(__dirname, 'static'),
    filename: 'main.bundle.js',
    publicPath: '/static/',
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
  ],
  module: {
    loaders: [
      {
        test: /\.scss$/,
        loaders: ['style-loader',
          'css-loader?modules=true&sourceMap=true&localIdentName=[name]__[local]--[hash:base64:5]',
          'sass-loader'],
      },
      {
        test: /\.json$/,
        loaders: ['json'],
      },
       {
        test: /\.js|jsx$/,
        exclude: /node_modules/,
        loaders: ['babel-loader'],
      },
    ],
  },
  resolve: {
    alias: {
      'app-config': path.join(__dirname, 'config', 'development'),
    },
    extensions: ['', '.jsx', '.js', '.json'],
  },
};
