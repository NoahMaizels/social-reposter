const morgan = require('morgan')
const express = require('express')
const rateLimit = require("express-rate-limit")
const bodyParser = require('body-parser')
const chatIds = process.env.TARGET_CHATS.split(',') // Takes list of comma separated values



const app = express()

const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 30 // limit each IP to 100 requests per windowMs
})

// Middleware
app.use(bodyParser())
app.use(morgan('dev'))
app.use(limiter);

app.use((req, res) => {
  if (req.body.channel_post){
    const channel_id = req.body.channel_post.chat.id
    const message_id = req.body.channel_post.message_id
      forwardingIds.forEach(forwardId => {
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