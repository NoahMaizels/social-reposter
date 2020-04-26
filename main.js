const TelegramBot = require('node-telegram-bot-api');
const argv = require('yargs').argv

// const config = require('config')
const ig = require('instagram-scraping')
const twitter = require('scrape-twitter')

// const token = config.get('TOKEN')
const token = argv.token
const chatId = argv.chat
const twitterUserName = argv.twitter
const instagramUserName = argv.instagram

const bot = new TelegramBot(token, {polling: true});

const twitterPosts = []
const instagramPosts = []




console.log(token)
console.log(chatId)
console.log(twitterUserName)
console.log(instagramUserName)
console.log(argv)


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
  ).then(
    () => {console.log("Instagram posts loaded")}
  ).catch(err => {
    console.log(err)
  })
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


const getInstagramUpdates = (username = instagramUserName) => {
  ig.scrapeUserPage(username)
  .then(
    result => {
      result.medias.forEach(item => {
        if (!instagramPosts.includes(item.shortcode)){
          instagramPosts.push(item.shortcode)
          bot.sendMessage(chatId, `https://www.instagram.com/p/${item.shortcode}`); 
        }
      })      
    }
  ).catch(err => {
    console.log(err)
  })
}

const getUpdates = () => {
   getTwitterUpdates()
   getInstagramUpdates()
}

const reposter = () => {
  
  getPreviousInstagramPosts()
  .then(() => getPreviousTwitterPosts())
  .then(setInterval( getUpdates, 30000))
}

reposter()