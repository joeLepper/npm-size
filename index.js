const handle = require('./handle')
const args = require('yargs').argv
const config = {
  pkg: args.package,
  dir: args.dir || 'tmp'
}

handle(config, (err, stats) => console.log(stats))