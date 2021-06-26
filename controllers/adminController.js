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

const adminController = {
  getRestaurants: async (req, res, next) => {
    try {
      const restaurants = await Restaurant.findAll({
        raw: true,
        nest: true,
        include: Category
      })
      res.render('admin/restaurants', { restaurants })
    } catch (error) {
      next(error)
    }
  },

  createRestaurant: (req, res) => {
    Category.findAll({ raw: true, nest: true }).then(categories => {
      res.render('admin/create', { categories })
    })
  },

  postRestaurant: async (req, res, next) => {
    const { name, tel, address, opening_hours, description } = req.body
    const restaurant = req.body
    let error_msg = []

    if (!name || !tel || !address || !opening_hours) {
      error_msg = [{ message: '* 為必填欄位' }]
      return res.render('admin/create', { restaurant, error_msg })
    }

    validate({ name, tel, address, opening_hours: `${opening_hours}:00Z`, description })
    error_msg = validate.errors
    if (error_msg) {
      return res.render('admin/create', { restaurant, error_msg })
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

      req.flash('success_msg', 'restaurant was successfully created')
      return res.redirect('/admin/restaurants')
    } catch (error) {
      next(error)
    }
  },

  getRestaurant: async (req, res, next) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id, { include: Category })
      if (!restaurant) throw new Error('restaurant not found.')

      res.render('admin/restaurant', { restaurant: restaurant.toJSON() })
    } catch (error) {
      next(error)
    }
  },

  editRestaurant: async (req, res, next) => {
    try {
      const [categories, restaurant] = await Promise.all([
        Category.findAll({ raw: true, nest: true }),
        Restaurant.findByPk(req.params.id)
      ])

      if (!restaurant) throw new Error('restaurant not found.')
      return res.render('admin/create', { restaurant: restaurant.toJSON(), categories })
    } catch (error) {
      next(error)
    }
  },

  putRestaurant: async (req, res, next) => {
    const { name, tel, address, opening_hours, description } = req.body

    if (!name || !tel || !address || !opening_hours) {
      req.flash('warning_msg', '* 為必填欄位')
      return res.redirect('back')
    }

    validate({ name, tel, address, opening_hours: `${opening_hours}:00Z`, description })
    if (validate.errors) {
      for (const error of validate.errors) {
        req.flash('error_msg', error)
      }
      return res.redirect('back')
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

      req.flash('success_msg', 'restaurant was successfully to update')
      res.redirect('/admin/restaurants')
    } catch (error) {
      next(error)
    }
  },

  deleteRestaurant: async (req, res, next) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id)
      if (!restaurant) return res.redirect('/admin/restaurants')

      await restaurant.destroy()
      res.redirect('/admin/restaurants')
    } catch (error) {
      next(error)
    }
  },

  getUsers: async (req, res, next) => {
    try {
      const users = await User.findAll({ raw: true })
      res.render('admin/users', { users })
    } catch (error) {
      next(error)
    }
  },

  toggleAdmin: async (req, res, next) => {
    try {
      const user = await User.findByPk(req.params.id)
      if (!user) throw new Error('User not found.')

      await user.update({ isAdmin: !user.isAdmin })
      req.flash('success_msg', 'user was successfully to update')
      res.redirect('/admin/users')
    } catch (error) {
      next(error)
    }
  }
}

module.exports = adminController
