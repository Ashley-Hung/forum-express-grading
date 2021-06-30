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

  putCategory: (req, res, next) => {
    categoryService.putCategory(req, res, next, data => {
      if (data['status'] === 'error') {
        req.flash('warning_msg', data['messsage'])
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
