const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const session = require('express-session')
const flash = require('connect-flash')
const methodOverride = require('method-override')
const helpers = require('./_helpers')
const passport = require('./config/passport')
if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config()
}

const app = express()
const port = process.env.PORT

app.engine('handlebars', exphbs({ defaultLayout: 'main' })) // Handlebars 註冊樣板引擎
app.set('view engine', 'handlebars') // 設定使用 Handlebars 做為樣板引擎
app.use(bodyParser.urlencoded({ extended: true }))
app.use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: true }))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))
app.use('/upload', express.static(__dirname + '/upload'))
app.use((req, res, next) => {
	res.locals.user = helpers.getUser(req)
	res.locals.success_msg = req.flash('success_msg')
	res.locals.warning_msg = req.flash('warning_msg')
	res.locals.error_msg = req.flash('error_msg')
	next()
})

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`)
})

require('./routes')(app, passport) // 載入的是一個函式，app 是要傳入函式的參數

module.exports = app
