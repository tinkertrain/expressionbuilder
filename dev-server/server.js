/* eslint-disable no-var */
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');

var config = require('../webpack.config');

new WebpackDevServer(webpack(config), {
  contentVase: __dirname,
  publicPath: config.output.publicPath,
  hot: true,
  historyApiFallback: true,
  stats: { colors: true }
})
.listen(config.port, config.ip, function (err) {
  if(err) {
    console.log(err);
  }

  console.log('Listening at ' + config.ip + ':' + config.port);
});
