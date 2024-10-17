const webpack = require('webpack')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const ESLintPlugin = require('eslint-webpack-plugin')
const { APP_HOST, APP_PORT, APP_NAME } = require('./app.config.json')

module.exports = {
  mode: 'development',
  devtool: 'cheap-module-source-map',
  devServer: {
    hot: true,
    open: true,
    host: APP_HOST,
    port: APP_PORT,
    historyApiFallback: true,
    allowedHosts: 'all',
  },
  plugins: [
    new ReactRefreshWebpackPlugin(),
    new webpack.DefinePlugin({
      'process.env.name': APP_NAME,
    }),
    new ESLintPlugin({
      context: './', // Location where it will scan all the files
      extensions: ['js', 'jsx', 'ts', 'tsx'], // File formats that should be scanned
      exclude: ['node_modules', 'dist'], // Exclude everything in these folders
    }),
  ],
}
