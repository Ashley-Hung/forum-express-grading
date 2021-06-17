const restController = require('../controllers/restController')
const adminController = require('../controllers/adminController')
const userController = require('../controllers/userController')
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

	/* Signup */
	app.get('/signup', userController.signUpPage)
	app.post('/signup', userController.signUp)

	/* Signin */
	app.get('/signin', userController.signInPage)
	app.post('/signin', passport.authenticate('local', { failureRedirect: '/signin' }), userController.signIn)

	/* Logout */
	app.get('/logout', userController.logout)
}
