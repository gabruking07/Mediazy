# Mediazy

Mediazy is a full-stack media downloader built with Next.js, Tailwind CSS, Node.js, Express, MongoDB, Redis, BullMQ, yt-dlp, gallery-dl, and FFmpeg.

## Features

- Automatic platform detection for regular video links, Instagram Reels, Facebook, TikTok, and Twitter/X
- Video preview with thumbnail, title, duration, detected platform, and reel/short badges
- Quality selection for MP4 downloads
- MP3 audio extraction
- Subtitle and thumbnail downloads when available
- Download progress UI, loading states, toast notifications, and responsive glassmorphism design
- MongoDB history collection
- Rate limiting, CORS, Helmet, URL validation, centralized error handling
- Temporary file cleanup after 10 minutes
- Redis metadata cache for repeated info/profile lookups
- BullMQ download queue with retry/backoff support
- Extractor fallback chain: yt-dlp first, gallery-dl metadata fallback, optional fallback API
- Rotating residential proxy pool through `ROTATING_RESIDENTIAL_PROXIES`
- Docker and Docker Compose support

## Prerequisites

- Node.js 20+
- MongoDB
- Redis
- FFmpeg installed and available on PATH
- yt-dlp support through `yt-dlp-exec`
- gallery-dl installed and available on PATH if you want the secondary extractor

## Local Development

```bash
npm run install:all
cp server/.env.example server/.env
cp client/.env.example client/.env
npm run dev
```

Frontend: `http://localhost:3000`

Backend: `http://localhost:5000`

## Environment

Server variables live in `server/.env`.

Client variables live in `client/.env`.

Useful yt-dlp server variables:

- `YTDLP_COOKIES_PATH` or `YTDLP_COOKIES_BASE64` for platforms that require browser cookies.
- `YTDLP_PROXY` and `YTDLP_USER_AGENT` for deployment-specific network routing.
- `ROTATING_RESIDENTIAL_PROXIES` for a comma-separated residential proxy pool.
- `YTDLP_SOCKET_TIMEOUT_SECONDS`, `YTDLP_RETRIES`, `YTDLP_FRAGMENT_RETRIES`, and `YTDLP_CONCURRENT_FRAGMENTS` for reliability and speed tuning.
- `YTDLP_SLEEP_REQUESTS_SECONDS`, `YTDLP_SLEEP_INTERVAL_SECONDS`, and `YTDLP_MAX_SLEEP_INTERVAL_SECONDS` for gentler request pacing.

Queue/cache variables:

- `REDIS_URL` enables Redis cache and BullMQ, for example `redis://localhost:6379`.
- `DOWNLOAD_QUEUE_ENABLED=false` keeps downloads synchronous even when Redis is configured.
- `DOWNLOAD_WORKER_CONCURRENCY` controls concurrent queued downloads.
- `REDIS_CACHE_TTL_SECONDS` controls metadata cache lifetime.

Extractor fallback variables:

- `GALLERY_DL_BINARY` defaults to `gallery-dl`.
- `EXTRACTOR_FALLBACK_API_URL` enables the final API fallback.
- `EXTRACTOR_FALLBACK_API_KEY` sends a bearer token to the fallback API.

## API

### `POST /api/info`

Returns video metadata and downloadable qualities.

```json
{
  "url": "https://example.com/video-page"
}
```

### `POST /api/download`

Creates a downloadable file and returns a temporary URL.

```json
{
  "url": "https://example.com/video-page",
  "type": "video",
  "quality": "720"
}
```

`type` can be `video`, `audio`, `subtitles`, or `thumbnail`.

## Deployment Notes

1. Deploy MongoDB with MongoDB Atlas or a managed MongoDB service.
2. Deploy Redis for BullMQ and the metadata cache.
3. Deploy `server/` on a Node host that supports long-running processes, FFmpeg, yt-dlp, and gallery-dl.
4. Set `MONGO_URI`, `REDIS_URL`, `CLIENT_URL`, and optionally `PUBLIC_BASE_URL` in production.
5. Build and serve the Next client with `npm run build --prefix client` and `npm run start --prefix client`.

Important: downloading content from third-party platforms can be restricted by platform terms, content rights, or local law. Deploy with clear user-facing policies and only allow lawful downloads.

## Docker

```bash
docker compose up --build
```

Client: `http://localhost:3000`

Server: `http://localhost:5000`
