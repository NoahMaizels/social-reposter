// require('dotenv').config() // For local dev
const TelegramBot = require('node-telegram-bot-api')
const Twitter = require('twitter')
const morgan = require('morgan')
const express = require('express')
const rateLimit = require("express-rate-limit")
const PORT = process.env.PORT || 3000


// The Express part is just so that it can be pinged to keep the Heroku dynos from idling
const app = express()
app.use(morgan('dev'))
// Limit request rate
const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 30 // limit each IP to 100 requests per windowMs
})
app.use(limiter);

app.use((req, res) => {
  res.send('PING')
})
app.listen(PORT)
console.log(`App listening on ${PORT}`)

// Main app below:

const token = process.env.BOT_TOKEN
const chatIds = process.env.TARGET_CHATS.split(',') // Takes list of comma separated values
const twitterAccounts = process.env.TWITTER_ACCOUNTS.split(',') // Takes list of comma separated values
const frequency = process.env.FREQUENCY

const past_tweets = {}
twitterAccounts.forEach(account => past_tweets[account] = [])

const client = new Twitter({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token_key: process.env.TOKEN_KEY,
  access_token_secret: process.env.TOKEN_SECRET
});
 
const buildTweetLink = (username, tweet_id) => {
  return `https://twitter.com/${username}/status/${tweet_id}`
}


const getPastTweets = async () => {
  twitterAccounts.forEach(account => {
    const params = {screen_name: account};
    client.get('statuses/user_timeline', params, (error, tweets, response) => {
      if (!error) {
        tweets.forEach(tweet => {
          past_tweets[account].push(tweet.id_str)
        })
      }
      console.log(`${account} has ${past_tweets[account].length} recent past tweets.`)
    })
  })
}

const getNewTweets = async () => {
  twitterAccounts.forEach(account => {
    const params = {screen_name: account};
    client.get('statuses/user_timeline', params, (error, tweets, response) => {
      if (!error) {
        tweets.forEach(tweet => {
          if (!past_tweets[account].includes(tweet.id_str)) {
            const tweet_url = buildTweetLink(account, tweet.id_str)
            chatIds.forEach(chatId => {
              bot.sendMessage(chatId, tweet_url); 
            })
            console.log(`New TWEET! ${tweet.id_str}`)
            past_tweets[account].push(tweet.id_str)
          }
        })
      }
    })
  })
}
 

const bot = new TelegramBot(token);

// Turn off when using webhooks
// bot.on('message', (msg) => {
//   console.log(msg)
// });

bot.openWebHook()
console.log(`hasOpenWebHook?: ${bot.hasOpenWebHook()}`)

getPastTweets()
  .then(() =>{
    setInterval(getNewTweets, frequency)
  })