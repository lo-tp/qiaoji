module.exports = {
  entry: './server/main.js',
  target: 'node',
  output: {
    path: './bin',
    filename: 'main.bundle.js',
  },
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
};
