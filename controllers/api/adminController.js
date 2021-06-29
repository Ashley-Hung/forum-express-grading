const Ajv = require('ajv').default
const addFormats = require('ajv-formats')
const ajv = new Ajv({ allErrors: true })
addFormats(ajv)
require('ajv-errors')(ajv)
const { schema } = require('../schema')
const validate = ajv.compile(schema)
const { Restaurant, User, Category } = require('../../models')
const { ImgurClient } = require('imgur')
const client = new ImgurClient({ clientId: process.env.IMGUR_CLIENT_ID })

const adminController = {
  getRestaurants: async (req, res, next) => {
    try {
      const restaurants = await Restaurant.findAll({
        raw: true,
        nest: true,
        include: Category
      })
      res.json({ restaurants })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = adminController
