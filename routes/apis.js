const express = require('express')
const router = express.Router()
const adminController = require('../controllers/api/adminController')

/* admin/restaurants */
router.get('/admin/restaurants', adminController.getRestaurants)
router.get('/admin/restaurants/:id', adminController.getRestaurant)

module.exports = router
