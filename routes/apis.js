const express = require('express')
const router = express.Router()
const adminController = require('../controllers/api/adminController')
const categoryController = require('../controllers/api/categoryController')

/* admin/restaurants */
router.get('/admin/restaurants', adminController.getRestaurants)
router.get('/admin/restaurants/:id', adminController.getRestaurant)

// delete
router.delete('/admin/restaurants/:id', adminController.deleteRestaurant)

/* admin/categories */
router.get('/admin/categories', categoryController.getCategories)

module.exports = router
