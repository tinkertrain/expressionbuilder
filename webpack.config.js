/* eslint-disable no-var */
var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var merge = require('./lib/merge');

var TARGET = process.env.TARGET;
var ROOTH_PATH = path.resolve(__dirname);

var usingReact = true;

var common = {
  entry: [
    path.join(ROOTH_PATH, 'src/index')
  ],

  output: {
    filename: 'bundle.js',
    path: path.resolve(ROOTH_PATH, 'build')
  },

  resolve: {
    extensions: ['', '.js', '.jsx', '.scss'],
    modulesDirectories: ['src', 'node_modules'],
    alias: {}
  }
};

var mergeConfig = merge.bind(null, common);

if (TARGET === 'build') {
  var sassLoaders = [
    'css-loader',
    'autoprefixer-loader?browsers=last 2 version',
    'sass-loader?includePaths[]=' + path.resolve(ROOTH_PATH, './src')
  ];

  module.exports = mergeConfig({
    devtool: 'source-map',

    module: {
      loaders: [
        {
          test: /\.jsx?$/,
          loader: 'babel?stage=0',
          exclude: /node_modules/
        },
        {
          test: /\.css$/,
          loaders: [
            'style-loader',
            'css-loader',
            'autoprefixer-loader?browsers=last 2 version'
          ]
        },
        {
          test: /\.scss$/,
          loaders: [
            'style-loader',
            'css-loader',
            'autoprefixer-loader?browsers=last 2 version',
            'sass-loader?includePaths[]=' + path.resolve(__dirname, './src')
          ],
          loader: ExtractTextPlugin.extract('style-loader', sassLoaders.join('!'))
        },
        {
          test: /\.(jpe?g|png|gif|svg)$/i,
          loaders: [
            'file?hash=sha512&digest=hex&name=[hash].[ext]',
            'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false'
          ]
        }
      ]
    },

    plugins: [
      new ExtractTextPlugin('[name].css'),
      new webpack.DefinePlugin({
        'process.env': {
          'NODE_ENV': JSON.stringify('production')
        }
      }),
      new webpack.optimize.UglifyJsPlugin()
    ]
  });
}

if (TARGET === 'dev') {
  var IP = '0.0.0.0';
  var PORT = 8080;

  module.exports = mergeConfig({
    ip: IP,
    port: PORT,

    devtool: 'eval-source-map',

    entry: [
      'webpack-dev-server/client?http://' + IP + ':' + PORT,
      'webpack/hot/only-dev-server'
    ],

    output: {
      path: __dirname,
      filename: 'bundle.js',
      publicPath: '/'
    },

    module: {
      loaders: [
        {
          test: /\.jsx?$/,
          loaders: usingReact ?
            ['react-hot', 'babel?stage=0'] :
            ['babel?stage=0'],
          exclude: /node_modules/
        },
        {
          test: /\.scss$/,
          loaders: [
            'style-loader',
            'css-loader',
            'autoprefixer-loader?browsers=last 2 version',
            'sass-loader?includePaths[]=' + path.resolve(__dirname, './src')
          ]
        },
        {
          test: /\.css$/,
          loaders: [
            'style-loader',
            'css-loader',
            'autoprefixer-loader?browsers=last 2 version'
          ]
        },
        {
          test: /\.(jpe?g|png|gif|svg)$/i,
          loaders: [
            'file?hash=sha512&digest=hex&name=[hash].[ext]',
            'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false'
          ]
        }
      ]
    },

    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin(),
      new HtmlWebpackPlugin({
        title: usingReact ? 'React App' : 'App',
        template: './src/index.html'
      })
    ]

  });
}

