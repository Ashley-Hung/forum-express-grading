const { Category } = require('../models')

const categoryController = {
  getCategories: async (req, res, next, callback) => {
    try {
      const categories = await Category.findAll({ raw: true, nest: true })

      if (req.params.id) {
        const category = await Category.findByPk(req.params.id)
        if (!category) throw new Error('category not found.')

        callback({ categories, category: category.toJSON() })
      } else {
        callback({ categories })
      }
    } catch (error) {
      next(error)
    }
  },

  postCategory: async (req, res, next, callback) => {
    if (!req.body.name) {
      return callback({ status: 'error', message: "name didn't exist" })
    }
    try {
      const hasCatrgory = await Category.findOne({ where: { name: req.body.name } })
      if (hasCatrgory) {
        return callback({ status: 'error', message: 'Category already exists' })
      }

      await Category.create({ name: req.body.name })
      return callback({ status: 'success', message: 'Category was successfully created' })
    } catch (error) {
      next(error)
    }
  },

  putCategory: async (req, res, next, callback) => {
    if (!req.body.name) {
      return callback({ status: 'error', message: "name didn't exist" })
    }

    try {
      const category = await Category.findByPk(req.params.id)
      if (!category) throw new Error('category not found.')

      const hasCatrgory = await Category.findOne({ where: { name: req.body.name } })
      if (hasCatrgory) {
        return callback({ status: 'error', message: 'Category already exists' })
      }

      await category.update(req.body)
      return callback({ status: 'success', message: 'Category was successfully to update' })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = categoryController
