# serverless-telegram-echo-bot

> Telegram Bot using AWS API Gateway and AWS Lambda using awesome **[serverless](https://github.com/serverless/)** package.

![](https://github.com/noveogroup-amorgunov/serverless-telegram-echo-bot/raw/master/preview.png)

## Setup

### Create the telegram bot

- Go to [Telegram Web](https://web.telegram.org/).
- Start a chat with [@BotFather](https://telegram.me/BotFather).
- Type `/start`.
- Type `/newbot` to create a new bot.
- After you created the bot, you get HTTP API access token.

### Register in AWS

- Create AWS account [here](http://aws.amazon.com/)
- Get AWS credentials ([read more](https://serverless.com/framework/docs/providers/aws/guide/credentials/) how get it).
- Export credentials to `~/.bash_profile` or terminal:

```bash
export AWS_ACCESS_KEY_ID=<ACCESS_KEY_ID>
export AWS_SECRET_ACCESS_KEY=<SECRET_ACCESS_KEY>
```

or add these variables to `~/.aws/credentials` (I recommend this way):

```
[default]
aws_access_key_id = <ACCESS_KEY_ID>
aws_secret_access_key = <SECRET_ACCESS_KEY>
```

### Deploy lambda

- Create `.env` file and add telegram access token. Also you can add telegram proxy url (optional):

```env
TELEGRAM_TOKEN=<TELEGRAM_ACCESS_TOKEN>
TELEGRAM_PROXY=
```

- Deploy lambda:

```bash
npm run deploy
```

You get endpoints, like that

```
endpoints:
  POST - https://dfc5ofqqm0.execute-api.us-east-2.amazonaws.com/dev/
```


### Set Telegram Webhook
- Replace <TELEGRAM_ACCESS_TOKEN> with your Telegram HTTP API access token obtained in the first step.
- Replace <INVOKE_URL> with your endpoint url which you get in the previous step.

Run this command:

```
$ curl --data "url=<INVOKE_URL>" "https://api.telegram.org/bot<TELEGRAM_ACCESS_TOKEN>/setWebhook"
```

You should get back a response similar to this:
```
$ {"ok":true,"result":true,"description":"Webhook was set"}
```

### Testing via Telegram

- Send message to your Telegram Bot that you have created.
- Type any message.
- You should get your message back.
