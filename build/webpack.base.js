const path = require('path');
// 编译css
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const autoprefixer = require('autoprefixer');

const util = require('./util');

function resolve(dir) {
  return path.join(__dirname, '..', dir)
}

// css 解析配置
const postcssOpts = {
  ident: 'postcss',
  plugins: () => [
    autoprefixer({
      browsers: ['last 2 versions', 'Firefox ESR', '> 1%', 'ie >= 8', 'iOS >= 8', 'Android >= 4'],
    }),
    // pxtorem({ rootValue: 100, propWhiteList: [] })
  ],
}

module.exports = {
  // 入口文件
  output: {
    path: path.join(__dirname, '../dist'),
    publicPath: util.publicPath,
  },
  // 运行不写后缀
  resolve: {
    extensions: ['.js', '.jsx'],
    modules: [
      resolve('src'),
      resolve('node_modules')
    ],
    alias: {
      '@': resolve('src'),
      'common': resolve('src/common'),
      'components': resolve('src/components'),
      'base': resolve('src/base'),
      'api': resolve('src/api')
    }
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.(js|jsx)$/,
        loader: 'eslint-loader',
        exclude: [
          path.resolve(__dirname, '../node_modules')
        ]
      },
      {
        test: /.jsx$/,
        loader: 'babel-loader'
      },
      {
        test: /.js$/,
        loader: 'babel-loader',
        exclude: [
          path.join(__dirname, '../node_modules')
        ]
      },
      {
        test: /\.css$/,
        loaders: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: [
            {
              loader: 'css-loader',
              options: {
                minimize: true
              }
            },
            { loader: 'postcss-loader', options: postcssOpts }
          ]
        })
      },
      {
        test: /\.(png|jpe?g|gif)/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 5000,
            outputPath: util.staticPath + '/images/',
            name: '[name].[ext]?[hash]'
          }
        }]
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 5000,
            outputPath: util.staticPath + '/fonts/',
            name: '[name].[ext]?[hash]'
          }
        }]
      },
    ]
  },
  plugins: [
    new ExtractTextPlugin(util.staticPath + '/css/styles.css'),
  ]
}
