const webpack = require('webpack')
const { prod } = require('./app.config.json')
const { APP_NAME } = prod

module.exports = {
  mode: 'production',
  devtool: 'source-map',
  output: {
    publicPath: '/',
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.name': APP_NAME,
    }),
  ],
}
