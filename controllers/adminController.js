const Ajv = require('ajv').default
const addFormats = require('ajv-formats')
const ajv = new Ajv({ allErrors: true })
addFormats(ajv)
require('ajv-errors')(ajv)
const { schema } = require('../controllers/schema')
const validate = ajv.compile(schema)
const imgur = require('imgur-node-api')
const { Restaurant, User } = require('../models')
imgur.setClientID(process.env.IMGUR_CLIENT_ID)

const adminController = {
	getRestaurants: (req, res) => {
		return Restaurant.findAll({ raw: true })
			.then(restaurants => {
				return res.render('admin/restaurants', { restaurants })
			})
			.catch(error => {
				res.render('error')
				console.error(error)
			})
	},

	createRestaurant: (req, res) => {
		res.render('admin/create')
	},

	postRestaurant: (req, res) => {
		const { name, tel, address, opening_hours, description } = req.body
		const restaurant = req.body
		let error_msg = []

		if (!name || !tel || !address || !opening_hours) {
			error_msg = [{ message: '* 為必填欄位' }]
			return res.render('admin/create', { restaurant, error_msg })
		}

		validate({ name, tel, address, opening_hours: `${opening_hours}:00Z`, description })
		error_msg = validate.errors
		if (error_msg) {
			return res.render('admin/create', { restaurant, error_msg })
		}

		const { file } = req
		if (file) {
			imgur.upload(file.path, (err, img) => {
				return Restaurant.create({
					name,
					tel,
					address,
					opening_hours,
					description,
					image: file ? img.data.link : null
				})
					.then(() => {
						req.flash('success_msg', 'restaurant was successfully created')
						return res.redirect('/admin/restaurants')
					})
					.catch(error => {
						res.render('error')
						console.error(error)
					})
			})
		} else {
			return Restaurant.create({
				name,
				tel,
				address,
				opening_hours,
				description,
				image: null
			})
				.then(() => {
					req.flash('success_msg', 'restaurant was successfully created')
					res.redirect('/admin/restaurants')
				})
				.catch(error => {
					res.render('error')
					console.error(error)
				})
		}
	},

	getRestaurant: (req, res) => {
		return Restaurant.findByPk(req.params.id, { raw: true })
			.then(restaurant => res.render('admin/restaurant', { restaurant }))
			.catch(error => {
				res.render('error')
				console.error(error)
			})
	},

	editRestaurant: (req, res) => {
		return Restaurant.findByPk(req.params.id, { raw: true })
			.then(restaurant => {
				return res.render('admin/create', { restaurant })
			})
			.catch(error => {
				res.render('error')
				console.error(error)
			})
	},

	putRestaurant: (req, res) => {
		const { name, tel, address, opening_hours, description } = req.body

		if (!name || !tel || !address || !opening_hours) {
			req.flash('warning_msg', '* 為必填欄位')
			return res.redirect('back')
		}

		validate({ name, tel, address, opening_hours: `${opening_hours}:00Z`, description })
		if (validate.errors) {
			for (const error of validate.errors) {
				req.flash('error_msg', error)
			}
			return res.redirect('back')
		}

		const { file } = req
		if (file) {
			imgur.upload(file.path, (err, img) => {
				return Restaurant.findByPk(req.params.id).then(restaurant => {
					restaurant
						.update({
							name,
							tel,
							address,
							opening_hours,
							description,
							image: file ? img.data.link : restaurant.image
						})
						.then(() => {
							req.flash('success_msg', 'restaurant was successfully to update')
							res.redirect('/admin/restaurants')
						})
						.catch(error => {
							res.render('error')
							console.error(error)
						})
				})
			})
		} else {
			return Restaurant.findByPk(req.params.id).then(restaurant => {
				restaurant
					.update({
						name,
						tel,
						address,
						opening_hours,
						description,
						image: null
					})
					.then(() => {
						req.flash('success_msg', 'restaurant was successfully to update')
						res.redirect('/admin/restaurants')
					})
					.catch(error => {
						res.render('error')
						console.error(error)
					})
			})
		}
	},

	deleteRestaurant: (req, res) => {
		Restaurant.findByPk(req.params.id)
			.then(restaurant => restaurant.destroy())
			.then(() => res.redirect('/admin/restaurants'))
			.catch(error => {
				res.render('error')
				console.error(error)
			})
	},

	getUsers: (req, res) => {
		User.findAll({ raw: true })
			.then(users => {
				res.render('admin/users', { users })
			})
			.catch(error => {
				res.render('error')
				console.error(error)
			})
	},

	toggleAdmin: (req, res) => {
		User.findByPk(req.params.id)
			.then(user => {
				user.update({ isAdmin: !user.isAdmin })
			})
			.then(() => {
				req.flash('success_msg', 'user was successfully to update')
				res.redirect('/admin/users')
			})
			.catch(error => {
				res.render('error')
				console.error(error)
			})
	}
}

module.exports = adminController
