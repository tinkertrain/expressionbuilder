/* eslint-disable no-var */
var path = require('path');
var RewirePlugin = require('rewire-webpack');

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine-ajax', 'jasmine', 'sinon'],
    files: [
      './test/**/*.js'
    ],
    preprocessors: {
      './test/**/*.js': ['webpack', 'sourcemap']
    },
    webpack: {
      module: {
        loaders: [
          {
            test: /\.js?$/,
            loaders: ['babel?stage=0'],
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
          }
        ],
        postLoaders: [
          {
            test: /\.js$/,
            loaders: ['istanbul-instrumenter'],
            exclude: /(test|node_modules)\//
          }
        ]
      },
      resolve: {
        root: [
          path.join(__dirname, 'src'),
          'node_modules'
        ]
      },
      plugins: [
        new RewirePlugin()
      ]
    },
    webpackMiddleware: {
      noInfo: true
    },
    plugins: [
      'karma-webpack',
      'karma-jasmine',
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-coverage',
      'karma-jasmine-ajax',
      'karma-sinon',
      'karma-sourcemap-loader',
      'karma-nyan-reporter',
      'istanbul-instrumenter-loader'
    ],
    reporters: ['nyan', 'coverage'],
    nyanReporter: {
      suppressErrorReport: false
    },
    coverageReporter: {
      type: 'html',
      dir: 'coverage/'
    },
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false
  });
};
