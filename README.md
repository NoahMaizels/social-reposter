Simple program for reposting Instagram and Twitter posts to Telegram chats. You to set up your own Telegram bot, add it to a Telegram chat and get the chat_id. Also need to add your Telegram bot's token in a config folder inside a default.json file in this format:

{
  "TOKEN":"Your bot's token"
}

Usage:

```
$ npm install  
$ node main.js --BOT_TOKEN --CHAT_ID --TWITTER_USERNAME --INSTAGRAM_USERNAME
```