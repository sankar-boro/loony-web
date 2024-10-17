const webpack = require('webpack')
const { APP_NAME } = require('./app.config.json')

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
