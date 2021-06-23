const { Restaurant, Category } = require('../models')

const restController = {
  getRestaurants: async (req, res, next) => {
    const whereQuery = {}
    if (req.query.categoryId) {
      whereQuery.CategoryId = Number(req.query.categoryId)
    }
    console.log(whereQuery)

    try {
      const [restaurants, categories] = await Promise.all([
        Restaurant.findAll({ include: Category, where: whereQuery, raw: true, nest: true }),
        Category.findAll({ raw: true, nest: true })
      ])

      const data = restaurants.map(r => ({
        ...r,
        description: r.description.substring(0, 50),
        categoryName: r.Category.name
      }))

      return res.render('restaurants', { restaurants: data, categories, categoryId: whereQuery.CategoryId })
    } catch (error) {
      next(error)
    }
  },

  getRestaurant: async (req, res, next) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id, { include: Category })
      if (!restaurant) throw new Error('restaurant not found.')
      console.log(restaurant)

      res.render('restaurant', { restaurant: restaurant.toJSON() })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = restController
