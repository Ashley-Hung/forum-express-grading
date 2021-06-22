const { Category } = require('../models')

const categoryController = {
  getCategories: async (req, res, next) => {
    try {
      const categories = await Category.findAll({ raw: true, nest: true })
      res.render('admin/categories', { categories })
    } catch (error) {
      next(error)
    }
  },

  postCategory: async (req, res, next) => {
    try {
      if (!req.body.name) {
        req.flash('warning_msg', "name didn't exist")
        return res.redirect('back')
      }

      await Category.create({ name: req.body.name })
      res.redirect('/admin/categories')
    } catch (error) {
      next(error)
    }
  }
}

module.exports = categoryController
