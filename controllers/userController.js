const bcrypt = require('bcryptjs')
const { User, Comment, Restaurant, Favorite, Like, Followship, Category } = require('../models')
const helpers = require('../_helpers')
const { ImgurClient } = require('imgur')
const client = new ImgurClient({ clientId: process.env.IMGUR_CLIENT_ID })

const userController = {
  signUpPage: (req, res) => {
    return res.render('signup')
  },

  signUp: async (req, res, next) => {
    const { name, email, password, passwordCheck } = req.body
    const error_msg = []
    if (!name || !email || !password || !passwordCheck) {
      error_msg.push({ message: '所有欄位皆為必填' })
    }

    if (password !== passwordCheck) {
      error_msg.push({ message: '密碼與確認密碼不相符！' })
    }

    if (error_msg.length) {
      return res.render('signup', { error_msg, name, email, password })
    }

    try {
      const user = await User.findOne({ where: { email } })
      if (user) {
        error_msg.push({ message: '這個 Email 已經註冊過了。' })
        return res.render('signup', { error_msg, name, email, password })
      }

      await User.create({
        name,
        email,
        password: bcrypt.hashSync(password, bcrypt.genSaltSync(10))
      })

      req.flash('success_msg', '成功註冊帳號！')
      return res.redirect('/signin')
    } catch (error) {
      next(error)
    }
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
    try {
      const user = await User.findByPk(req.params.id, {
        include: [
          { model: Comment, include: Restaurant },
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' },
          { model: Restaurant, include: Category, as: 'FavoritedRestaurants' }
        ]
      })
      if (!user) throw new Error('user not found.')

      const restaurantInfo = new Map()
      user.toJSON().Comments.forEach(r => {
        const id = r.RestaurantId
        if (restaurantInfo.has(id)) {
          restaurantInfo.get(id).count++
        } else {
          restaurantInfo.set(id, { RestaurantId: id, name: r.Restaurant.name, image: r.Restaurant.image, count: 1 })
        }
      })

      res.render('profile', { owner: user.toJSON(), isOwner, restaurants: [...restaurantInfo.values()] })
    } catch (error) {
      next(error)
    }
  },

  editUser: async (req, res, next) => {
    if (Number(req.params.id) !== helpers.getUser(req).id) {
      req.flash('warning_msg', '你只能修改自己的 profile')
      return res.redirect(`/users/${helpers.getUser(req).id}`)
    }

    try {
      const user = await User.findByPk(req.params.id)
      if (!user) throw new Error('user not found.')

      res.render('editProfile', { user: user.toJSON() })
    } catch (error) {
      next(error)
    }
  },

  putUser: async (req, res, next) => {
    if (Number(req.params.id) !== helpers.getUser(req).id) {
      req.flash('warning_msg', '你只能修改自己的 profile')
      return res.redirect(`/users/${helpers.getUser(req).id}`)
    }

    if (!req.body.name) {
      req.flash('warning_msg', 'Please enter user name.')
      return res.redirect('back')
    }

    const { file } = req

    try {
      const user = await User.findByPk(req.params.id)
      if (!user) throw new Error('user not found.')

      const imageLink = file ? (await client.upload(file.path)).data.link : user.image

      await user.update({
        name: req.body.name,
        image: imageLink
      })

      req.flash('success_msg', 'Your profile was successfully updated')
      return res.redirect(`/users/${helpers.getUser(req).id}`)
    } catch (error) {
      next(error)
    }
  },

  addFavorite: async (req, res, next) => {
    try {
      const isFavorite = await Favorite.findOne({
        where: {
          UserId: helpers.getUser(req).id,
          RestaurantId: req.params.restaurantId
        }
      })
      if (isFavorite) return res.redirect('back')

      await Favorite.create({ UserId: helpers.getUser(req).id, RestaurantId: req.params.restaurantId })
      res.redirect('back')
    } catch (error) {
      next(error)
    }
  },

  removeFavorite: async (req, res, next) => {
    try {
      const favorite = await Favorite.findOne({
        where: { UserId: helpers.getUser(req).id, RestaurantId: req.params.restaurantId }
      })
      if (!favorite) res.redirect('back')

      await favorite.destroy()
      res.redirect('back')
    } catch (error) {
      next(error)
    }
  },

  addLike: async (req, res, next) => {
    try {
      const isLiked = await Like.findOne({
        where: {
          UserId: helpers.getUser(req).id,
          RestaurantId: req.params.restaurantId
        }
      })

      if (isLiked) return res.redirect('/restaurants')

      await Like.create({ UserId: helpers.getUser(req).id, RestaurantId: req.params.restaurantId })
      res.redirect('back')
    } catch (error) {
      next(error)
    }
  },

  removeLike: async (req, res, next) => {
    try {
      const like = await Like.findOne({
        where: { UserId: helpers.getUser(req).id, RestaurantId: req.params.restaurantId }
      })
      if (!like) return res.redirect('/restaurants')

      await like.destroy()
      res.redirect('back')
    } catch (error) {
      next(error)
    }
  },

  getTopUser: async (req, res, next) => {
    try {
      let users = await User.findAll({ include: [{ model: User, as: 'Followers' }] })

      users = users
        .map(user => ({
          ...user.dataValues,
          FollowerCount: user.Followers.length,
          isFollowed: helpers
            .getUser(req)
            .Followings.map(d => d.id)
            .includes(user.id)
        }))
        .sort((a, b) => b.FollowerCount - a.FollowerCount)

      res.render('topUser', { users, isOwnerId: helpers.getUser(req).id })
    } catch (error) {
      next(error)
    }
  },

  addFollowing: async (req, res, next) => {
    if (Number(req.params.userId) === helpers.getUser(req).id) {
      req.flash('warning_msg', '你無法追蹤自己')
      return res.redirect(`/users/top`)
    }

    try {
      const isFollowing = await Followship.findOne({
        where: {
          followerId: helpers.getUser(req).id,
          followingId: req.params.userId
        }
      })
      if (isFollowing) return res.redirect('back')

      await Followship.create({ followerId: helpers.getUser(req).id, followingId: req.params.userId })
      res.redirect('back')
    } catch (error) {
      next(error)
    }
  },

  removeFollowing: async (req, res, next) => {
    if (Number(req.params.userId) === helpers.getUser(req).id) {
      req.flash('warning_msg', '你無法取消追蹤自己')
      return res.redirect(`/users/top`)
    }
    try {
      const followship = await Followship.findOne({
        where: { followerId: helpers.getUser(req).id, followingId: req.params.userId }
      })
      if (!followship) res.redirect('back')

      await followship.destroy()
      res.redirect('back')
    } catch (error) {
      next(error)
    }
  }
}

module.exports = userController
