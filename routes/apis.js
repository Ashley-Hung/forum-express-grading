const express = require('express')
const router = express.Router()
const multer = require('multer')
const upload = multer({ dest: 'temp/' })
const adminController = require('../controllers/api/adminController')
const categoryController = require('../controllers/api/categoryController')

/* admin/restaurants */
router.get('/admin/restaurants', adminController.getRestaurants)
router.get('/admin/restaurants/:id', adminController.getRestaurant)
// create
router.post('/admin/restaurants', upload.single('image'), adminController.postRestaurant)
// edit
router.put('/admin/restaurants/:id', upload.single('image'), adminController.putRestaurant)
// delete
router.delete('/admin/restaurants/:id', adminController.deleteRestaurant)

/* admin/categories */
router.get('/admin/categories', categoryController.getCategories)
// create
router.post('/admin/categories', categoryController.postCategory)
// edit
router.put('/admin/categories/:id', categoryController.putCategory)
// delete
router.delete('/admin/categories/:id', categoryController.deleteCategory)

module.exports = router
