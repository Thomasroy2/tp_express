const express = require('express')
const bodyParser = require('body-parser')

const app = express()

const courselistRouter = require('./controllers/courselist-controller')
const articleslistRouter = require('./controllers/articles-controller')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// app.get('/', (req, res, next) => {
//   req.send('OK')
// })

app.use('/course-lists', courselistRouter)
app.use('/articles-lists', articleslistRouter)

app.use((req, res, next) => {
  res.status(404)
  res.json({
    error: { code: 'NOT_FOUND', message: 'Page not found' }
  })
})

app.listen(3000, () => {
  console.log('Server launched on port 3000')
})

module.exports = app
