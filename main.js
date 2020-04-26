const TelegramBot = require('node-telegram-bot-api');
const config = require('config')
const ig = require('instagram-scraping')
const twitter = require('scrape-twitter')

const token = config.get('TOKEN')
const bot = new TelegramBot(token, {polling: true});
const chatId = process.argv[2]
const twitterUserName = process.argv[3]
const instagramUserName = process.argv[4]

const twitterPosts = []
const instagramPosts = []


bot.on('message', (msg) => {
  console.log(msg)
});

const getPreviousInstagramPosts = async (username = instagramUserName) => {
  ig.scrapeUserPage(username)
  .then(
     result => {
      result.medias.forEach(item => {
        instagramPosts.push(item.shortcode)
      }) 
    }
  )
}

const getPreviousTwitterPosts = async () => {
  timeline = new twitter.TimelineStream(twitterUserName, {retweets: true})
  timeline
  .on('data', data  => {
    twitterPosts.push(data.id)
  })
  .on('end', () => {
    console.log('Twitter posts loaded')
    return twitterPosts
  }) 
}

const getTwitterUpdates = () => {
  timeline = new twitter.TimelineStream('noahniuwa', {retweets: true})
  timeline
  .on('data', data  => {
    if (!twitterPosts.includes(data.id)) {
      console.log('new post')
      twitterPosts.push(data.id)
      bot.sendMessage(chatId, `https://twitter.com/${twitterUserName}/status/${data.id}`)
    }
  })
}


const getInstagramUpdates = (userName) => {
  ig.scrapeUserPage('rhotic')
  .then(
    result => {
      result.medias.forEach(item => {
        if (!instagramPosts.includes(item.shortcode)){
          instagramPosts.push(item.shortcode)
          bot.sendMessage(chatId, `https://www.instagram.com/p/${item.shortcode}`); 
        }
      })      
    }
  )
}

const getUpdates = () => {
   getTwitterUpdates()
   getInstagramUpdates()
}

getPreviousInstagramPosts()
.then(() => getPreviousTwitterPosts())
.then(setInterval( getUpdates, 5000))
