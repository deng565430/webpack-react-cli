const path = require('path');
const HTMLPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const NameAllMdoulesPlugin = require('name-all-modules-plugin');

const baseConfig = require('./webpack.base');
const util = require('./util');
const isDev = process.env.NODE_ENV === 'development';

const config = webpackMerge(baseConfig, {
  entry: {
    app: path.join(__dirname, '../src/app.js')
  },
  // 出口文件
  output: {
    filename: '[name].[hash].js'
  },
  plugins: [
    new HTMLPlugin({
      template: path.join(__dirname, '../src/app/template.html')
    }),
    new HTMLPlugin({
      template: '!!ejs-compiled-loader!' + path.join(__dirname, '../src/app/server.template.ejs'),
      filename: 'server.ejs'
    })
  ]
})

// 是否是开发环境
if (isDev) {
  config.entry = {
    app: [
      'react-hot-loader/patch', // 热更新需要配置的内容
      path.join(__dirname, '../src/app/app.js')
    ]
  }
  config.devServer = {
    // 设置基本目录结构 服务哪里的代码 这里是public下面的
    // contentBase: path.join(__dirname, '../dist'),
    // 服务器的IP地址， 可以使用IP也可以使用localhost 0.0.0.0
    host: '0.0.0.0',
    // 配置服务端口
    port: '8888',
    // 是否热更新
    hot: true,
    // 编译过程中出现错误之后再网页上显示
    overlay: {
      errors: true
    },
    // 服务端压缩是否开启
    compress: true,
    // 映射静态资源目录 已经打包的话需要删除dist目录
    publicPath: util.publicPath,
    // 所有404请求返回的html
    historyApiFallback: {
      index: '/public/index.html'
    },
    // 代理
    proxy: {
      '/api': 'http://localhost:8081'
    }
  }
  // 配置无刷新 需要配置  => 是否热更新 hot: true, app.js里面 .babelrc  "plugins": ["react-hot-loader/babel"]
  config.plugins.push(new webpack.HotModuleReplacementPlugin())
} else {
  config.entry = {
    app: path.join(__dirname, '../src/app/app.js'),
    vendor: [
      'react',
      'react-dom'
    ]
  }
  config.output.filename = util.staticPath + '/js/[name].[chunkhash:5].js'
  config.plugins.push(
    // 压缩js源码
    new webpack.optimize.UglifyJsPlugin(),
    // 分离vendor包
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor'
    }),
    // 把不改变的代码打包到manifest
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      minChunks: Infinity
    }),
    // 命名异步加载的模块代码
    new webpack.NamedModulesPlugin(),
    // 解决 webpack.NamedModulesPlugin 会触发的问题
    new NameAllMdoulesPlugin(),
    // 区分打包的模块文件bundle
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    // 每一个chunk打包的名字的操作 没有名字的chunk需要加一个名字 做缓存
    new webpack.NamedChunksPlugin((chunk) => {
      if (chunk.name) {
        return chunk.name
      }
      return chunk.mapModules(m => path.relative(m.context, m.request)).join('_')
    })
  )
}


module.exports = config;
