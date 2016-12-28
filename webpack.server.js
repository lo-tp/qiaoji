var webpack = require('webpack');
var path = require('path');
var fs = require('fs');

var nodeModules = {};
fs.readdirSync('node_modules')
  .filter(function(x) {
        return ['.bin'].indexOf(x) === -1;
          })
    .forEach(function(mod) {
          nodeModules[mod] = 'commonjs ' + mod;
});

module.exports = {
  entry: './server/main.js',
  target: 'node',
  output: {
    path: './bin',
    filename: 'main.bundle.js',
  },
  devtool:'sourcemap',
  module: {
    loaders: [
      {
        test: /\.json$/,
        loader: 'json-loader',
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components|client)/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015'],
        },
      },
    ],
  },
  resolve: {
    alias:{
      config: path.join(__dirname, 'config', 'development'),
    },
  },
  plugins: [
    new webpack.BannerPlugin('require("source-map-support").install();',{ raw: true, entryOnly: false }),
  ],
  externals: nodeModules,
};
