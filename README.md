Simple program for reposting Twitter posts to Telegram chats. You to set up your own Telegram bot, add it to a Telegram chat and get the chat_id. Add all necessary env variables in a .env file or otherwise. It gets all recent (the last 20) tweets and saves in local memory. 

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

## Other variable
How often to check Twitter in milliseconds (5000 = 5 seconds).

```
FREQUENCY=
```


# Usage:

Add .env file or set env variables through other means and run scripts below:

```
$ npm install  
$ npm start
```