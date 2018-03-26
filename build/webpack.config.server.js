const path = require('path')
const webpack = require('webpack')
const webpackMerge = require('webpack-merge')
const baseConfig = require('./webpack.base')

module.exports = webpackMerge(baseConfig, {
  target: 'node',
  entry: {
    app: path.join(__dirname, '../src/app/server-entry.js'),
  },
  // 不包含引用类库的代码 服务端渲染只需要打包写的代码
  externals: Object.keys(require('../package.json').dependencies),
  output: {
    filename: 'server-entry.js',
    // 使用最新commonjs加载模块的方案
    libraryTarget: 'commonjs2'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.API_BASE': '"http://127.0.0.1:3333"'
    })
  ]
})
