const webpack = require('webpack')

module.exports = function (outDir) {
  return {
    devtool: 'hidden-source-map',
    entry: [
      `./${outDir}/index.js`
    ],
    output: {
      path: `${__dirname}/${outDir}/dist`,
      filename: 'webpack-bundle.js'
    },
    plugins: [
      new webpack.NoErrorsPlugin(),
    ],
  }
}
