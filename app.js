const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const db = require('./models') // 引入資料庫
const app = express()
const port = 3000

app.engine('handlebars', exphbs({ defaultLayout: 'main' })) // Handlebars 註冊樣板引擎
app.set('view engine', 'handlebars') // 設定使用 Handlebars 做為樣板引擎
app.use(bodyParser.urlencoded({ extended: true }))

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`)
})

require('./routes')(app) // 載入的是一個函式，app 是要傳入函式的參數

module.exports = app
