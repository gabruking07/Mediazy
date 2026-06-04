import fs from 'fs-extra';
import { execFile } from 'node:child_process';
import os from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';
import sanitize from 'sanitize-filename';
import ytdlp from 'yt-dlp-exec';
import { nanoid } from 'nanoid';
import { downloadsDir, publicDownloadUrl } from '../utils/files.js';
import { isShortFormVideo } from '../utils/platform.js';

const execFileAsync = promisify(execFile);

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

const splitEnvList = (name) => (
  (process.env[name] || '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean)
);

const pickProxy = () => {
  const pool = splitEnvList('ROTATING_RESIDENTIAL_PROXIES');
  if (pool.length) {
    return pool[Math.floor(Math.random() * pool.length)];
  }

  return process.env.YTDLP_PROXY || '';
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

const parseCookieLine = (line) => {
  const cleanLine = line.replace(/^#HttpOnly_/, '').trim();
  if (!cleanLine || cleanLine.startsWith('#')) return null;

  const parts = cleanLine.includes('\t')
    ? cleanLine.split('\t')
    : cleanLine.split(/\s+/);

  if (parts.length < 7) {
    return null;
  }

  return {
    domain: parts[0],
    name: parts[5],
    value: parts.slice(6).join('')
  };
};

const readCookieFile = async () => {
  const cookiesPath = await ensureCookiesFile();
  if (!cookiesPath) return [];

  try {
    const content = await fs.readFile(cookiesPath, 'utf8');
    return content
      .split(/\r?\n/)
      .map(parseCookieLine)
      .filter(Boolean);
  } catch {
    return [];
  }
};

const readCookiesForDomain = async (domainPattern) => (
  (await readCookieFile()).filter((cookie) => domainPattern.test(cookie.domain))
);

const readInstagramCookies = async () => (
  readCookiesForDomain(/(^|\.)instagram\.com$/i)
);

const instagramCookieHeader = async () => (
  (await readInstagramCookies())
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join('; ')
);

export const getInstagramCookieStatus = async () => {
  const cookies = await readInstagramCookies();
  const names = new Set(cookies.map((cookie) => cookie.name));

  return {
    configured: Boolean(process.env.YTDLP_COOKIES_PATH || process.env.YTDLP_COOKIES_BASE64),
    instagramCookieCount: cookies.length,
    hasSessionId: names.has('sessionid'),
    hasDsUserId: names.has('ds_user_id'),
    hasCsrfToken: names.has('csrftoken'),
    hasMid: names.has('mid')
  };
};

export const getCookieStatus = async () => {
  const cookies = await readCookieFile();
  const instagramCookies = cookies.filter((cookie) => /(^|\.)instagram\.com$/i.test(cookie.domain));
  const youtubeCookies = cookies.filter((cookie) => /(^|\.)(youtube\.com|google\.com)$/i.test(cookie.domain));
  const youtubeNames = new Set(youtubeCookies.map((cookie) => cookie.name));

  return {
    configured: Boolean(process.env.YTDLP_COOKIES_PATH || process.env.YTDLP_COOKIES_BASE64),
    totalCookieCount: cookies.length,
    instagramCookieCount: instagramCookies.length,
    youtubeCookieCount: youtubeCookies.length,
    hasYouTubeLoginInfo: youtubeNames.has('LOGIN_INFO'),
    hasYouTubeVisitorInfo: youtubeNames.has('VISITOR_INFO1_LIVE'),
    hasGoogleSid: youtubeNames.has('SID') || youtubeNames.has('__Secure-1PSID') || youtubeNames.has('__Secure-3PSID')
  };
};

const runtimeOptions = async () => {
  const cookies = await ensureCookiesFile();
  const proxy = pickProxy();

  return {
    ...(cookies ? { cookies } : {}),
    ...(proxy ? { proxy } : {}),
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

const instagramUsernamePattern = /^[A-Za-z0-9._]{1,30}$/;

const normalizeInstagramUsername = (value = '') => {
  const input = String(value).trim().replace(/^@+/, '');
  let username = input;

  try {
    const parsed = new URL(input.includes('://') ? input : `https://${input}`);
    if (/(^|\.)instagram\.com$/i.test(parsed.hostname.replace(/^www\./i, ''))) {
      const [firstPathPart, secondPathPart] = parsed.pathname.split('/').filter(Boolean);
      username = firstPathPart?.toLowerCase() === 'stories' ? secondPathPart || '' : firstPathPart || '';
    }
  } catch {
    username = input;
  }

  username = username.replace(/^@+/, '').trim();

  if (!instagramUsernamePattern.test(username)) {
    const error = new Error('Enter a valid Instagram username.');
    error.statusCode = 400;
    throw error;
  }

  return username;
};

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
    const pathParts = pathname.split('/').filter(Boolean);
    const isReservedStoryPath = pathParts[0] === 'stories' && pathParts[1] === `high${'lights'}`;

    return /(^|\.)instagram\.com$/i.test(hostname) &&
      (
        (pathname.startsWith('/stories/') && !isReservedStoryPath) ||
        /^\/[A-Za-z0-9._]+\/?$/.test(parsed.pathname) ||
        /^\/[A-Za-z0-9._]+\/reels?\/?$/.test(parsed.pathname)
      );
  } catch {
    return false;
  }
};

const instagramUsernameFromUrl = (url) => {
  const parsed = new URL(url);
  return parsed.pathname.split('/').filter(Boolean)[0] || '';
};

const instagramStoryUsernameFromUrl = (url) => {
  const parsed = new URL(url);
  const parts = parsed.pathname.split('/').filter(Boolean);
  return parts[0]?.toLowerCase() === 'stories' ? parts[1] || '' : '';
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

const isInstagramStoriesUsernameUrl = (url) => {
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname.replace(/^www\./i, '');
    const pathParts = parsed.pathname.toLowerCase().split('/').filter(Boolean);
    const isReservedStoryPath = pathParts[0] === 'stories' && pathParts[1] === `high${'lights'}`;

    return /(^|\.)instagram\.com$/i.test(hostname) &&
      parsed.pathname.toLowerCase().startsWith('/stories/') &&
      !isReservedStoryPath &&
      Boolean(instagramStoryUsernameFromUrl(url));
  } catch {
    return false;
  }
};

const instagramErrorMessage = (status) => {
  if (status === 400 || status === 404) {
    return 'Instagram username was not found or is invalid.';
  }

  if (status === 401 || status === 403 || status === 429) {
    return 'Instagram blocked this server session. Refresh YTDLP_COOKIES_BASE64 with logged-in Instagram cookies and try again.';
  }

  return 'Instagram could not be reached right now. Try again in a moment.';
};

const fetchInstagramJson = async (url) => {
  const response = await fetch(url, { headers: await instagramHeaders() });
  if (!response.ok) {
    const error = new Error(`Instagram returned ${response.status}`);
    error.statusCode = response.status === 404 ? 404 : undefined;
    error.publicMessage = instagramErrorMessage(response.status);
    throw error;
  }
  return response.json();
};

const getInstagramProfile = async (username) => {
  const profile = await fetchInstagramJson(`https://www.instagram.com/api/v1/users/web_profile_info/?username=${encodeURIComponent(username)}`);
  const user = profile?.data?.user;
  const userId = user?.id;

  if (!userId) {
    const error = new Error('Instagram user was not found.');
    error.statusCode = 404;
    error.publicMessage = 'Instagram username was not found or this profile cannot be viewed by the server session.';
    throw error;
  }

  if (user.is_private) {
    const error = new Error('Instagram account is private.');
    error.statusCode = 403;
    error.publicMessage = 'This Instagram account is private. Only public profiles can be fetched.';
    throw error;
  }

  return { profile, user, userId };
};

const mediaFromReelItem = (item, fallbackName) => {
  const video = item.video_versions?.[0];
  const image = item.image_versions2?.candidates?.[0];
  const mediaUrl = video?.url || image?.url;
  if (!mediaUrl) return null;

  return {
    id: item.id || fallbackName,
    url: mediaUrl,
    extension: video ? 'mp4' : 'jpg',
    thumbnail: image?.url || mediaUrl
  };
};

const resolveInstagramReelItems = async (reelId) => {
  const data = await fetchInstagramJson(`https://www.instagram.com/api/v1/feed/reels_media/?reel_ids=${encodeURIComponent(reelId)}`);
  const reel = data.reels?.[reelId] || data.reels_media?.[0] || data.tray?.[0] || {};
  return (reel.items || [])
    .map((item, index) => mediaFromReelItem(item, `${reelId}-${index + 1}`))
    .filter(Boolean);
};

const resolveInstagramStoriesForProfile = async ({ username, userId }) => {
  const items = await resolveInstagramReelItems(userId);

  if (!items.length) {
    const error = new Error('No active Instagram stories found.');
    error.statusCode = 404;
    error.publicMessage = 'No active stories are available for this public profile.';
    throw error;
  }

  return {
    username,
    title: `Story by ${username}`,
    thumbnail: items[0]?.thumbnail,
    items
  };
};

const resolveInstagramStories = async (url) => {
  const username = normalizeInstagramUsername(instagramStoryUsernameFromUrl(url));
  const { userId } = await getInstagramProfile(username);
  return resolveInstagramStoriesForProfile({ username, userId });
};

const resolveDirectInstagramCollection = async (url) => {
  if (isInstagramStoriesUsernameUrl(url)) {
    return resolveInstagramStories(url);
  }

  return null;
};

const mediaInfoFromInstagramCollection = ({ target, url, platform, shortForm }) => ({
  id: target.username,
  url,
  platform,
  title: target.title,
  thumbnail: target.thumbnail,
  duration: null,
  durationText: 'Multiple items',
  uploader: target.username,
  webpageUrl: `https://www.instagram.com/${target.username}/`,
  isShortForm: shortForm,
  isCollection: true,
  entryCount: target.items.length,
  qualities: [{ label: 'Best available', value: 'best' }],
  hasSubtitles: false,
  automaticCaptions: false
});

const sectionResult = async (factory) => {
  try {
    const info = await factory();
    return { ok: true, info };
  } catch (error) {
    return {
      ok: false,
      message: error.publicMessage || error.message || 'This section could not be loaded.'
    };
  }
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

const fetchFallbackApiInfo = async ({ url, platform }) => {
  if (!process.env.EXTRACTOR_FALLBACK_API_URL) {
    return null;
  }

  const response = await fetch(process.env.EXTRACTOR_FALLBACK_API_URL, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      ...(process.env.EXTRACTOR_FALLBACK_API_KEY
        ? { authorization: `Bearer ${process.env.EXTRACTOR_FALLBACK_API_KEY}` }
        : {})
    },
    body: JSON.stringify({ url, platform })
  });

  if (!response.ok) {
    const error = new Error(`Fallback API returned ${response.status}`);
    error.publicMessage = 'The fallback extractor could not read this link right now.';
    throw error;
  }

  return response.json();
};

const normalizeExternalInfo = ({ raw, url, platform }) => {
  if (!raw) return null;

  const info = Array.isArray(raw) ? raw.find(Boolean) : raw;
  const title = info.title || info.description || info.id;
  const mediaUrl = info.webpage_url || info.webpageUrl || info.url || url;

  if (!title && !mediaUrl) {
    return null;
  }

  return {
    id: info.id || mediaUrl,
    url,
    platform,
    title: title || 'Untitled media',
    thumbnail: info.thumbnail || info.thumbnail_url || null,
    duration: info.duration || null,
    durationText: secondsToDuration(info.duration),
    uploader: info.uploader || info.author || info.channel || null,
    webpageUrl: mediaUrl,
    isShortForm: isShortFormVideo({ platform, url, duration: info.duration }),
    isCollection: false,
    entryCount: 0,
    qualities: [{ label: 'Best available', value: 'best' }],
    hasSubtitles: false,
    automaticCaptions: false,
    extractor: info.extractor || 'fallback'
  };
};

const fetchGalleryDlInfo = async ({ url, platform }) => {
  const binary = process.env.GALLERY_DL_BINARY || 'gallery-dl';
  const args = ['--dump-json'];
  const proxy = pickProxy();

  if (proxy) {
    args.push('--proxy', proxy);
  }

  args.push(url);

  try {
    const { stdout } = await execFileAsync(binary, args, {
      timeout: Number(process.env.GALLERY_DL_TIMEOUT_MS || 60000),
      maxBuffer: 20 * 1024 * 1024
    });
    const jsonLine = stdout.split(/\r?\n/).find((line) => line.trim().startsWith('{'));
    return normalizeExternalInfo({
      raw: jsonLine ? JSON.parse(jsonLine) : null,
      url,
      platform
    });
  } catch (error) {
    console.error('gallery-dl info failed:', error.stderr || error.message);
    return null;
  }
};

const fetchFallbackInfo = async ({ url, platform }) => {
  const galleryInfo = await fetchGalleryDlInfo({ url, platform });
  if (galleryInfo) return galleryInfo;

  return normalizeExternalInfo({
    raw: await fetchFallbackApiInfo({ url, platform }),
    url,
    platform
  });
};

const publicYtdlpError = (error, platform = 'This platform') => {
  const rawMessage = formatYtdlpError(error);
  const lowerMessage = rawMessage.toLowerCase();

  if (/requested format is not available|no video formats found|format .* not available/i.test(rawMessage)) {
    return 'That quality or format is not available for this media. Try Best available or another format.';
  }

  if (/private|members-only|login required|sign in|cookies|not authorized|forbidden|confirm you.?re not a bot/i.test(rawMessage)) {
    return `${platform} needs a logged-in server session for this request, or the platform is blocking this server as automated traffic. Refresh the server cookies and try again.`;
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
  if (isInstagramStoriesUsernameUrl(url)) {
    const target = await resolveInstagramStories(url);
    return mediaInfoFromInstagramCollection({ target, url, platform, shortForm: true });
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
    const fallbackInfo = await fetchFallbackInfo({ url, platform });
    if (fallbackInfo) {
      return fallbackInfo;
    }

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

export const fetchInstagramProfileMedia = async ({ username: rawUsername }) => {
  const username = normalizeInstagramUsername(rawUsername);
  const { userId } = await getInstagramProfile(username);
  const storyUrl = `https://www.instagram.com/stories/${username}/`;
  const reelsUrl = `https://www.instagram.com/${username}/reels/`;
  const profileUrl = `https://www.instagram.com/${username}/`;

  const [stories, reels, profile] = await Promise.all([
    sectionResult(async () => mediaInfoFromInstagramCollection({
      target: await resolveInstagramStoriesForProfile({ username, userId }),
      url: storyUrl,
      platform: 'Instagram Stories',
      shortForm: true
    })),
    sectionResult(() => fetchMediaInfo({ url: reelsUrl, platform: 'Instagram Reels' })),
    sectionResult(() => fetchMediaInfo({ url: profileUrl, platform: 'Instagram' }))
  ]);

  return {
    username,
    sections: {
      stories,
      reels,
      profile
    }
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

const downloadDirectInstagramItems = async ({ items, fileBase }) => {
  const headers = await instagramHeaders();

  return Promise.all(items.map(async (item, index) => {
    const fileName = `${fileBase}-${String(index + 1).padStart(3, '0')}-${sanitize(item.id || 'instagram')}.${item.extension}`;
    const filePath = path.join(downloadsDir, fileName);
    const response = await fetch(item.url, { headers });

    if (!response.ok) {
      const error = new Error(`Instagram media returned ${response.status}`);
      error.publicMessage = 'Instagram returned the story list, but blocked one of the media files during download. Refresh the cookies and try again.';
      throw error;
    }

    await fs.writeFile(filePath, Buffer.from(await response.arrayBuffer()));
    return fileName;
  }));
};

export const createDownload = async ({ url, platform, type, quality, format = 'mp4', title }) => {
  const videoFormat = ['mp4', 'webm', 'mkv'].includes(format) ? format : 'mp4';
  const isCollection = isInstagramCollectionUrl(url);
  const directInstagramTarget = await resolveDirectInstagramCollection(url);
  const collectionUrls = [url];
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
      ? `bestvideo[height<=${quality}][ext=${videoFormat}]+bestaudio[ext=m4a]/bestvideo[height<=${quality}][ext=${videoFormat}]+bestaudio/best[height<=${quality}][ext=${videoFormat}]/best[height<=${quality}]/best`
      : `bestvideo[ext=${videoFormat}]+bestaudio[ext=m4a]/bestvideo[ext=${videoFormat}]+bestaudio/best[ext=${videoFormat}]/best`;

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

  if (directInstagramTarget) {
    await downloadDirectInstagramItems({
      items: directInstagramTarget.items,
      fileBase
    });
  } else {
    for (const collectionUrl of collectionUrls) {
      await runYtdlpWithFallbacks({
        url: collectionUrl,
        platform,
        options: {
          ...ytdlpOptions,
          ...(isCollection ? { allowPlaylist: true } : {}),
          output: outputTemplate
        }
      });
    }
  }

  const filesAfterDownload = await fs.readdir(downloadsDir);
  const matchingFiles = filesAfterDownload.filter((file) => file.startsWith(fileBase) && file !== requestedFileName);

  if (isCollection) {
    if (!matchingFiles.length) {
      const error = new Error('No story media was found.');
      error.publicMessage = 'No active story media was found. Instagram may require a logged-in server session even for public profiles.';
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

  const refreshedFiles = isCollection ? filesAfterDownload : await fs.readdir(downloadsDir);
  const generatedFile = isCollection
    ? requestedFileName
    : refreshedFiles.find((file) => file.startsWith(fileBase)) || requestedFileName;
  const finalPath = path.join(downloadsDir, generatedFile);
  const stat = await fs.stat(finalPath);

  return {
    fileName: generatedFile,
    fileSize: stat.size,
    downloadUrl: publicDownloadUrl(generatedFile),
    expiresInMinutes: Number(process.env.DOWNLOAD_TTL_MINUTES || 10)
  };
};
