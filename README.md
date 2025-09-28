# PrimaSpot

Instagram influencer scraping + lightweight analytics dashboard.

## What this is
PrimaSpot spins up a headless (actually currently non–headless) Puppeteer browser, visits a public Instagram profile, grabs high‑level profile stats plus a slice of recent posts and reels, stores them in MongoDB, and shows them in a clean React UI (Vite + Tailwind). No official Instagram API keys; just scripted browsing. Good for demos / internal experimentation – not for production scale or violating ToS.

## Current Capabilities
Backend (Node + Express + Puppeteer + MongoDB)
- Scrape profile (username, name guess, bio, avatar, followers, following, posts count)
- Scrape limited recent posts (id, image, pseudo engagement placeholders)
- Scrape limited recent reels (id, thumbnail, pseudo engagement placeholders)
- REST endpoints under `/api/scraping/*`
- Basic hardening: rate limiter, Helmet, compression, CORS

Frontend (React + Vite)
- Search a username and trigger a full scrape
- Show profile header + counts
- Grid of posts & reels (sampled)
- Basic analytics placeholder components
- Smooth animations (Framer Motion) & icons (Lucide)

Note: Some analytics numbers (likes, comments, views) are currently mock/randomized placeholders generated during scraping – adjust logic in `backend/services/InstagramService.js` if you want real metrics (would require deeper per‑post navigation & parsing).

## Tech Stack
- Backend: Node.js, Express, Puppeteer, Mongoose, MongoDB
- Frontend: React, Vite, Tailwind CSS, Framer Motion, Recharts (placeholder), Axios

## Quick Start
Clone and install both sides.

Backend
```bash
cd backend
npm install
copy .env.example .env  # (Windows PowerShell) create your env file
# Edit .env with Mongo connection + optional FRONTEND_URL
npm run dev
```

Frontend
```bash
cd frontend
npm install
npm run dev
```

Visit: http://localhost:5173

Search for a public Instagram username (without @). Wait (can be 10–40s depending on network / IG throttling). Data appears when scraping finishes.

## Environment Variables (backend/.env)
Minimal required:
```
MONGODB_URI=mongodb://localhost:27017/primaspot
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

You do NOT currently need Instagram credentials because this approach just visits public pages. If you add login later, extend the service and add credentials here.

## Key Endpoints
All prefixed with `/api/scraping`:
- POST `/profile/:username`  – scrape only profile
- POST `/posts/:username`    – scrape limited posts
- POST `/reels/:username`    – scrape limited reels
- POST `/complete/:username` – profile + posts + reels (what the UI uses)
- GET  `/status`             – simple recent scrape summary

## Where to Tweak
- Scrape logic: `backend/services/InstagramService.js`
- Routes / API: `backend/routes/scraping.js`
- React data fetch: `frontend/src/services/ApiService.js`
- UI rendering: `frontend/src/App.jsx` and components

## Limitations / Reality Check
- Instagram markup changes will break selectors – expect maintenance.
- Engagement numbers are placeholder randoms (clearly marked in code).
- No login -> private / limited profiles won't return useful data.
- No serious error retry / backoff yet.
- Not production hardened (no clustering, no distributed queue, etc.).

## Future Nice-to-Haves
- Persist real per‑post metrics by opening each post modal
- Real analytics (averages, growth curves, engagement rate)


