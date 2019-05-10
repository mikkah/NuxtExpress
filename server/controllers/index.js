const express = require('express')
const consola = require('consola')
const mongoose = require('mongoose')
const models = require('../models/index')
function queryBuilder(collection) {
  const app = express()

  /**
   * Fetch model/collection data
   */
  app.get('/', async (req, res) => {
    try {
      const originalUrl = `${process.env.BASE_URL}${req.originalUrl}`
      const { query } = req
      const where = {}
      const options = {
        page: parseInt(query.page) || 1,
        limit: parseInt(query.limit) || 10
      }
      const { docs, total, pages, page } = await models[collection].paginate(
        where,
        options
      )
      const result = {
        meta: {
          type: collection,
          count: total,
          page,
          pages
        },
        data: docs,
        links: {
          self: originalUrl,
          first: originalUrl + `?page=1`,
          next: page === pages ? null : originalUrl + `?page=${page}`,
          prev: page > pages ? originalUrl + `?page${page - 1}` : null
        }
      }
      return res.status(200).send({ result })
    } catch (error) {
      consola.error({
        message: `Error: ${error}`,
        badge: true
      })
      return res.status(500).send({ message: error })
    }
  })

  /**
   * Fetch model/collection data by ObjectId
   */
  app.get('/:id', async (req, res) => {
    try {
      const id = req.params.id
      const output = await models[collection].findById(id)
      const result = {
        meta: {
          type: collection
        },
        data: output
      }
      return res.status(200).send({ result })
    } catch (error) {
      consola.error({
        message: `Error: ${error}`,
        badge: true
      })
      return res.status(500).send({ message: error })
    }
  })

  /**
   * Update model/collection data by ID
   */
  app.patch('/:id', async (req, res) => {
    try {
      const id = req.params.id
      const { body } = req
      const output = await models[collection].findByIdAndUpdate(id, body, {
        new: true
      })
      const result = {
        meta: {
          type: collection
        },
        data: output
      }
      return res.status(200).send({ result })
    } catch (error) {
      consola.error({
        message: `Error: ${error}`,
        badge: true
      })
      return res.status(500).send({ message: error })
    }
  })

  /**
   * Delete model/collection data by ID
   */
  app.delete('/:id', async (req, res) => {
    try {
      const condition = { _id: mongoose.Types.ObjectId(req.params.id) }
      const output = await models[collection].findOneAndDelete(condition)

      const result = {
        meta: {
          type: collection,
          message: `Deleted`
        },
        deleted: output
      }
      return res.status(200).send({ result })
    } catch (error) {
      consola.error({
        message: `Error: ${error}`,
        badge: true
      })
      return res.status(500).send({ message: error })
    }
  })

  /**
   * Create new data to model/collection
   */
  app.post('/', async (req, res) => {
    try {
      const id = mongoose.Types.ObjectId()
      req.body._id = id
      const data = new models[collection](req.body)
      await data.save()

      const result = {
        meta: {
          type: collection,
          message: `New ${collection} has been added`
        }
      }

      return res.status(200).send({ result })
    } catch (error) {
      consola.error({
        message: `Error: ${error}`,
        badge: true
      })
      return res.status(500).send({ message: error })
    }
  })
  return app
}

module.exports = queryBuilder
