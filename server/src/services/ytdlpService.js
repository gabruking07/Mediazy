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

const instagramCookieHeader = async () => {
  const cookiesPath = await ensureCookiesFile();
  if (!cookiesPath) return '';

  try {
    const content = await fs.readFile(cookiesPath, 'utf8');
    return content
      .split(/\r?\n/)
      .map((line) => line.replace(/^#HttpOnly_/, ''))
      .filter((line) => line && !line.startsWith('#'))
      .map((line) => line.split('\t'))
      .filter((parts) => parts.length >= 7 && /(^|\.)instagram\.com$/i.test(parts[0]))
      .map((parts) => `${parts[5]}=${parts[6]}`)
      .join('; ');
  } catch {
    return '';
  }
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

const isInstagramCollectionUrl = (url) => {
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname.replace(/^www\./i, '');
    const pathname = parsed.pathname.toLowerCase();

    return /(^|\.)instagram\.com$/i.test(hostname) &&
      (
        pathname.startsWith('/stories/') ||
        pathname.startsWith('/stories/highlights/') ||
        parsed.searchParams.get('mediazy') === 'highlights'
      );
  } catch {
    return false;
  }
};

const instagramUsernameFromUrl = (url) => {
  const parsed = new URL(url);
  return parsed.pathname.split('/').filter(Boolean)[0] || '';
};

const instagramHeaders = async () => {
  const cookie = await instagramCookieHeader();
  return {
    'user-agent': process.env.YTDLP_USER_AGENT || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
    'x-ig-app-id': '936619743392459',
    'x-asbd-id': '129477',
    'x-requested-with': 'XMLHttpRequest',
    ...(cookie ? { cookie } : {})
  };
};

const isInstagramHighlightsUsernameUrl = (url) => {
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname.replace(/^www\./i, '');
    return /(^|\.)instagram\.com$/i.test(hostname) &&
      parsed.searchParams.get('mediazy') === 'highlights' &&
      Boolean(instagramUsernameFromUrl(url));
  } catch {
    return false;
  }
};

const fetchInstagramJson = async (url) => {
  const response = await fetch(url, { headers: await instagramHeaders() });
  if (!response.ok) {
    const error = new Error(`Instagram returned ${response.status}`);
    error.publicMessage = 'Instagram highlights could not be loaded for this username. Instagram often requires a logged-in server session even for public profiles.';
    throw error;
  }
  return response.json();
};

const resolveInstagramHighlights = async (url) => {
  const username = instagramUsernameFromUrl(url);
  const profile = await fetchInstagramJson(`https://www.instagram.com/api/v1/users/web_profile_info/?username=${encodeURIComponent(username)}`);
  const userId = profile?.data?.user?.id;

  if (!userId) {
    const error = new Error('Instagram user was not found.');
    error.publicMessage = 'Instagram user was not found or highlights are not available.';
    throw error;
  }

  const tray = await fetchInstagramJson(`https://www.instagram.com/api/v1/highlights/${userId}/highlights_tray/`);
  const highlights = (tray?.tray || [])
    .map((item) => ({
      id: item.id,
      title: item.title || 'Highlight',
      thumbnail: item.cover_media?.cropped_image_version?.url || item.cover_media?.thumbnail_url
    }))
    .filter((item) => item.id);

  if (!highlights.length) {
    const error = new Error('No Instagram highlights found.');
    error.publicMessage = 'No highlights were found for this username.';
    throw error;
  }

  return {
    username,
    highlights,
    urls: highlights.map((item) => `https://www.instagram.com/stories/highlights/${item.id}/`)
  };
};

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

const uniqueCollectionQualities = (entries = []) => {
  const formats = entries.flatMap((entry) => entry?.formats || []);
  return uniqueQualities(formats);
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
    return `${platform} needs a logged-in server session for this request. This can happen even when the Instagram profile is public.`;
  }

  if (/unavailable|removed|deleted|does not exist|not found|copyright/i.test(lowerMessage)) {
    return 'This video is unavailable, removed, or blocked by the platform.';
  }

  if (/timeout|timed out|econnreset|network|unable to download webpage|temporary failure/i.test(lowerMessage)) {
    return 'The platform did not respond in time. Try again in a moment or check the server network connection.';
  }

  if (/unsupported url|no suitable extractor/i.test(lowerMessage)) {
    return 'This link is not supported yet. Try a direct public video link from another website.';
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
  const { allowPlaylist, ...ytdlpOptions } = options;
  const baseOptions = allowPlaylist
    ? Object.fromEntries(Object.entries(ytdlpBaseOptions).filter(([key]) => key !== 'noPlaylist'))
    : ytdlpBaseOptions;

  for (const variant of optionVariantsForUrl(url)) {
    try {
      return await ytdlp(url, {
        ...baseOptions,
        ...extraOptions,
        ...variant,
        ...ytdlpOptions
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
  if (isInstagramHighlightsUsernameUrl(url)) {
    const { username, highlights } = await resolveInstagramHighlights(url);

    return {
      id: username,
      url,
      platform,
      title: `${username} Instagram highlights`,
      thumbnail: highlights[0]?.thumbnail,
      duration: null,
      durationText: 'Multiple items',
      uploader: username,
      webpageUrl: `https://www.instagram.com/${username}/`,
      isShortForm: false,
      isCollection: true,
      entryCount: highlights.length,
      qualities: [{ label: 'Best available', value: 'best' }],
      hasSubtitles: false,
      automaticCaptions: false
    };
  }

  let info;

  try {
    info = await runYtdlpWithFallbacks({
      url,
      platform,
      options: {
        dumpSingleJson: true,
        skipDownload: true,
        ...(isInstagramCollectionUrl(url) ? { allowPlaylist: true } : {})
      }
    });
  } catch (error) {
    console.error('yt-dlp info failed:', formatYtdlpError(error));
    throw error;
  }

  const qualities = uniqueQualities(info.formats);
  const isCollection = Boolean(info.entries?.length);
  const collectionQualities = isCollection ? uniqueCollectionQualities(info.entries) : [];
  const firstEntry = isCollection ? info.entries.find(Boolean) : null;

  return {
    id: info.id,
    url,
    platform,
    title: info.title || 'Untitled video',
    thumbnail: info.thumbnail || firstEntry?.thumbnail,
    duration: info.duration,
    durationText: secondsToDuration(info.duration),
    uploader: info.uploader || info.channel || info.creator,
    webpageUrl: info.webpage_url || url,
    isShortForm: isShortFormVideo({ platform, url, duration: info.duration }),
    isCollection,
    entryCount: isCollection ? info.entries.length : 0,
    qualities: (isCollection ? collectionQualities : qualities).length
      ? (isCollection ? collectionQualities : qualities)
      : [{ label: 'Best available', value: 'best' }],
    hasSubtitles: Boolean(info.subtitles && Object.keys(info.subtitles).length),
    automaticCaptions: Boolean(info.automatic_captions && Object.keys(info.automatic_captions).length)
  };
};

const buildFileName = ({ title, type, extension }) => {
  const safeTitle = sanitize(title || 'mediazy-download').slice(0, 80) || 'mediazy-download';
  return `${safeTitle}-${nanoid(8)}.${extension}`;
};

const crcTable = Array.from({ length: 256 }, (_, index) => {
  let value = index;
  for (let bit = 0; bit < 8; bit += 1) {
    value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
  }
  return value >>> 0;
});

const crc32 = (buffer) => {
  let crc = 0xffffffff;
  for (const byte of buffer) {
    crc = crcTable[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
};

const dosDateTime = (date = new Date()) => {
  const year = Math.max(date.getFullYear(), 1980);
  return {
    time: (date.getHours() << 11) | (date.getMinutes() << 5) | Math.floor(date.getSeconds() / 2),
    date: ((year - 1980) << 9) | ((date.getMonth() + 1) << 5) | date.getDate()
  };
};

const writeZip = async ({ files, outputPath }) => {
  const localParts = [];
  const centralParts = [];
  let offset = 0;

  for (const file of files) {
    const data = await fs.readFile(file.path);
    const name = Buffer.from(file.name.replace(/\\/g, '/'));
    const crc = crc32(data);
    const { time, date } = dosDateTime();

    const localHeader = Buffer.alloc(30);
    localHeader.writeUInt32LE(0x04034b50, 0);
    localHeader.writeUInt16LE(20, 4);
    localHeader.writeUInt16LE(0, 6);
    localHeader.writeUInt16LE(0, 8);
    localHeader.writeUInt16LE(time, 10);
    localHeader.writeUInt16LE(date, 12);
    localHeader.writeUInt32LE(crc, 14);
    localHeader.writeUInt32LE(data.length, 18);
    localHeader.writeUInt32LE(data.length, 22);
    localHeader.writeUInt16LE(name.length, 26);
    localHeader.writeUInt16LE(0, 28);

    localParts.push(localHeader, name, data);

    const centralHeader = Buffer.alloc(46);
    centralHeader.writeUInt32LE(0x02014b50, 0);
    centralHeader.writeUInt16LE(20, 4);
    centralHeader.writeUInt16LE(20, 6);
    centralHeader.writeUInt16LE(0, 8);
    centralHeader.writeUInt16LE(0, 10);
    centralHeader.writeUInt16LE(time, 12);
    centralHeader.writeUInt16LE(date, 14);
    centralHeader.writeUInt32LE(crc, 16);
    centralHeader.writeUInt32LE(data.length, 20);
    centralHeader.writeUInt32LE(data.length, 24);
    centralHeader.writeUInt16LE(name.length, 28);
    centralHeader.writeUInt16LE(0, 30);
    centralHeader.writeUInt16LE(0, 32);
    centralHeader.writeUInt16LE(0, 34);
    centralHeader.writeUInt16LE(0, 36);
    centralHeader.writeUInt32LE(0, 38);
    centralHeader.writeUInt32LE(offset, 42);

    centralParts.push(centralHeader, name);
    offset += localHeader.length + name.length + data.length;
  }

  const centralSize = centralParts.reduce((total, part) => total + part.length, 0);
  const endHeader = Buffer.alloc(22);
  endHeader.writeUInt32LE(0x06054b50, 0);
  endHeader.writeUInt16LE(0, 4);
  endHeader.writeUInt16LE(0, 6);
  endHeader.writeUInt16LE(files.length, 8);
  endHeader.writeUInt16LE(files.length, 10);
  endHeader.writeUInt32LE(centralSize, 12);
  endHeader.writeUInt32LE(offset, 16);
  endHeader.writeUInt16LE(0, 20);

  await fs.writeFile(outputPath, Buffer.concat([...localParts, ...centralParts, endHeader]));
};

export const createDownload = async ({ url, platform, type, quality, format = 'mp4', title }) => {
  const videoFormat = ['mp4', 'webm', 'mkv'].includes(format) ? format : 'mp4';
  const isCollection = isInstagramCollectionUrl(url);
  const highlightsTarget = isInstagramHighlightsUsernameUrl(url)
    ? await resolveInstagramHighlights(url)
    : null;
  const collectionUrls = highlightsTarget?.urls || [url];
  let extension = videoFormat;
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
    const formatSelector = quality && quality !== 'best'
      ? `bestvideo[height<=${quality}][ext=${videoFormat}]+bestaudio/best[height<=${quality}][ext=${videoFormat}]/best[height<=${quality}]/best`
      : `bestvideo[ext=${videoFormat}]+bestaudio/best[ext=${videoFormat}]/best`;

    ytdlpOptions = {
      format: formatSelector,
      mergeOutputFormat: videoFormat
    };
  }

  if (isCollection) {
    extension = 'zip';
  }

  const requestedFileName = buildFileName({ title, type, extension });
  const fileBase = requestedFileName.replace(/\.[^.]+$/, '');
  const outputTemplate = isCollection
    ? path.join(downloadsDir, `${fileBase}-%(playlist_index)03d-%(id)s.%(ext)s`)
    : path.join(downloadsDir, requestedFileName);

  for (const [index, collectionUrl] of collectionUrls.entries()) {
    await runYtdlpWithFallbacks({
      url: collectionUrl,
      platform,
      options: {
        ...ytdlpOptions,
        ...(isCollection ? { allowPlaylist: true } : {}),
        output: collectionUrls.length > 1
          ? path.join(downloadsDir, `${fileBase}-${String(index + 1).padStart(2, '0')}-%(playlist_index)03d-%(id)s.%(ext)s`)
          : outputTemplate
      }
    });
  }

  const files = await fs.readdir(downloadsDir);
  const matchingFiles = files.filter((file) => file.startsWith(fileBase) && file !== requestedFileName);

  if (isCollection) {
    if (!matchingFiles.length) {
      const error = new Error('No story or highlight media was found.');
      error.publicMessage = 'No active story or highlight media was found. Instagram may require a logged-in server session even for public profiles.';
      throw error;
    }

    const zipPath = path.join(downloadsDir, requestedFileName);
    await writeZip({
      files: matchingFiles.map((file) => ({
        name: file.replace(`${fileBase}-`, ''),
        path: path.join(downloadsDir, file)
      })),
      outputPath: zipPath
    });
    await Promise.all(matchingFiles.map((file) => fs.remove(path.join(downloadsDir, file))));
  }

  const generatedFile = isCollection
    ? requestedFileName
    : files.find((file) => file.startsWith(fileBase)) || requestedFileName;
  const finalPath = path.join(downloadsDir, generatedFile);
  const stat = await fs.stat(finalPath);

  return {
    fileName: generatedFile,
    fileSize: stat.size,
    downloadUrl: publicDownloadUrl(generatedFile),
    expiresInMinutes: Number(process.env.DOWNLOAD_TTL_MINUTES || 10)
  };
};
