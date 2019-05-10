const express = require('express')
const app = express()
const queryBuilder = require('../controllers/')

app.use('/test', (req, res) => {
  res.json({
    status: 'success',
    body: 'test'
  })
})

app.use('/users', queryBuilder('Users'))

module.exports = app
