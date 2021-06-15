const restController = require('../controllers/restController')
const adminController = require('../controllers/adminController')
const userController = require('../controllers/userController')

module.exports = (app, passport) => {
	//如果使用者訪問首頁，就導向 /restaurants 的頁面
	app.get('/', (req, res) => res.redirect('/restaurants'))
	//在 /restaurants 底下則交給 restController.getRestaurants 來處理
	app.get('/restaurants', restController.getRestaurants)

	// Admin
	app.get('/admin', (req, res) => res.redirect('/admin/restaurants'))
	app.get('/admin/restaurants', adminController.getRestaurants)

	// Signup
	app.get('/signup', userController.signUpPage)
	app.post('/signup', userController.signUp)

	// Signin
	app.get('/signin', userController.signInPage)
	app.post(
		'/signin',
		passport.authenticate('local', { failureRedirect: '/signin' }),
		userController.signIn
	)

	// Logout
	app.get('/logout', userController.logout)
}
