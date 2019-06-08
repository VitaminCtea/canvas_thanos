const path = require('path');
const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

const app = express();
const dist_dir = path.join(__dirname, './src');
const port = 4000;
const config = require('./webpack.dev.js');
const compiler = webpack(config);
app.use(webpackDevMiddleware(compiler, {
  publicPath: config.output.publicPath,
  // quiet: true,  //  设置为true禁用所有控制台日志记录。
  noInfo: true, //  设置为true禁用信息控制台日志记录...
}));
app.use(webpackHotMiddleware(compiler, {
  log: console.log,
  heartbeat: 2000,
}));
app.use(express.static(dist_dir));
app.listen(port, function () {
  console.log('Service started successfully, localhost: ' + port);
});