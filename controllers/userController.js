const bcrypt = require('bcryptjs')
const db = require('../models')
const { User } = db

const userController = {
	signUpPage: (req, res) => {
		return res.render('signup')
	},

	signUp: (req, res) => {
		const { name, email, password, passwordCheck } = req.body
		const errors = []
		if (!name || !email || !password || !passwordCheck) {
			errors.push({ message: '所有欄位皆為必填' })
		}

		if (password !== passwordCheck) {
			errors.push({ message: '密碼與確認密碼不相符！' })
		}

		if (errors.length) {
			return res.render('signup', { errors, name, email, password })
		}

		User.findOne({ where: { email } }).then(user => {
			if (user) {
				errors.push({ message: '這個 Email 已經註冊過了。' })
				return res.render('signup', { errors, name, email, password })
			}

			return User.create({
				name,
				email,
				password: bcrypt.hashSync(password, bcrypt.genSaltSync(10))
			})
				.then(() => {
					req.flash('success_msg', '成功註冊帳號！')
					return res.redirect('/signin')
				})
				.catch(err => {
					res.end('An unexpected error has occurred')
					console.log(err)
				})
		})
	}
}

module.exports = userController
