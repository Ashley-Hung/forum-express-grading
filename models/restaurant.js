'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Restaurant extends Model {
    static associate(models) {
      Restaurant.belongsTo(models.Category)
      Restaurant.hasMany(models.Comment)
      Restaurant.belongsToMany(models.User, {
        through: models.Favorite,
        foreignKey: 'RestaurantId',
        as: 'FavoritedUsers'
      })
      Restaurant.belongsToMany(models.User, {
        through: models.Like,
        foreignKey: 'RestaurantId',
        as: 'LikedUsers'
      })
    }
  }
  Restaurant.init(
    {
      name: DataTypes.STRING,
      tel: DataTypes.STRING,
      opening_hours: DataTypes.STRING,
      description: DataTypes.TEXT,
      address: DataTypes.STRING,
      image: DataTypes.STRING,
      CategoryId: DataTypes.INTEGER,
      viewCounts: DataTypes.INTEGER
    },
    {
      sequelize,
      modelName: 'Restaurant'
    }
  )
  return Restaurant
}
