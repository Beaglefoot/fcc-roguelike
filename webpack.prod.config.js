// path.resolve provides absolute path which is required
// in output.path and module.loaders inclusions
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

const devModuleConfig = require('./webpack.config.js');

// Remove React Hot Loader from production config
const { rules } = devModuleConfig.module;
const babelIndex = rules.findIndex(rule => rule.loader === 'babel-loader');
let { plugins } = rules[babelIndex].options;

rules[babelIndex].options.plugins = plugins.filter(plugin => plugin !== 'react-hot-loader/babel');



module.exports = Object.assign({}, devModuleConfig, {
  entry: './src/index.jsx',

  output: {
    path: path.resolve(__dirname),
    filename: 'bundle.js'
  },

  module: { rules },

  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html'
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    // new webpack.optimize.UglifyJsPlugin()
  ]
});
