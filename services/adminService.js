const Ajv = require('ajv').default
const addFormats = require('ajv-formats')
const ajv = new Ajv({ allErrors: true })
addFormats(ajv)
require('ajv-errors')(ajv)
const { schema } = require('../controllers/schema')
const validate = ajv.compile(schema)
const { Restaurant, User, Category } = require('../models')
const { ImgurClient } = require('imgur')
const client = new ImgurClient({ clientId: process.env.IMGUR_CLIENT_ID })

const adminService = {
  getRestaurants: async (req, res, next, callback) => {
    try {
      const restaurants = await Restaurant.findAll({
        raw: true,
        nest: true,
        include: Category
      })
      callback({ restaurants })
    } catch (error) {
      next(error)
    }
  },

  getRestaurant: async (req, res, next, callback) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id, { include: Category })
      if (!restaurant) throw new Error('restaurant not found.')

      callback({ restaurant: restaurant.toJSON() })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = adminService
