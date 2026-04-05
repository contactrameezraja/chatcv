# ChatCV - Rameez Raja

AI-powered interactive CV. Recruiters can chat with my resume, ask about experience, and run instant job fit analysis.

React frontend, Express server, Claude API (Anthropic), Docker-ready.

## Features

- Chat with CV: natural conversation about experience, skills, achievements
- Job Fit Analysis: paste a job description, get a match percentage and breakdown
- Right to Work and Location info: instant answers for recruiters
- Daily message cap: controls API spend (default 50 messages/day)
- Photos and personal interests revealed when asked
- Docker-ready: deploy anywhere in minutes

## Quick Start (Docker)

### 1. Get an Anthropic API key

- Go to [console.anthropic.com](https://console.anthropic.com/)
- Create an API key (starts with `sk-ant-...`)
- Set a monthly spending limit under Settings > Limits (e.g. $10)

### 2. Clone and configure

```bash
git clone https://github.com/YOUR_USERNAME/chatcv.git
cd chatcv
cp .env.example .env
```

Edit `.env`:

```
ANTHROPIC_API_KEY=sk-ant-your_key_here
DAILY_MESSAGE_CAP=50
```

### 3. Run it

```bash
docker compose up --build
```

Head to [http://localhost:8000](http://localhost:8000) and start chatting.

## Run without Docker

```bash
npm install
npm run build
npm start
```

Or for development (hot reload):

```bash
npm install
# Terminal 1: start the API server
ANTHROPIC_API_KEY=sk-ant-your_key node server.js
# Terminal 2: start the Vite dev server (proxies /api to server)
npm run dev
```

## Deploy to the Cloud

The Docker container runs anywhere. Pick your platform:

### Render.com (free tier)

1. Push to GitHub
2. Go to [render.com](https://render.com), create a new "Web Service"
3. Connect your GitHub repo
4. Set environment: Docker
5. Add environment variables: `ANTHROPIC_API_KEY`, `DAILY_MESSAGE_CAP`
6. Deploy

### Railway.app ($5 free credit/month)

1. Push to GitHub
2. Go to [railway.app](https://railway.app), create new project from GitHub
3. Add environment variables
4. Deploy

### Any VPS (DigitalOcean, Hetzner, Linode, etc.)

```bash
ssh your-server
git clone https://github.com/YOUR_USERNAME/chatcv.git
cd chatcv
cp .env.example .env
# Edit .env with your key
docker compose up -d --build
```

To expose it publicly, put Nginx or Caddy in front:

```nginx
# /etc/nginx/sites-available/chatcv
server {
    server_name chatcv.yourdomain.com;
    location / {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

Then add SSL with: `sudo certbot --nginx -d chatcv.yourdomain.com`

## Cost

- Anthropic API: roughly 1-2p per message
- 50 messages/day = max ~$1/day
- Set a spending limit in the Anthropic console as a safety net
- Hosting: free on Render/Railway, or ~$5/month on a VPS

## Project structure

```
server.js          Express server (API proxy + static files)
Dockerfile         Multi-stage Docker build
docker-compose.yml One-command deployment
src/App.jsx        Main React component
src/photos.js      Base64 photo data
src/main.jsx       React entry point
index.html         HTML shell
vite.config.js     Build config + dev proxy
```

## How it works

1. `npm run build` compiles the React app into `dist/`
2. `server.js` serves `dist/` as static files and handles `/api/chat`
3. `/api/chat` proxies requests to the Anthropic API (key stays server-side)
4. In-memory counter enforces the daily message cap
5. Docker wraps it all into a single deployable container

## Credits

Inspired by [ChatCV](https://github.com/FinnBehrendt/ChatCV) by Finn Behrendt.
Design inspired by [Visual Cinnamon](https://www.visualcinnamon.com/) by Nadieh Bremer.
