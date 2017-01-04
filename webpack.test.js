const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const glob = require('glob');

const nodeModules = {};
fs.readdirSync('node_modules')
  .filter(x => ['.bin'].indexOf(x) === -1)
    .forEach(mod => {
      nodeModules[mod] = `commonjs ${mod}`;
    });

const walkSync = function (dir, reg, result) {
  const files = fs.readdirSync(dir);
  result = result || {};
  files.forEach(file => {
    if (fs.statSync(`${dir}/${file}`).isDirectory()) {
      walkSync(`${dir}/${file}`, reg, result);
    } else if (file.match(reg)) {
      const entry = `${dir}/${file}`;
      const out = entry.replace(/^\.\//, '');
      result[out] = entry;

        // filelist.push(dir + '/' + file);
        //
    }
  });

  return result;
};

const entries = walkSync('./server', /test\.js$/);

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
