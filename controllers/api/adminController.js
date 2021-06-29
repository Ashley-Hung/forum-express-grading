const adminService = require('../../services/adminService')

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
  }
}

module.exports = adminController
