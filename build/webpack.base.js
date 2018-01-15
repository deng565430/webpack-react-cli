const path = require('path')

module.exports = {
  output: {
    path: path.join(__dirname, '../dist'),
    publicPath: '/public/'
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
          path.resolve(__dirname, '../node_modules')
        ]
      },
      {
        test: /.jsx?$/,
        use: [{
          loader: 'babel-loader',
          options: {
            presets: [
              ["es2015", { "loose": true }],
              "stage-1",
              "react"
            ],
            plugins: ["react-hot-loader/babel","transform-decorators-legacy","transform-decorators-legacy"]
          }
        }],
        exclude: [
          path.join(__dirname, '../node_modules')
        ]
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]'
        }
      }
    ]
  },
}
