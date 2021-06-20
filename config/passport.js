const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const { User } = require('../models')

// setup passport strategy
passport.use(
  new LocalStrategy(
    { usernameField: 'email', passReqToCallback: true },
    // authenticate user
    (req, email, password, done) => {
      User.findOne({ where: { email } })
        .then(user => {
          if (!user) return done(null, false, req.flash('warning_msg', '這個 email 還沒註冊過！'))
          if (!bcrypt.compareSync(password, user.password)) {
            return done(null, false, req.flash('warning_msg', '帳號或密碼輸入錯誤！'))
          }

          return done(null, user)
        })
        .catch(err => done(err, false))
    }
  )
)

// 設定序列化與反序列化
passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser((id, done) => {
  User.findByPk(id)
    .then(user => {
      user = user.toJSON()
      return done(null, user)
    })
    .catch(err => done(err, null))
})

module.exports = passport
