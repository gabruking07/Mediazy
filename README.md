# Mediazy

Mediazy is a full-stack MERN video downloader built with React, Vite, Tailwind CSS, Node.js, Express, MongoDB, yt-dlp, and FFmpeg.

## Features

- Automatic platform detection for YouTube, Instagram Reels, Facebook, TikTok, and Twitter/X
- Video preview with thumbnail, title, duration, detected platform, and reel/short badges
- Quality selection for MP4 downloads
- MP3 audio extraction
- Subtitle and thumbnail downloads when available
- Download progress UI, loading states, toast notifications, and responsive glassmorphism design
- MongoDB history collection
- Rate limiting, CORS, Helmet, URL validation, centralized error handling
- Temporary file cleanup after 10 minutes
- Docker and Docker Compose support

## Prerequisites

- Node.js 20+
- MongoDB
- FFmpeg installed and available on PATH
- yt-dlp support through `yt-dlp-exec`

## Local Development

```bash
npm run install:all
cp server/.env.example server/.env
cp client/.env.example client/.env
npm run dev
```

Frontend: `http://localhost:5173`

Backend: `http://localhost:5000`

## Environment

Server variables live in `server/.env`.

Client variables live in `client/.env`.

## API

### `POST /api/info`

Returns video metadata and downloadable qualities.

```json
{
  "url": "https://www.youtube.com/watch?v=..."
}
```

### `POST /api/download`

Creates a downloadable file and returns a temporary URL.

```json
{
  "url": "https://www.youtube.com/watch?v=...",
  "type": "video",
  "quality": "720"
}
```

`type` can be `video`, `audio`, `subtitles`, or `thumbnail`.

## Deployment Notes

1. Deploy MongoDB with MongoDB Atlas or a managed MongoDB service.
2. Deploy `server/` on a Node host that supports long-running processes and FFmpeg.
3. Set `MONGO_URI`, `CLIENT_URL`, and `PUBLIC_BASE_URL` in production.
4. Build the client with `npm run build --prefix client`.
5. Serve the built client from a static host or configure Express/CDN routing.

Important: downloading content from third-party platforms can be restricted by platform terms, content rights, or local law. Deploy with clear user-facing policies and only allow lawful downloads.

## Docker

```bash
docker compose up --build
```

Client: `http://localhost:5173`

Server: `http://localhost:5000`
