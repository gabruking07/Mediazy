import fs from 'fs-extra';
import path from 'node:path';
import sanitize from 'sanitize-filename';
import ytdlp from 'yt-dlp-exec';
import { nanoid } from 'nanoid';
import { downloadsDir, publicDownloadUrl } from '../utils/files.js';
import { isShortFormVideo } from '../utils/platform.js';

const ytdlpBaseOptions = {
  noWarnings: true,
  noCallHome: true,
  preferFreeFormats: true,
  forceIpv4: true
};

const youtubeOptions = {
  extractorArgs: 'youtube:player_client=android,web'
};

const optionsForPlatform = (platform) => (
  platform === 'YouTube' ? youtubeOptions : {}
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

export const fetchMediaInfo = async ({ url, platform }) => {
  let info;

  try {
    info = await ytdlp(url, {
      ...ytdlpBaseOptions,
      ...optionsForPlatform(platform),
      dumpSingleJson: true,
      skipDownload: true
    });
  } catch (error) {
    console.error('yt-dlp info failed:', error.message);
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

const runDownload = async (url, options) => {
  await ytdlp(url, {
    ...ytdlpBaseOptions,
    ...options
  });
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

  await runDownload(url, {
    ...optionsForPlatform(platform),
    ...ytdlpOptions,
    output: outputTemplate
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
