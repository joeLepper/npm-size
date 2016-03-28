const fs = require('fs')
const Guid = require('guid')
const exec = require('child_process').exec

fs.readdirSync('.').forEach((file) => {
  if (Guid.isGuid(file)) exec(`rm -rf ${file}`)
})