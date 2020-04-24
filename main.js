const TelegramBot = require('node-telegram-bot-api');
const config = require('config')
const fs = require('fs')
const ig = require('instagram-scraping')

const token = config.get('TOKEN')
const bot = new TelegramBot(token, {polling: true});
const userName = process.argv[2]
const chatId = process.argv[3]

console.log(process.argv)
let posts = []

bot.on('message', (msg) => {
  console.log(msg)
});

const getPreviousPosts = (username = userName) => {
  ig.scrapeUserPage(username)
  .then(
    result => {
      result.medias.forEach(item => {
        posts.push(item.shortcode)
      })
      let json = JSON.stringify(posts); //convert it back to json
      fs.writeFile('posts.json', json, 'utf8', (err) => {
      if (err) throw err
        console.log('Previous posts saved to file!')
      });  
    }
  )
}

const getUpdates = (userName) => {
  ig.scrapeUserPage('rhotic')
  .then(
    result => {
      result.medias.forEach(item => {
        if (!posts.includes(item.shortcode)){
          posts.push(item.shortcode)
          bot.sendMessage(chatId, `https://www.instagram.com/p/${item.shortcode}`); 
        }
      })
      let json = JSON.stringify(posts); //convert it back to json
      fs.writeFile('posts.json', json, 'utf8', (err) => {
      if (err) throw err
      });  
    }
  )
}

getPreviousPosts()
setInterval( getUpdates, 3000)