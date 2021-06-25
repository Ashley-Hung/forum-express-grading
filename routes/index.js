const restController = require('../controllers/restController')
const adminController = require('../controllers/adminController')
const userController = require('../controllers/userController')
const categoryController = require('../controllers/categoryController')
const commentController = require('../controllers/commentController')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })
const helpers = require('../_helpers')

module.exports = (app, passport) => {
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
  app.get('/', authenticated, (req, res) => res.redirect('/restaurants'))
  app.get('/restaurants', authenticated, restController.getRestaurants)
  // feed
  app.get('/restaurants/feeds', authenticated, restController.getFeeds)
  // read
  app.get('/restaurants/:id', authenticated, restController.getRestaurant)
  app.get('/restaurants/:id/dashboard', authenticated, restController.getDashboard)

  /* admin/restaurants */
  app.get('/admin', authenticatedAdmin, (req, res) => res.redirect('/admin/restaurants'))
  app.get('/admin/restaurants', authenticatedAdmin, adminController.getRestaurants)
  // create
  app.get('/admin/restaurants/create', authenticatedAdmin, adminController.createRestaurant)
  app.post('/admin/restaurants', authenticatedAdmin, upload.single('image'), adminController.postRestaurant)
  // read
  app.get('/admin/restaurants/:id', authenticatedAdmin, adminController.getRestaurant)
  // edit
  app.get('/admin/restaurants/:id/edit', authenticatedAdmin, adminController.editRestaurant)
  app.put('/admin/restaurants/:id', authenticatedAdmin, upload.single('image'), adminController.putRestaurant)
  // delete
  app.delete('/admin/restaurants/:id', authenticatedAdmin, adminController.deleteRestaurant)

  /* admin/users */
  app.get('/admin/users', authenticatedAdmin, adminController.getUsers)
  app.put('/admin/users/:id/toggleAdmin', authenticatedAdmin, adminController.toggleAdmin)

  /* admin/categories */
  app.get('/admin/categories', authenticatedAdmin, categoryController.getCategories)
  // create
  app.post('/admin/categories', authenticatedAdmin, categoryController.postCategory)
  // edit
  app.get('/admin/categories/:id', authenticatedAdmin, categoryController.getCategories)
  app.put('/admin/categories/:id', authenticatedAdmin, categoryController.putCategory)
  // delete
  app.delete('/admin/categories/:id', authenticatedAdmin, categoryController.deleteCategory)

  /* comment */
  app.post('/comments', authenticated, commentController.postComment)
  app.delete('/comments/:id', authenticatedAdmin, commentController.deleteComment)

  /* users */
  app.get('/users/top', authenticated, userController.getTopUser)
  app.get('/users/:id', authenticated, userController.getUser)
  app.get('/users/:id/edit', authenticated, userController.editUser)
  app.put('/users/:id', authenticated, upload.single('image'), userController.putUser)
  // favorite
  app.post('/favorite/:restaurantId', authenticated, userController.addFavorite)
  app.delete('/favorite/:restaurantId', authenticated, userController.removeFavorite)
  // like
  app.post('/like/:restaurantId', authenticated, userController.addLike)
  app.delete('/like/:restaurantId', authenticated, userController.removeLike)
  // following
  app.post('/following/:userId', authenticated, userController.addFollowing)
  app.delete('/following/:userId', authenticated, userController.removeFollowing)

  /* Signup */
  app.get('/signup', userController.signUpPage)
  app.post('/signup', userController.signUp)

  /* Signin */
  app.get('/signin', userController.signInPage)
  app.post('/signin', passport.authenticate('local', { failureRedirect: '/signin' }), userController.signIn)

  /* Logout */
  app.get('/logout', userController.logout)
}
