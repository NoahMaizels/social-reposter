Simple program for reposting Twitter posts to a list of Telegram target chats, and optionally forwarding from those target chats to a second list target chats (for example, sending first to several announcement channels, and then forwarding to several group chats). To set up your own Telegram bot, add it to a Telegram chat and get the chat_id. Add all necessary env variables in a .env file or otherwise. It gets all recent (the last 20) tweets and saves in local memory. 

# Environment variables

Twitter accounts and target chats can be input as comma separated values

## Telegram bot variables

```
BOT_TOKEN= 
TWITTER_ACCOUNTS=account1,account2
TARGET_CHATS=chatid1,chatid2
```

## Twitter API variables

```
CONSUMER_KEY= 
CONSUMER_SECRET= 
TOKEN_KEY= 
TOKEN_SECRET= 
```

## Other variables

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
FORWARDING_IDS
```
*Chat ids to forward sent messages to*

# Usage:

Add .env file or set env variables through other means and run scripts below:

```
$ npm install  
$ npm start
```