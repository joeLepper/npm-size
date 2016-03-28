require('./scripts/cleanup')
const express = require('express')
const handle = require('./handle')
const Guid = require('guid')
const app = express()

app.get('/', (req, res) => {
  const config = { dir: Guid.raw(), pkg: req.query.package }
  handle(config, (err, stats) => {
    if (err) res.status(500).send(err)
    else res.status(200).send(stats)
  })
})
app.listen(4000, function () { console.log('https on port 4000') })