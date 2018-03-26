const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const util = require("./util");

function resolve(str) {
  return path.join(__dirname, str)
}

module.exports = {
  output: {
    path: resolve('../dist'),
    publicPath: util.publicPath
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /.(js|jsx)$/,
        loader: 'eslint-loader',
        exclude: [
          resolve('../node_modules')
        ]
      },
      {
        test: /\.jsx?$/,
        use: [{
          loader: 'babel-loader',
          options: {
            presets: [
              ['es2015', { 'loose': true }],
              'stage-1',
              'react'
            ],
            plugins: ['react-hot-loader/babel','transform-decorators-legacy','transform-decorators-legacy']
          }
        }],
        exclude: [
          resolve('../node_modules')
        ]
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: "'happypack/loader?id=styles'"
        })
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]'
        }
      }
    ]
  }
}
