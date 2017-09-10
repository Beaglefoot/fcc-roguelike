// path.resolve provides absolute path which is required
// in output.path and module.loaders inclusions
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  entry: [
    'react-hot-loader/patch',
    'webpack-dev-server/client?http://localhost:8080',
    'webpack/hot/only-dev-server',
    './src/index.jsx'
  ],

  output: {
    path: path.resolve(__dirname),
    filename: 'bundle.js',
    publicPath: '/'
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.s[ac]ss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                modules: true,
                sourceMap: true,
                importLoaders: 1,
                localIdentName: '[name]__[local]--[hash:base64:5]',
                camelCase: true
              }
            },
            'sass-loader'
          ]
        })
      },
      {
        test: /_worker\.js$/,
        loader: 'worker-loader'
      }
    ]
  },

  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    alias: {
      src: path.resolve(__dirname, 'src')
    }
  },

  devtool: 'cheap-module-eval-source-map',

  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html'
    }),
    new ExtractTextPlugin('style.css'),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin()
  ],

  devServer: {
    historyApiFallback: true,
    inline: true,
    hot: true,
    open: true,
    openPage: ''
  }
};
