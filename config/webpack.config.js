const { merge } = require('webpack-merge')
const commonConfig = require('./webpack.common.js')
const appConfig = require('./app.config.json')
const { env } = appConfig

console.log(appConfig[env])

module.exports = () => {
  const envConfig = require(`./webpack.${env}.js`)
  const config = merge(commonConfig, envConfig)
  return config
}
