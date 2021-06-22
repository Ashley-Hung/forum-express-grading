const { Category } = require('../models')

const categoryController = {
  getCategories: async (req, res, next) => {
    try {
      const categories = await Category.findAll({ raw: true, nest: true })

      if (req.params.id) {
        const category = await Category.findByPk(req.params.id)
        if (!category) throw new Error('category not found.')

        res.render('admin/categories', { categories, category: category.toJSON() })
      } else {
        res.render('admin/categories', { categories })
      }
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
  },

  putCategory: async (req, res, next) => {
    if (!req.body.name) {
      req.flash('warning_msg', "name didn't exist")
      res.redirect('back')
    }

    try {
      const category = await Category.findByPk(req.params.id)
      if (!category) throw new Error('category not found.')

      await category.update(req.body)
      res.redirect('/admin/categories')
    } catch (error) {
      next(error)
    }
  },

  deleteCategory: async (req, res, next) => {
    try {
      const category = await Category.findByPk(req.params.id)
      if (!category) throw new Error('category not found.')

      await category.destroy()
      res.redirect('/admin/categories')
    } catch (error) {
      next(error)
    }
  }
}

module.exports = categoryController
