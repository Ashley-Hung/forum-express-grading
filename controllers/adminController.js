const db = require('../models')
const { Restaurant } = db

const adminController = {
	getRestaurants: (req, res) => {
		return Restaurant.findAll({ raw: true }).then(restaurants => {
			return res.render('admin/restaurants', { restaurants })
		})
	},

	createRestaurant: (req, res) => {
		res.render('admin/create')
	},

	postRestaurant: (req, res) => {
		if (!req.body.name) {
			req.flash('warning_msg', "name didn't exist")
			return res.redirect('back')
		}

		return Restaurant.create({
			name: req.body.name,
			tel: req.body.tel,
			address: req.body.address,
			opening_hours: req.body.opening_hours,
			description: req.body.description
		}).then(restaurant => {
			req.flash('success_msg', 'restaurant was successfully created')
			res.redirect('/admin/restaurants')
		})
	},

	getRestaurant: (req, res) => {
		return Restaurant.findByPk(req.params.id, { raw: true }).then(restaurant =>
			res.render('admin/restaurant', { restaurant })
		)
	},

	editRestaurant: (req, res) => {
		return Restaurant.findByPk(req.params.id, { raw: true }).then(restaurant => {
			return res.render('admin/create', { restaurant })
		})
	},

	putRestaurant: (req, res) => {
		if (!req.body.name) {
			req.flash('warning_msg', "name didn't exist")
			return res.redirect('back')
		}

		return Restaurant.findByPk(req.params.id).then(restaurant => {
			restaurant
				.update({
					name: req.body.name,
					tel: req.body.tel,
					address: req.body.address,
					opening_hours: req.body.opening_hours,
					description: req.body.description
				})
				.then(() => {
					req.flash('success_msg', 'restaurant was successfully to update')
					res.redirect('/admin/restaurants')
				})
		})
	},

	deleteRestaurant: (req, res) => {
		Restaurant.findByPk(req.params.id)
			.then(restaurant => restaurant.destroy())
			.then(() => res.redirect('/admin/restaurants'))
	}
}

module.exports = adminController
