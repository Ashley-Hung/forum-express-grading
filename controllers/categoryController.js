const { Category } = require('../models')
const categoryService = require('../services/categoryService')

const categoryController = {
  getCategories: (req, res, next) => {
    categoryService.getCategories(req, res, next, data => {
      res.render('admin/categories', data)
    })
  },

  postCategory: (req, res, next) => {
    categoryService.postCategory(req, res, next, data => {
      if (data['status'] === 'error') {
        req.flash('warning_msg', data['message'])
        return res.redirect('back')
      }

      req.flash('success_msg', data['message'])
      res.redirect('/admin/categories')
    })
  },

  putCategory: (req, res, next) => {
    categoryService.putCategory(req, res, next, data => {
      if (data['status'] === 'error') {
        req.flash('warning_msg', data['message'])
        return res.redirect('back')
      }

      req.flash('success_msg', data['message'])
      res.redirect('/admin/categories')
    })
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
