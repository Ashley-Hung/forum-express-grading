const restController = require('../controllers/restController')
const adminController = require('../controllers/adminController')
const userController = require('../controllers/userController')

module.exports = (app, passport) => {
	const authenticated = (req, res, next) => {
		if (req.isAuthenticated()) {
			return next()
		}
		res.redirect('/signin')
	}
	const authenticatedAdmin = (req, res, next) => {
		if (req.isAuthenticated()) {
			if (req.user.isAdmin) return next()
			return res.redirect('/')
		}
		res.redirect('/signin')
	}

	/* Home page */
	app.get('/', authenticated, (req, res) => res.redirect('/restaurants'))
	app.get('/restaurants', authenticated, restController.getRestaurants)

	/* Admin */
	app.get('/admin', authenticatedAdmin, (req, res) => res.redirect('/admin/restaurants'))
	app.get('/admin/restaurants', authenticatedAdmin, adminController.getRestaurants)
	// create
	app.get('/admin/restaurants/create', authenticatedAdmin, adminController.createRestaurant)
	app.post('/admin/restaurants', authenticatedAdmin, adminController.postRestaurant)
	// read
	app.get('/admin/restaurants/:id', authenticatedAdmin, adminController.getRestaurant)
	// edit
	app.get('/admin/restaurants/:id/edit', authenticatedAdmin, adminController.editRestaurant)
	app.put('/admin/restaurants/:id', authenticatedAdmin, adminController.putRestaurant)
	// delete
	app.delete('/admin/restaurants/:id', authenticatedAdmin, adminController.deleteRestaurant)

	/* Signup */
	app.get('/signup', userController.signUpPage)
	app.post('/signup', userController.signUp)

	/* Signin */
	app.get('/signin', userController.signInPage)
	app.post(
		'/signin',
		passport.authenticate('local', { failureRedirect: '/signin' }),
		userController.signIn
	)

	/* Logout */
	app.get('/logout', userController.logout)
}
