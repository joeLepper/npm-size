const Debug = require('debug')
const webpack = require('webpack')
const webpackConfig = require('./webpack.config')
const prettyBytes = require('pretty-bytes')

const debug = Debug('webpack')
const compilerStats = {
  chunks: true,
  chunkModules: false,
  colors: true,
  errorDetails: true
}

module.exports = function (outDir, cb) {
  debug('Create webpack compiler.')
  const compiler = webpack(webpackConfig(outDir))

  compiler.run(function (err, stats) {
    const jsonStats = stats.toJson()

    debug('Webpack compile completed.')

    if (err) {
      debug('Webpack compiler encountered a fatal error.', err)
      cb(err)
    } else if (jsonStats.errors.length > 0) {
      debug('Webpack compiler encountered errors.')
      cb(jsonStats.errors)
    } else if (jsonStats.warnings.length > 0) {
      debug('Webpack compiler encountered warnings.')
      cb(null)
    } else {
      debug('No errors or warnings encountered.')
      cb(null)
    }
  })
}
