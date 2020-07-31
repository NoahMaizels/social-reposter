const morgan = require('morgan')
const express = require('express')
const rateLimit = require("express-rate-limit")
const bodyParser = require('body-parser')

const app = express()

app.use(bodyParser())
app.use(morgan('dev'))
// Limit request rate
const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 30 // limit each IP to 100 requests per windowMs
})
app.use(limiter);

app.use((req, res) => {
  console.log(`BODY:${req.body}`)
  res.send('PING')
})

module.exports = app