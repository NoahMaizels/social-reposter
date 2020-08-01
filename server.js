const morgan = require('morgan')
const express = require('express')
const rateLimit = require("express-rate-limit")
const bodyParser = require('body-parser')
const bot = require('./getBot.js')
const forwarding = require('./middleware/forwarding')

const app = express()

const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 100 // limit each IP to 30 requests per windowMs
})

// Middleware
app.use(bodyParser())
app.use(morgan('dev'))
// app.use(limiter);

app.post('/', forwarding)

app.use((req, res) => {
  console.log('BODY')
  console.log(req.body)
  res.send('PING')
})

module.exports = app