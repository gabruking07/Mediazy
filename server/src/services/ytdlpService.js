import fs from 'fs-extra';
import os from 'node:os';
import path from 'node:path';
import sanitize from 'sanitize-filename';
import ytdlp from 'yt-dlp-exec';
import { nanoid } from 'nanoid';
import { downloadsDir, publicDownloadUrl } from '../utils/files.js';
import { isShortFormVideo } from '../utils/platform.js';

const intFromEnv = (name, fallback) => {
  const value = Number.parseInt(process.env[name], 10);
  return Number.isFinite(value) ? value : fallback;
};

const boolFromEnv = (name, fallback) => {
  const value = process.env[name];
  if (value === undefined) return fallback;
  return ['1', 'true', 'yes', 'on'].includes(value.toLowerCase());
};

const optionalIntOption = (name, optionName) => {
  const value = Number.parseInt(process.env[name], 10);
  return Number.isFinite(value) ? { [optionName]: value } : {};
};

const ytdlpBaseOptions = {
  noWarnings: true,
  preferFreeFormats: true,
  noPlaylist: true,
  forceIpv4: boolFromEnv('YTDLP_FORCE_IPV4', true),
  socketTimeout: intFromEnv('YTDLP_SOCKET_TIMEOUT_SECONDS', 30),
  retries: intFromEnv('YTDLP_RETRIES', 5),
  fragmentRetries: intFromEnv('YTDLP_FRAGMENT_RETRIES', 5),
  extractorRetries: intFromEnv('YTDLP_EXTRACTOR_RETRIES', 3),
  fileAccessRetries: intFromEnv('YTDLP_FILE_ACCESS_RETRIES', 3),
  concurrentFragments: intFromEnv('YTDLP_CONCURRENT_FRAGMENTS', 4)
};

const runtimeCookiesPath = process.env.YTDLP_COOKIES_PATH ||
  (process.env.YTDLP_COOKIES_BASE64 ? path.join(os.tmpdir(), 'mediazy-ytdlp-cookies.txt') : '');
let cookiesReady;

const ensureCookiesFile = async () => {
  if (process.env.YTDLP_COOKIES_PATH) {
    return process.env.YTDLP_COOKIES_PATH;
  }

  if (!process.env.YTDLP_COOKIES_BASE64) {
    return '';
  }

  if (!cookiesReady) {
    cookiesReady = fs.outputFile(
      runtimeCookiesPath,
      Buffer.from(process.env.YTDLP_COOKIES_BASE64, 'base64').toString('utf8'),
      { mode: 0o600 }
    ).then(() => runtimeCookiesPath);
  }

  return cookiesReady;
};

const runtimeOptions = async () => {
  const cookies = await ensureCookiesFile();
  return {
    ...(cookies ? { cookies } : {}),
    ...(process.env.YTDLP_PROXY ? { proxy: process.env.YTDLP_PROXY } : {}),
    ...(process.env.YTDLP_USER_AGENT ? { userAgent: process.env.YTDLP_USER_AGENT } : {}),
    ...optionalIntOption('YTDLP_SLEEP_REQUESTS_SECONDS', 'sleepRequests'),
    ...optionalIntOption('YTDLP_SLEEP_INTERVAL_SECONDS', 'sleepInterval'),
    ...optionalIntOption('YTDLP_MAX_SLEEP_INTERVAL_SECONDS', 'maxSleepInterval')
  };
};

const youtubeOptionVariants = [
  { extractorArgs: 'youtube:player_client=android,web' },
  { extractorArgs: 'youtube:player_client=web' },
  { extractorArgs: 'youtube:player_client=android' },
  {}
];

const isYouTubeUrl = (url) => {
  try {
    const hostname = new URL(url).hostname.replace(/^www\./i, '');
    return /(^|\.)((youtube\.com)|(youtu\.be))$/i.test(hostname);
  } catch {
    return false;
  }
};

const optionVariantsForUrl = (url) => (
  isYouTubeUrl(url) ? youtubeOptionVariants : [{}]
);

const secondsToDuration = (seconds) => {
  if (!seconds) return 'Unknown';

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const rest = Math.floor(seconds % 60);

  if (hours) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(rest).padStart(2, '0')}`;
  }

  return `${minutes}:${String(rest).padStart(2, '0')}`;
};

const uniqueQualities = (formats = []) => {
  const heights = formats
    .filter((format) => format.vcodec !== 'none' && format.height)
    .map((format) => Number(format.height))
    .filter(Boolean);

  return [...new Set(heights)]
    .sort((a, b) => b - a)
    .map((height) => ({
      label: `${height}p`,
      value: String(height)
    }));
};

const formatYtdlpError = (error) => (
  error.stderr ||
  error.stdout ||
  error.shortMessage ||
  error.message ||
  'Unknown yt-dlp error'
);

const publicYtdlpError = (error, platform = 'This platform') => {
  const rawMessage = formatYtdlpError(error);
  const lowerMessage = rawMessage.toLowerCase();

  if (/requested format is not available|no video formats found|format .* not available/i.test(rawMessage)) {
    return 'That quality or format is not available for this media. Try Best available or another format.';
  }

  if (/private|members-only|login required|sign in|cookies|not authorized|forbidden|confirm you.?re not a bot/i.test(rawMessage)) {
    return `${platform} may require cookies, login access, or a public video link. Try a public link or configure server cookies.`;
  }

  if (/unavailable|removed|deleted|does not exist|not found|copyright/i.test(lowerMessage)) {
    return 'This video is unavailable, removed, or blocked by the platform.';
  }

  if (/timeout|timed out|econnreset|network|unable to download webpage|temporary failure/i.test(lowerMessage)) {
    return 'The platform did not respond in time. Try again in a moment or check the server network connection.';
  }

  if (/unsupported url|no suitable extractor/i.test(lowerMessage)) {
    return 'This link is not supported yet. Try a direct public video link from one of the listed platforms.';
  }

  return rawMessage
    .replace(/\s+/g, ' ')
    .replace(/https?:\/\/\S+/g, '')
    .replace(/Cookie: \S+/gi, 'Cookie: [redacted]')
    .replace(/Authorization: \S+/gi, 'Authorization: [redacted]')
    .slice(0, 300);
};

const runYtdlpWithFallbacks = async ({ url, platform, options }) => {
  let lastError;
  const extraOptions = await runtimeOptions();

  for (const variant of optionVariantsForUrl(url)) {
    try {
      return await ytdlp(url, {
        ...ytdlpBaseOptions,
        ...extraOptions,
        ...variant,
        ...options
      });
    } catch (error) {
      lastError = error;
      console.error('yt-dlp failed:', formatYtdlpError(error));
    }
  }

  if (lastError) {
    lastError.publicMessage = publicYtdlpError(lastError, platform);
  }

  throw lastError;
};

export const fetchMediaInfo = async ({ url, platform }) => {
  let info;

  try {
    info = await runYtdlpWithFallbacks({
      url,
      platform,
      options: {
        dumpSingleJson: true,
        skipDownload: true
      }
    });
  } catch (error) {
    console.error('yt-dlp info failed:', formatYtdlpError(error));
    throw error;
  }

  const qualities = uniqueQualities(info.formats);

  return {
    id: info.id,
    url,
    platform,
    title: info.title || 'Untitled video',
    thumbnail: info.thumbnail,
    duration: info.duration,
    durationText: secondsToDuration(info.duration),
    uploader: info.uploader || info.channel || info.creator,
    webpageUrl: info.webpage_url || url,
    isShortForm: isShortFormVideo({ platform, url, duration: info.duration }),
    qualities: qualities.length ? qualities : [{ label: 'Best available', value: 'best' }],
    hasSubtitles: Boolean(info.subtitles && Object.keys(info.subtitles).length),
    automaticCaptions: Boolean(info.automatic_captions && Object.keys(info.automatic_captions).length)
  };
};

const buildFileName = ({ title, type, extension }) => {
  const safeTitle = sanitize(title || 'mediazy-download').slice(0, 80) || 'mediazy-download';
  return `${safeTitle}-${nanoid(8)}.${extension}`;
};

export const createDownload = async ({ url, platform, type, quality, title }) => {
  let extension = 'mp4';
  let ytdlpOptions = {};

  if (type === 'audio') {
    extension = 'mp3';
    ytdlpOptions = {
      extractAudio: true,
      audioFormat: 'mp3',
      audioQuality: 0
    };
  } else if (type === 'subtitles') {
    extension = 'vtt';
    ytdlpOptions = {
      skipDownload: true,
      writeSub: true,
      writeAutoSub: true,
      subLangs: 'en.*',
      subFormat: 'vtt'
    };
  } else if (type === 'thumbnail') {
    extension = 'jpg';
    ytdlpOptions = {
      skipDownload: true,
      writeThumbnail: true,
      convertThumbnails: 'jpg'
    };
  } else {
    const format = quality && quality !== 'best'
      ? `bestvideo[height<=${quality}][ext=mp4]+bestaudio[ext=m4a]/best[height<=${quality}][ext=mp4]/best`
      : 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best';

    ytdlpOptions = {
      format,
      mergeOutputFormat: 'mp4'
    };
  }

  const requestedFileName = buildFileName({ title, type, extension });
  const outputTemplate = path.join(downloadsDir, requestedFileName);

  await runYtdlpWithFallbacks({
    url,
    platform,
    options: {
      ...ytdlpOptions,
      output: outputTemplate
    }
  });

  const files = await fs.readdir(downloadsDir);
  const fileBase = requestedFileName.replace(/\.[^.]+$/, '');
  const generatedFile = files.find((file) => file.startsWith(fileBase)) || requestedFileName;
  const finalPath = path.join(downloadsDir, generatedFile);
  const stat = await fs.stat(finalPath);

  return {
    fileName: generatedFile,
    fileSize: stat.size,
    downloadUrl: publicDownloadUrl(generatedFile),
    expiresInMinutes: Number(process.env.DOWNLOAD_TTL_MINUTES || 10)
  };
};
