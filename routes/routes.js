const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const restController = require('../controllers/restController')
const adminController = require('../controllers/adminController')
const userController = require('../controllers/userController')
const categoryController = require('../controllers/categoryController')
const commentController = require('../controllers/commentController')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })
const helpers = require('../_helpers')

const authenticated = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    return next()
  }
  res.redirect('/signin')
}
const authenticatedAdmin = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    if (helpers.getUser(req).isAdmin) return next()
    return res.redirect('/')
  }
  res.redirect('/signin')
}

/* Home page */
router.get('/', authenticated, (req, res) => res.redirect('/restaurants'))
router.get('/restaurants', authenticated, restController.getRestaurants)
// top
router.get('/restaurants/top', authenticated, restController.getTopRestaurants)
// feed
router.get('/restaurants/feeds', authenticated, restController.getFeeds)
// read
router.get('/restaurants/:id', authenticated, restController.getRestaurant)
router.get('/restaurants/:id/dashboard', authenticated, restController.getDashboard)

/* admin/restaurants */
router.get('/admin', authenticatedAdmin, (req, res) => res.redirect('/admin/restaurants'))
router.get('/admin/restaurants', authenticatedAdmin, adminController.getRestaurants)
// create
router.get('/admin/restaurants/create', authenticatedAdmin, adminController.createRestaurant)
router.post('/admin/restaurants', authenticatedAdmin, upload.single('image'), adminController.postRestaurant)
// read
router.get('/admin/restaurants/:id', authenticatedAdmin, adminController.getRestaurant)
// edit
router.get('/admin/restaurants/:id/edit', authenticatedAdmin, adminController.editRestaurant)
router.put('/admin/restaurants/:id', authenticatedAdmin, upload.single('image'), adminController.putRestaurant)
// delete
router.delete('/admin/restaurants/:id', authenticatedAdmin, adminController.deleteRestaurant)

/* admin/users */
router.get('/admin/users', authenticatedAdmin, adminController.getUsers)
router.put('/admin/users/:id/toggleAdmin', authenticatedAdmin, adminController.toggleAdmin)

/* admin/categories */
router.get('/admin/categories', authenticatedAdmin, categoryController.getCategories)
// create
router.post('/admin/categories', authenticatedAdmin, categoryController.postCategory)
// edit
router.get('/admin/categories/:id', authenticatedAdmin, categoryController.getCategories)
router.put('/admin/categories/:id', authenticatedAdmin, categoryController.putCategory)
// delete
router.delete('/admin/categories/:id', authenticatedAdmin, categoryController.deleteCategory)

/* comment */
router.post('/comments', authenticated, commentController.postComment)
router.delete('/comments/:id', authenticatedAdmin, commentController.deleteComment)

/* users */
router.get('/users/top', authenticated, userController.getTopUser)
router.get('/users/:id', authenticated, userController.getUser)
router.get('/users/:id/edit', authenticated, userController.editUser)
router.put('/users/:id', authenticated, upload.single('image'), userController.putUser)
// favorite
router.post('/favorite/:restaurantId', authenticated, userController.addFavorite)
router.delete('/favorite/:restaurantId', authenticated, userController.removeFavorite)
// like
router.post('/like/:restaurantId', authenticated, userController.addLike)
router.delete('/like/:restaurantId', authenticated, userController.removeLike)
// following
router.post('/following/:userId', authenticated, userController.addFollowing)
router.delete('/following/:userId', authenticated, userController.removeFollowing)

/* Signup */
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)

/* Signin */
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin' }), userController.signIn)

/* Logout */
router.get('/logout', userController.logout)

module.exports = router
