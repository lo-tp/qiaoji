module.exports = {
  entry: './client/main.jsx',
  output: {
    path: './static',
    filename: 'main.bundle.js',
  },
  devtool: '#source-map',
  module: {
    loaders: [
      {
        test: /\.js|jsx$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'react'],
        },
      },
    ],
  },
  resolve: {
    extensions: ['', '.jsx', '.js', '.json'],
  },
};
