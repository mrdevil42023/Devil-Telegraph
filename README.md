# Devil Telegraph Bot

A Telegram bot that uploads photos, videos, GIFs, and audio to Catbox.moe and returns a permanent shareable link.

## Setup

1. Get your bot token from [@BotFather](https://t.me/BotFather) on Telegram
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file (copy from `.env.example`):
   ```
   TELEGRAM_BOT_TOKEN=your_token_here
   ```
4. Run the bot:
   ```
   npm start
   ```

---

## Deploy to Railway

1. Push this folder to a GitHub repo
2. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub
3. Add environment variable: `TELEGRAM_BOT_TOKEN`
4. Done — Railway auto-detects Node.js and runs `node index.js`

---

## Deploy to Render

1. Push this folder to a GitHub repo
2. Go to [render.com](https://render.com) → New → Background Worker
3. Connect your GitHub repo
4. Set Build Command: `npm install`
5. Set Start Command: `node index.js`
6. Add environment variable: `TELEGRAM_BOT_TOKEN`
7. Click Deploy

---

## Deploy to Heroku

1. Install [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)
2. Run:
   ```bash
   heroku login
   heroku create your-bot-name
   heroku config:set TELEGRAM_BOT_TOKEN=your_token_here
   git push heroku main
   heroku ps:scale worker=1
   ```
   > Note: Scale `worker`, not `web` — this bot uses polling, not a web server.

---

## Supported File Types

- Photos (JPG, JPEG, PNG, WebP)
- Videos (MP4, WebM, MOV)
- GIFs / Animations
- Audio (MP3, OGG)
- Video notes (circles)

Max file size: **200MB**
