const morgan = require('morgan')
const express = require('express')
const rateLimit = require("express-rate-limit")
const bodyParser = require('body-parser')
const bot = require('./getBot.js')
const forwardingIds = process.env.FORWARDING_IDS.split(',')

const app = express()

const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 100 // limit each IP to 30 requests per windowMs
})

// Middleware
app.use(bodyParser())
app.use(morgan('dev'))
// app.use(limiter);

app.post('/', (req, res) => {
  console.log(`Post? ${req.body.channel_post}`)
  if (req.body.channel_post){
    const channel_id = req.body.channel_post.chat.id
    const message_id = req.body.channel_post.message_id
    console.log(channel_id)
    console.log(message_id)
      forwardingIds.forEach(forwardId => {
        console.log(forwardId)
        console.log(channel_id)
        console.log(message_id)

        // Forward all self sent messages sent to TARGET_CHATS to all FORWARDING_IDS
        try {
          bot.forwardMessage(forwardId, channel_id, message_id)
        }
        catch (err) {
          console.log("TELEGRAM ERROR:")
          console.log(err)
        } 
      })  
  }
})

app.use((req, res) => {
  // Forward all messages sent by others to TARGET_CHATS to FORWARDING_IDS
  console.log('BODY')
  console.log(req.body)
  res.send('PING')
})

module.exports = app