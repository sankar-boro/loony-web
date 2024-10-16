const webpack = require('webpack')
const Dotenv = require('dotenv-webpack');

module.exports = {
  mode: 'production',
  devtool: 'source-map',
  output: {
    publicPath: '/',
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.name': JSON.stringify('Codevolution'),
    }),
    new Dotenv({
      path: './dev.env'
    })
  ],
}