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

function extend(a, b) {
  for (var key in b)
            if (b.hasOwnProperty(key))
                          a[key] = b[key];
  return a;
}

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

// const entries = walkSync('./server', /test\.js$/);
const entries =  extend(walkSync('./client', /test\.js$/),walkSync('./server',/test\.js$/)) ;

module.exports = {
  entry: entries,
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
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'stage-0'],
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
