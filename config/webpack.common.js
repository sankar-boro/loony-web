const fs = require('fs')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const pkgRoot = path.join(__dirname, '..', 'packages')
const main = path.resolve(__dirname, '..', './src/main.tsx')
const indexHtml = path.resolve(__dirname, '..', './index.html')

function findPackages() {
  return fs
    .readdirSync(pkgRoot)
    .filter((entry) => {
      const pkgPath = path.join(pkgRoot, entry)

      return (
        !['.', '..'].includes(entry) &&
        fs.lstatSync(pkgPath).isDirectory() &&
        fs.existsSync(path.join(pkgPath, 'package.json'))
      )
    })
    .map((dir) => {
      const jsonPath = path.join(pkgRoot, dir, 'package.json')
      const { name } = JSON.parse(fs.readFileSync(jsonPath).toString('utf-8'))

      return { dir, name }
    })
}

const alias = findPackages().reduce((alias, { dir, name }) => {
  alias[name] = path.resolve(__dirname, `../packages/${dir}/src`)

  return alias
}, {})

module.exports = {
  entry: main,
  resolve: {
    alias,
    extensions: ['.tsx', '.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
          },
        ],
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.(?:ico|gif|png|jpg|jpeg|svg)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
        type: 'asset/inline',
      },
      {
        test: /\.svg$/,
        use: ['@svgr/webpack', 'url-loader'],
      },
    ],
  },
  output: {
    path: path.resolve(__dirname, '..', './build'),
    filename: 'bundle.js',
    publicPath: '/',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: indexHtml,
    }),
    new MiniCssExtractPlugin(),
  ],
  stats: 'errors-only',
}
