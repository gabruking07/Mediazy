import fs from 'fs-extra';
import path from 'node:path';
import { addDownloadJob, getDownloadJob, getDownloadQueueEvents, isDownloadQueueEnabled } from '../queues/downloadQueue.js';
import { cacheKey, getCachedJson, setCachedJson } from '../services/cacheService.js';
import { listHistory, recordDownload } from '../services/historyService.js';
import { createDownload, fetchMediaInfo, getCookieStatus, getInstagramCookieStatus } from '../services/ytdlpService.js';
import { downloadsDir, publicBaseUrlFromRequest } from '../utils/files.js';
import { parseSupportedUrl } from '../utils/platform.js';

const allowedTypes = new Set(['video', 'audio', 'subtitles', 'thumbnail']);
const allowedVideoFormats = new Set(['mp4', 'webm', 'mkv']);

const getUnlimitedQuota = () => ({
  used: 0,
  limit: null,
  available: null,
  unlimited: true
});

const buildDirectDownloadInfo = ({ url, platform }) => ({
  id: url,
  url,
  platform,
  title: `${platform || 'Video'} direct download`,
  thumbnail: null,
  duration: null,
  durationText: 'Unknown',
  uploader: null,
  webpageUrl: url,
  isShortForm: false,
  isCollection: false,
  entryCount: 0,
  qualities: [{ label: 'Best available', value: 'best' }],
  hasSubtitles: false,
  automaticCaptions: false,
  previewUnavailable: true
});

export const getVideoInfo = async (req, res, next) => {
  try {
    const { normalizedUrl, platform } = parseSupportedUrl(req.body.url);
    const key = cacheKey('info', normalizedUrl, platform);
    const cached = await getCachedJson(key);
    let info = cached;

    if (!info) {
      try {
        info = await fetchMediaInfo({ url: normalizedUrl, platform });
        await setCachedJson(key, info);
      } catch (error) {
        console.warn('Video preview failed, allowing direct download:', error.publicMessage || error.message);
        info = buildDirectDownloadInfo({ url: normalizedUrl, platform });
      }
    }

    res.json(info);
  } catch (error) {
    error.publicMessage = error.publicMessage || (
      error.statusCode
        ? error.message
        : 'Unable to read this video. Check the URL and try again.'
    );
    next(error);
  }
};

export const getInstagramCookieDebug = async (_req, res, next) => {
  try {
    res.json(await getInstagramCookieStatus());
  } catch (error) {
    next(error);
  }
};

export const getCookieDebug = async (_req, res, next) => {
  try {
    res.json(await getCookieStatus());
  } catch (error) {
    next(error);
  }
};

export const downloadMedia = async (req, res, next) => {
  try {
    const { normalizedUrl, platform } = parseSupportedUrl(req.body.url);
    const type = allowedTypes.has(req.body.type) ? req.body.type : 'video';
    const quality = req.body.quality || 'best';
    const format = allowedVideoFormats.has(req.body.format) ? req.body.format : 'mp4';
    const payload = {
      url: normalizedUrl,
      platform,
      type,
      quality,
      format,
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
      publicBaseUrl: publicBaseUrlFromRequest(req)
    };

    if (req.user) {
      payload.user = String(req.user._id);
    }

    if (!isDownloadQueueEnabled()) {
      res.json(await executeDownload(payload));
      return;
    }

    const job = await addDownloadJob(payload);
    const queueEvents = getDownloadQueueEvents();
    const timeout = Number(process.env.DOWNLOAD_JOB_WAIT_TIMEOUT_MS || 170000);
    const result = await job.waitUntilFinished(queueEvents, timeout);

    res.json({ ...result, jobId: job.id });
  } catch (error) {
    error.publicMessage = error.publicMessage || (
      error.statusCode
        ? error.message
        : 'Download failed. The platform may be blocking this media or the format is unavailable.'
    );
    next(error);
  }
};

export const executeDownload = async ({
  url,
  platform,
  type,
  quality,
  format,
  user,
  ipAddress,
  userAgent,
  publicBaseUrl
}) => {
  const quota = getUnlimitedQuota();
  const key = cacheKey('info', url, platform);
  const cached = await getCachedJson(key);
  let info = cached;

  if (!info) {
    try {
      info = await fetchMediaInfo({ url, platform });
      await setCachedJson(key, info);
    } catch (error) {
      console.warn('Video info lookup failed, continuing with direct download:', error.publicMessage || error.message);
      info = {
        title: `${platform || 'Video'} download`
      };
    }
  }

  const result = await createDownload({
    url,
    platform,
    type,
    quality,
    format,
    title: info.title,
    publicBaseUrl
  });

  await recordDownload({
    url,
    platform,
    title: info.title,
    type,
    quality,
    format,
    fileName: result.fileName,
    fileSize: result.fileSize,
    ...(user ? { user } : {}),
    ipAddress,
    userAgent
  });

  return {
    ...result,
    title: info.title,
    platform,
    type,
    quality,
    format,
    quota
  };
};

export const getDownloadJobStatus = async (req, res, next) => {
  try {
    const job = await getDownloadJob(req.params.jobId);

    if (!job) {
      const error = new Error('Download job was not found.');
      error.statusCode = 404;
      throw error;
    }

    const state = await job.getState();

    res.json({
      id: job.id,
      state,
      progress: job.progress,
      result: job.returnvalue || null,
      failedReason: job.failedReason || null
    });
  } catch (error) {
    next(error);
  }
};

export const serveDownloadFile = async (req, res, next) => {
  const requestedFileName = req.params.fileName;
  const fileName = path.basename(requestedFileName);

  if (fileName !== requestedFileName) {
    const error = new Error('Invalid download file.');
    error.statusCode = 400;
    next(error);
    return;
  }

  const filePath = path.join(downloadsDir, fileName);

  try {
    const stat = await fs.stat(filePath);

    if (!stat.isFile()) {
      const error = new Error('Download file was not found.');
      error.statusCode = 404;
      throw error;
    }

    res.download(filePath, fileName, async (error) => {
      await fs.remove(filePath).catch((cleanupError) => {
        console.error('Download cleanup failed:', cleanupError.message);
      });

      if (error && !res.headersSent) {
        next(error);
      }
    });
  } catch (error) {
    error.statusCode = error.statusCode || 404;
    error.publicMessage = 'Download file was not found or has expired.';
    next(error);
  }
};

export const getQuota = async (req, res, next) => {
  try {
    res.json({ quota: getUnlimitedQuota(), authenticated: Boolean(req.user) });
  } catch (error) {
    next(error);
  }
};

export const getHistory = async (req, res, next) => {
  try {
    const history = await listHistory(req.user._id);
    res.json({ history });
  } catch (error) {
    next(error);
  }
};
