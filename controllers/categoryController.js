const { Category } = require('../models')
const categoryService = require('../services/categoryService')

const categoryController = {
  getCategories: (req, res, next) => {
    categoryService.getCategories(req, res, next, data => {
      res.render('admin/categories', data)
    })
  },

  postCategory: async (req, res, next) => {
    if (!req.body.name) {
      req.flash('warning_msg', "name didn't exist")
      return res.redirect('back')
    }
    try {
      const hasCatrgory = await Category.findOne({ where: { name: req.body.name } })
      if (hasCatrgory) {
        req.flash('warning_msg', 'Category already exists')
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

      const hasCatrgory = await Category.findOne({ where: { name: req.body.name } })
      if (hasCatrgory) {
        req.flash('warning_msg', 'Category already exists')
        return res.redirect('back')
      }

      await category.update(req.body)
      res.redirect('/admin/categories')
    } catch (error) {
      next(error)
    }
  },

  deleteCategory: async (req, res, next) => {
    try {
      const category = await Category.findByPk(req.params.id, {
        where: { id: req.params.id }
      })
      if (!category) return res.redirect('/admin/categories')

      await category.destroy()
      res.redirect('/admin/categories')
    } catch (error) {
      next(error)
    }
  }
}

module.exports = categoryController
