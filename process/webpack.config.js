var webpack = require('webpack');
var nodeExternals = require('webpack-node-externals');

module.exports = {
  target: 'node',

  entry: './src/index.js',
  output: {
    path: './dist',
    filename: 'bundle.js',
  },

  externals: [nodeExternals({
    whitelist: [ /^ro-/ ]
  })],

  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: [
            [
              "env",
              {
                "targets": {
                  "node": "current"
                }
              }
            ]
          ]
        }
      }
    ]
  }
}
