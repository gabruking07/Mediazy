FROM node:20-bookworm-slim

WORKDIR /app

RUN apt-get update \
  && apt-get install -y --no-install-recommends ffmpeg python3 ca-certificates gallery-dl \
  && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm install --omit=dev
RUN ./node_modules/yt-dlp-exec/bin/yt-dlp -U || true

COPY src ./src
COPY downloads ./downloads

EXPOSE 5000

CMD ["npm", "start"]
