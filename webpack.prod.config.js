// path.resolve provides absolute path which is required
// in output.path and module.loaders inclusions
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const MinifyPlugin = require("babel-minify-webpack-plugin");
const webpack = require('webpack');

const devModuleConfig = require('./webpack.config.js');


module.exports = Object.assign({}, devModuleConfig, {
  entry: './src/index.jsx',

  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: 'dist/',
    filename: 'bundle.js'
  },

  devtool: false,

  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: '../index.html'
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new ExtractTextPlugin('style.css'),
    new MinifyPlugin()
  ]
});
