var webpack = require('webpack');
var path = require('path');
var fs = require('fs');
var glob = require('glob');

var nodeModules = {};
fs.readdirSync('node_modules')
  .filter(function (x) {
    return ['.bin'].indexOf(x) === -1;
  })
    .forEach(function (mod) {
      nodeModules[mod] = 'commonjs ' + mod;
    });

var walkSync = function (dir, reg, result) {
  var files = fs.readdirSync(dir);
  result=result||{};
  files.forEach(function (file) {
    if (fs.statSync(dir + '/' + file).isDirectory()) {
      walkSync(dir + '/' + file,  reg, result);
    } else {
      if (file.match(reg)) {
        var entry = dir + '/' + file;
        var out = entry.replace(/^\.\//, '');
        result[out]=entry;

        // filelist.push(dir + '/' + file);
        //
      }
    }
  });

  return result;
};

var entries = walkSync('./server', /test\.js$/);

module.exports = {
  entry: entries,
  target: 'node',
  output: {
    path: './test',
    filename: '[name].js',
  },
  devtool: 'sourcemap',
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
    alias: {
      'app-config': path.join(__dirname, 'config', 'development'),
    },
  },
  plugins: [
    new webpack.BannerPlugin('require("source-map-support").install();', { raw: true, entryOnly: false }),
  ],
  externals: nodeModules,
};
