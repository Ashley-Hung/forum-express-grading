const categoryService = require('../../services/categoryService')

const categoryController = {
  getCategories: (req, res, next) => {
    categoryService.getCategories(req, res, next, data => {
      res.json(data)
    })
  },

  postCategory: (req, res, next) => {
    categoryService.postCategory(req, res, next, data => {
      res.json(data)
    })
  },

  putCategory: (req, res, next) => {
    categoryService.putCategory(req, res, next, data => {
      res.json(data)
    })
  },

  deleteCategory: (req, res, next) => {
    categoryService.deleteCategory(req, res, next, data => {
      res.json(data)
    })
  }
}

module.exports = categoryController
