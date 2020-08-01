const Twitter = require('twitter')
const forwardingIds = process.env.FORWARDING_IDS.split(',')
const forwardingOnlyIds = process.env.FORWARDING_ONLY.split(',')
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

const getNewTweets = (chatIds, bot) => {
  twitterAccounts.forEach(account => {
    const params = {screen_name: account};
    client.get('statuses/user_timeline', params, (error, tweets, response) => {
      if (!error) {
        tweets.forEach(tweet => {
          // If the current account's tweets don't have the new tweet id
          if (!past_tweets[account].includes(tweet.id_str)) {
            const tweet_url = buildTweetLink(account, tweet.id_str)

            // Send all new Tweets to all TARGET_CHATS
            chatIds.forEach(chatId => {
              // Add filters here 

              // Do not send messages to FORWARDING_ONLY channels
              if (!forwardingOnlyIds.includes(chatId)) {
                try {
                  bot.sendMessage(chatId, tweet_url)
                    .then(res => {
                      forwardingIds.forEach(forwardId => {
                        // Forward all self sent messages (message_id) sent to TARGET_CHATS (chatId) to all FORWARDING_IDS (forwardId)
                        try {
                          bot.forwardMessage(forwardId, chatId, res.message_id)
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
              } 
            })
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