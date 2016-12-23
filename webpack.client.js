module.exports = {
  entry: [
    './client/main.jsx',
  ],
  output: {
    path: './static',
    filename: 'main.bundle.js',
    publicPath: '/',
  },
  devtool: '#source-map',
  module: {
    loaders: [
      {
        test: /\.js|jsx$/,
        exclude: /node_modules/,
        loaders: ['react-hot', 'babel-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['', '.jsx', '.js', '.json'],
  },
};
