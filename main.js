require('dotenv').config() // For local dev
const { getNewTweets, getPastTweets } = require('./getTwitterInfo')
const bot = require('./getBot.js')
const app = require('./server')

const channelId = process.env.TARGET_CHANNEL // Takes list of comma separated values
const frequency = process.env.FREQUENCY
const PORT = process.env.PORT || 3000

app.listen(PORT)
console.log(`App listening on ${PORT}`)

getPastTweets()
  .then(() => {
    setInterval(()=>{getNewTweets(channelId, bot)}, frequency)
  })