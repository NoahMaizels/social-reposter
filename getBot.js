const token = process.env.BOT_TOKEN
const webHookUrl = process.env.WEBHOOK_URL
const WEBHOOKS = process.env.WEBHOOKS
const TelegramBot = require('node-telegram-bot-api')

let bot
if (WEBHOOKS) {
  bot = new TelegramBot(token)
  bot.setWebHook(webHookUrl)
  bot.openWebHook()
  console.log(`hasOpenWebHook?: ${bot.hasOpenWebHook()}`)
}
else {
  bot = new TelegramBot(token, {polling: true})
  bot.on('message', (msg) => {
    console.log(msg)
  });
}

module.exports = bot
