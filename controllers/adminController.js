const adminService = require('../services/adminService')
const { Restaurant, User, Category } = require('../models')
const Ajv = require('ajv').default
const addFormats = require('ajv-formats')
const ajv = new Ajv({ allErrors: true })
addFormats(ajv)
require('ajv-errors')(ajv)
const { schema } = require('../controllers/schema')
const validate = ajv.compile(schema)
const { ImgurClient } = require('imgur')
const client = new ImgurClient({ clientId: process.env.IMGUR_CLIENT_ID })

const adminController = {
  getRestaurants: (req, res, next) => {
    adminService.getRestaurants(req, res, next, data => {
      res.render('admin/restaurants', data)
    })
  },

  createRestaurant: (req, res) => {
    Category.findAll({ raw: true, nest: true }).then(categories => {
      res.render('admin/create', { categories })
    })
  },

  postRestaurant: (req, res, next) => {
    adminService.postRestaurant(req, res, next, data => {
      if (data['status'] === 'error') {
        return res.render('admin/create', data['message'])
      }

      req.flash('success_msg', data['message'])
      return res.redirect('/admin/restaurants')
    })
  },

  getRestaurant: (req, res, next) => {
    adminService.getRestaurant(req, res, next, data => {
      res.render('admin/restaurant', data)
    })
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

  putRestaurant: (req, res, next) => {
    adminService.putRestaurant(req, res, next, data => {
      if (data['status'] === 'warning') {
        req.flash('warning_msg', data['message'])
        return res.redirect('back')
      } else if (data['status'] === 'error') {
        req.flash('error_msg', data['message'])
        return res.redirect('back')
      }

      req.flash('success_msg', data['message'])
      res.redirect('/admin/restaurants')
    })
  },

  deleteRestaurant: (req, res, next) => {
    adminService.deleteRestaurant(req, res, next, data => {
      if (data['status'] === 'success') res.redirect('/admin/restaurants')
    })
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
