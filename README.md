Simple program for reposting Twitter posts to a Telegram target channel `TARGET_CHANNEL` (not chats, channel), and forwarding from those target channels to a list of target chats `TARGET_CHAT_IDS`.

It also supports forwarding of all other posts (besides just tweets) in to the `TARGET_CHAT_IDS` chats. All posts from the channel ids added in the `REPOST_IDS` env variable will be forwarded to `TARGET_CHAT_IDS`. The `TARGET_CHANNEL` id also must be added to support forwarding of posts which were not reposted Twitter posts already sent by the bot



To set up your own Telegram bot, add it to a Telegram chat and get the chat_id. Add all necessary env variables in a .env file or otherwise. It gets all recent (the last 20) tweets and saves in local memory. 

# Environment variables

Twitter accounts and target chats can be input as comma separated values

## Telegram bot variables

```
BOT_TOKEN= 
TWITTER_ACCOUNTS=account1,account2
```

## Twitter API variables

```
CONSUMER_KEY= 
CONSUMER_SECRET= 
TOKEN_KEY= 
TOKEN_SECRET= 
```

## variables

```
FREQUENCY=
```
*How often to check Twitter in milliseconds (5000 = 5 seconds).*

```
WEBHOOKS= 
```
*1 if you want to use WebHooks and supply your URL, 0 for polling*
```
WEBHOOK_URL
```
*Your WebHook URL*

```
TARGET_CHAT_IDS=chatid1,chatid2
```
*A comma separated list of chats to forward tweets and other messages to.*

```
TARGET_CHANNEL
```
*The channel which tweets are sent to, and from which they are forwarded to TARGET_CHAT_IDS*

```
REPOST_IDS
```
*Channel ids which will have all messages forwarded to chats in `TARGET_CHAT_IDS`*

# Usage:

Add .env file or set env variables through other means and run scripts below:

```
$ npm install  
$ npm start
```