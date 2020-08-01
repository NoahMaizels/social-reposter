Simple program for reposting Twitter posts to a list of Telegram target channels `TARGET_CHATS` (not group chats, channels), and optionally forwarding from those target channels to a second list target group chats `FORWARDING_IDS` (for example, sending first to several announcement channels, and then forwarding to several group chats).

All messages posted by others in `TARGET_CHATS` will ALSO be forwarded to all `FORWARDING_IDS` chats.

If you would like for the bot to forward messages from a channel, but not send Twitter updates from that channel, add that channel to the `FORWARDING_ONLY` env variable of comma separated values.

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
TARGET_CHATS=chatid1,chatid2
```
A comma separated list of chats to send Twitter updates to. All messages posted in `TARGET_CHATS` will also be sent to all chats in `FORWARDING_IDS`, unless those `TARGET_CHATS` ids have been added to `FORWARDING_ONLY`. 

```
FORWARDING_IDS
```
*Chat ids to forward sent messages to*

```
FORWARDING_ONLY
```
*Channel ids you want to forward messages from but not send Twitter updates to*

# Usage:

Add .env file or set env variables through other means and run scripts below:

```
$ npm install  
$ npm start
```