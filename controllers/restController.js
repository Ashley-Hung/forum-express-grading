const { Restaurant, Category } = require('../models')

const restController = {
  getRestaurants: async (req, res, next) => {
    try {
      const restaurants = await Restaurant.findAll({ include: Category, raw: true, nest: true })
      const data = restaurants.map(r => ({
        ...r,
        description: r.description.substring(0, 50),
        categoryName: r.Category.name
      }))
      return res.render('restaurants', { restaurants: data })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = restController
