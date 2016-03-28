'use strict'
const exec = require('child_process').exec
const path = require('path')
const replaceStream = require('replacestream')
const fs = require('fs')
const Debug = require('debug')
const compile = require('./compile')
const prettyBytes = require('pretty-bytes')
const debug = Debug('main')

const panic = (cb) => (err, payload) => {
  if (err) cb(err)
  else cb(null, payload)
}

let wbBytes
let brBytes

module.exports = function (config, cb) {
  const pkg = config.pkg
  const dir = config.dir
  const browserifyCmd = `browserify ${dir}/index.js > ${dir}/dist/index.js`
  exec(`mkdir ${dir} && cp template/package.json ${dir}/package.json`, panic((err) => {
      const out = fs.createWriteStream(`${dir}/index.js`)
      out.on('finish', () => {
        debug('index file written')

        exec(`cd ${dir} && npm i ${pkg} && mkdir dist`, panic((err, stdout) => {
          debug(`directory ${dir} prepared`)

          exec(browserifyCmd, panic((err, stdout) => {
            debug('browserify complete')

            exec(`wc -c ${dir}/dist/index.js`, panic((err, brStdout) => {
              const brSplit = brStdout.split(' ')
              const hasSize = brSplit.some((v) => {
                if (v.length && typeof +v === 'number') {
                  brBytes = prettyBytes(+v)
                  return true
                }
                return false
              })
              if (!hasSize) panic(cb)('this seems to be an empty package')
              debug(`browserify bytes counted`)
              debug(brBytes)

              compile(dir, panic((err) => {
                debug('webpack complete')
                exec(`wc -c ${dir}/dist/webpack-bundle.js`, panic((err, wbStdout) => {
                  const wbSplit = wbStdout.split(' ')
                  wbSplit.some((v) => {
                    if (v.length && typeof +v === 'number') {
                      wbBytes = prettyBytes(+v)
                      return true
                    }
                    return false
                  })
                  debug('webpack bytes counted')
                  debug(wbBytes)
                  const packageDefinition = require(path.join(process.cwd(), `${dir}/node_modules/${pkg}/package.json`))
                  const stats = {
                    name: pkg,
                    version: packageDefinition.version,
                    license: packageDefinition.license,
                    webpack: wbBytes,
                    browserify: brBytes
                  }
                  debug('stats prepared')
                  debug(stats)

                  exec(`rm -rf ${dir}`, panic((err) => {
                    debug(`directory ${dir} destroyed`)

                    cb(err, stats)
                  }))
                }))
              }))
            }))
          }))
        }))
      })

      fs.createReadStream(path.join(__dirname, 'template/index.js'))
        .pipe(replaceStream('<%NAME%>', pkg))
        .pipe(out)
    }))
}
