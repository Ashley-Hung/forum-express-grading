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
  },

  postRestaurant: async (req, res, next, callback) => {
    const { name, tel, address, opening_hours, description } = req.body
    const restaurant = req.body
    let error_msg = []
    const categories = await Category.findAll({ raw: true, nest: true })
    restaurant.categoryId = Number(req.body.categoryId)

    if (!name || !tel || !address || !opening_hours) {
      error_msg = [{ message: '* 為必填欄位' }]
      return callback({ status: 'error', message: { restaurant, error_msg, categories } })
      // return res.render('admin/create', { restaurant, error_msg, categories })
    }

    validate({ name, tel, address, opening_hours: `${opening_hours}:00Z`, description })
    error_msg = validate.errors
    if (error_msg) {
      return callback({ status: 'error', message: { restaurant, error_msg, categories } })
    }

    const { file } = req

    try {
      const imageLink = file ? (await client.upload(file.path)).data.link : null

      await Restaurant.create({
        name,
        tel,
        address,
        opening_hours,
        description,
        image: imageLink,
        CategoryId: restaurant.categoryId
      })

      return callback({ status: 'success', message: 'restaurant was successfully created' })
    } catch (error) {
      next(error)
    }
  },

  putRestaurant: async (req, res, next, callback) => {
    const { name, tel, address, opening_hours, description } = req.body
    const errors = []

    if (!name || !tel || !address || !opening_hours) {
      return callback({ status: 'warning', message: '* 為必填欄位' })
    }

    validate({ name, tel, address, opening_hours: `${opening_hours}:00Z`, description })
    if (validate.errors) {
      for (const error of validate.errors) {
        errors.push(error)
      }
      return callback({ status: 'error', message: errors })
    }

    const { file } = req

    try {
      const restaurant = await Restaurant.findByPk(req.params.id)
      if (!restaurant) throw new Error('restaurant not found.')

      const imageLink = file ? (await client.upload(file.path)).data.link : restaurant.image

      restaurant.update({
        name,
        tel,
        address,
        opening_hours,
        description,
        image: imageLink,
        CategoryId: req.body.categoryId
      })

      return callback({ status: 'success', message: 'restaurant was successfully to update' })
    } catch (error) {
      next(error)
    }
  },

  deleteRestaurant: async (req, res, next, callback) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id)
      if (!restaurant) return res.redirect('/admin/restaurants')

      await restaurant.destroy()
      callback({ status: 'success', message: '' })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = adminService
