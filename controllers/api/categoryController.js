const categoryService = require('../../services/categoryService')

const categoryController = {
  getCategories: (req, res, next) => {
    categoryService.getCategories(req, res, next, data => {
      res.json(data)
    })
  },

  putCategory: (req, res, next) => {
    categoryService.putCategory(req, res, next, data => {
      res.json(data)
    })
  }
}

module.exports = categoryController
