const bcrypt = require('bcryptjs')
const { User } = require('../models')
const helpers = require('../_helpers')
const imgur = require('imgur-node-api')
imgur.setClientID(process.env.IMGUR_CLIENT_ID)

const userController = {
  signUpPage: (req, res) => {
    return res.render('signup')
  },

  signUp: (req, res, next) => {
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
          next(err)
        })
    })
  },

  signInPage: (req, res) => {
    return res.render('signin')
  },

  signIn: (req, res) => {
    req.flash('success_msg', '成功登入！')
    res.redirect('/restaurants')
  },

  logout: (req, res) => {
    req.flash('success_msg', '登出成功！')
    req.logout()
    res.redirect('/signin')
  },

  getUser: async (req, res, next) => {
    const isOwner = Number(req.params.id) === helpers.getUser(req).id ? true : false
    const user = await User.findByPk(req.params.id)
    if (!user) throw new Error('user not found.')

    res.render('profile', { user: user.toJSON(), isOwner })
  },

  editUser: async (req, res, next) => {
    if (Number(req.params.id) !== helpers.getUser(req).id) {
      req.flash('warning_msg', '你只能修改自己的 profile')
      return res.redirect(`/users/${req.user.id}`)
    }

    try {
      const user = await User.findByPk(req.params.id)
      if (!user) throw new Error('user not found.')

      res.render('editProfile', { user: user.toJSON() })
    } catch (error) {
      next(error)
    }
  },

  putUser: (req, res, next) => {
    if (Number(req.params.id) !== helpers.getUser(req).id) {
      req.flash('warning_msg', '你只能修改自己的 profile')
      return res.redirect(`/users/${req.user.id}`)
    }

    if (!req.body.name) {
      req.flash('warning_msg', 'Please enter user name.')
      return res.redirect('back')
    }

    const { file } = req
    if (file) {
      imgur.upload(file.path, (err, img) => {
        if (err) throw new Error('image not found.')
        return User.findByPk(req.params.id)
          .then(user => {
            if (!user) throw new Error('user not found.')

            user.update({
              name: req.body.name,
              image: file ? img.data.link : user.image
            })
          })
          .then(() => {
            req.flash('success_msg', 'Your profile was successfully updated')
            return res.redirect(`/users/${req.user.id}`)
          })
          .catch(error => next(error))
      })
    } else {
      return User.findByPk(req.params.id)
        .then(user => {
          if (!user) throw new Error('user not found.')

          user.update({
            name: req.body.name,
            image: user.image // 維持原本的照片
          })
        })
        .then(() => {
          req.flash('success_msg', 'Your profile was successfully updated')
          return res.redirect(`/users/${req.user.id}`)
        })
        .catch(error => next(error))
    }
  }
}

module.exports = userController
