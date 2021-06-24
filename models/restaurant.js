'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Restaurant extends Model {
    static associate(models) {
      Restaurant.belongsTo(models.Category)
      Restaurant.hasMany(models.Comment)
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
      viewCount: DataTypes.INTEGER
    },
    {
      sequelize,
      modelName: 'Restaurant'
    }
  )
  return Restaurant
}
