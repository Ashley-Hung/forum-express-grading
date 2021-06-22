'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Restaurant extends Model {
    static associate(models) {
      Restaurant.belongsTo(models.Category)
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
      CategoryId: DataTypes.INTEGER
    },
    {
      sequelize,
      modelName: 'Restaurant'
    }
  )
  return Restaurant
}
