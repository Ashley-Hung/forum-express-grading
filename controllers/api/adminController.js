const adminService = require('../../services/adminService')
const { Restaurant } = require('../../models')

const adminController = {
  getRestaurants: (req, res, next) => {
    adminService.getRestaurants(req, res, next, data => {
      res.json(data)
    })
  },

  getRestaurant: (req, res, next) => {
    adminService.getRestaurant(req, res, next, data => {
      res.json(data)
    })
  },

  deleteRestaurant: (req, res, next) => {
    adminService.deleteRestaurant(req, res, next, data => {
      res.json(data)
    })
  }
}

module.exports = adminController
