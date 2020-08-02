const Twitter = require('twitter')
const targetChatIds = process.env.TARGET_CHAT_IDS.split(',')
const twitterAccounts = process.env.TWITTER_ACCOUNTS.split(',') // Takes list of comma separated values
const past_tweets = {}
twitterAccounts.forEach(account => past_tweets[account] = [])

const client = new Twitter({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token_key: process.env.TOKEN_KEY,
  access_token_secret: process.env.TOKEN_SECRET
});
 
const buildTweetLink = (username, tweet_id) => {
  let tweet = `https://twitter.com/${username}/status/${tweet_id}`
  return tweet.replace(/(\r\n|\n|\r)/gm,"")
}

const buildReTweetLink = (username, tweet_id) => {
  let tweet = `https://twitter.com/${username}/status/${tweet_id}`
  tweet = tweet.replace(/(\r\n|\n|\r)/gm,"")
  tweet = `Retweet:\n${tweet}`
  return tweet
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

const getNewTweets = (channelId, bot) => {
  twitterAccounts.forEach(account => {
    const params = {screen_name: account};
    client.get('statuses/user_timeline', params, (error, tweets, response) => {
      if (!error) {
        tweets.forEach(tweet => {
          // If past_tweets don't have the new tweet id, send
          if (!past_tweets[account].includes(tweet.id_str)) {
            let tweet_url
            if (!tweet.retweeted_status) {
              tweet_url = buildTweetLink(account, tweet.id_str)
            }
            else {
              tweet_url = buildReTweetLink(account, tweet.id_str)
            }
          
            // Send all new Tweets to TARGET_CHANNEL
              try {
                bot.sendMessage(channelId, tweet_url)
                  .then(res => {
                    targetChatIds.forEach(targetChat => {
                      // Forward all self sent messages (message_id) sent to TARGET_CHANNEL (channelId) to all TARGET_CHAT_IDS
                      try {
                        bot.forwardMessage(targetChat, channelId, res.message_id)
                      }
                      catch(err) {
                        console.log("TELEGRAM ERROR:")
                        console.log(err)
                      }
                    })
                  }) 
              }
              catch (err) {
                console.log("TELEGRAM ERROR:")
                console.log(err)
              }
            console.log(`New TWEET! ${tweet.id_str}`)
            past_tweets[account].push(tweet.id_str)
          }
        })
      }
    })
  })
}
 

module.exports = {
  getPastTweets,
  getNewTweets
}