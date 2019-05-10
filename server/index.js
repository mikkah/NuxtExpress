const express = require('express')
const consola = require('consola')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const { Nuxt, Builder } = require('nuxt')
const app = express()
dotenv.config()
const dbURI = process.env.MONGO_URL

// Mongo Connection
mongoose
  .connect(dbURI)
  .then(() =>
    consola.success({ message: `Connected to ${dbURI}`, badge: true })
  )
  .catch(err => consola.error(`Connection Failed: ${err}`))

// Import and Set Nuxt.js options
const config = require('../nuxt.config.js')
config.dev = !(process.env.NODE_ENV === 'production')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use('/api', require('./routes/index'))

async function start() {
  // Init Nuxt.js
  const nuxt = new Nuxt(config)

  const { host, port } = nuxt.options.server

  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  } else {
    await nuxt.ready()
  }

  // Give nuxt middleware to express
  app.use(nuxt.render)

  // Listen the server
  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}
start()
