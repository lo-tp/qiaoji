var path = require('path');
var webpack = require('webpack');
var express = require('express');
var devMiddleware = require('webpack-dev-middleware');
var hotMiddleware = require('webpack-hot-middleware');
var config = require('./webpack.client');

var app = express();
var compiler = webpack(config);

app.use(devMiddleware(compiler, {
  publicPath: config.output.publicPath,
  historyApiFallback: true,
  noInfo: false,
}));

app.use(hotMiddleware(compiler));

app.use((req, res, next) => {
  if (req.originalUrl.match(/^\/static/)) {
    next();
  } else {
    res.sendFile(path.join(__dirname, 'static', 'index.html'));
  }
});

app.use('/static', express.static('static'));

// app.get('*', function (req, res) {
// res.sendFile(path.join(__dirname, 'static', 'index.html'));
// });

// app.get('*.css', function (req, res) {
// res.sendFile(path.join(__dirname, 'static', 'semantic.css'));
// });

app.listen(3200, function (err) {
  if (err) {
    return console.error(err);
  }

  console.log('Listening at http://localhost:3200/');
});
