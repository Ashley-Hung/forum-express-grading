const { Category } = require('../models')

const categoryController = {
  getCategories: (req, res, next) => {
    Category.findAll({ raw: true, nest: true })
      .then(categories => {
        res.render('admin/categories', { categories })
      })
      .catch(error => next(error))
  }
}

module.exports = categoryController
