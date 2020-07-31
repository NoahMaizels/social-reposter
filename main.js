// require('dotenv').config()
const TelegramBot = require('node-telegram-bot-api')
const Twitter = require('twitter')
const express = require('express')
const rateLimit = require("express-rate-limit")
const PORT = process.env.PORT || 3000


const BOT_TOKEN = process.env.BOT_TOKEN
const TWITTER_ACCOUNTS = process.env.TWITTER_ACCOUNTS
const TARGET_CHATS = process.env.TARGET_CHATS
const CONSUMER_KEY = process.env.CONSUMER_KEY
const CONSUMER_SECRET = process.env.CONSUMER_SECRET
const FREQUENCY = process.env.FREQUENCY
const TOKEN_SECRET = process.env.TOKEN_SECRET
const TOKEN_KEY = process.env.TOKEN_KEY

const env_vars = {
  BOT_TOKEN,
  TWITTER_ACCOUNTS,
  TARGET_CHATS,
  CONSUMER_KEY,
  CONSUMER_SECRET,
  FREQUENCY,
  TOKEN_SECRET,
  TOKEN_KEY
}

Object.keys(env_vars).forEach(key => {
  console.log(`${key}: ${env_vars[key]}`)
})

// The Express part is just so that it can be pinged to keep the Heroku dynos from idling
const app = express()

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
 

const bot = new TelegramBot(token, {polling: true});

bot.on('message', (msg) => {
  console.log(msg)
});


getPastTweets()
  .then(() =>{
    setInterval(getNewTweets, frequency)
  })